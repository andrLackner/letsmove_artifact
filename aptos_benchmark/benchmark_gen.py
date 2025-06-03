import csv
import requests
import gzip
import codecs
import time
import re
import subprocess
import os

if "CONTACT_INFO" not in os.environ:
    print("Please set up your CONTACT_INFO first (as an env variable). Let the server know who you are!")
    exit(1)

contact=os.environ["CONTACT_INFO"]

if len(contact) == 0:
    print("CONTACT_INFO should not be empty!")
    exit(1)

if "BOOKMARK" in os.environ:
    bookmark = int(os.environ["BOOKMARK"])
else: 
    bookmark = 0

def loadData():
    accounts=[]
    basedir=os.path.dirname(__file__)
    path = os.path.join(basedir, "module_accounts.csv")
    with open(path) as csvfile:
        for row in csv.reader(csvfile):
            accounts.append(row[0])
    return accounts

def getApiUrl (account):
    url = "https://api.aptoscan.com/v1/accounts/{account}/sc-modules?cluster=mainnet".format(account=account)
    return url

def getModulesFrom(account):
    url = getApiUrl(account)
    ua = "Mozilla/5.0 (I am a bot; contact {} if we hit you too hard)".format(contact)
    mods = requests.get(url, headers={"User-Agent": ua}).json()["data"]
    return mods

def unzipSource(compressed):
    return gzip.decompress(codecs.decode(compressed, "hex"))
    
def isSourceAvailable(module):
    return module["source"] != "0x"

def extractCode(module):
    compressed = module["source"][2:]
    return unzipSource(compressed).decode("utf-8")

def isTrivial(source):
    return len(source) < 200

def isAptosSpecific(source):
    denyList = [
        "use aptos",
        "aptos_framework",
    ]

    for entry in denyList:
        if len(re.findall(entry, source)) > 0:
            return True
    return False

def isSupported(source):
    denyList = [
        "use (?!.*(std::))"
    ]

    for entry in denyList:
        if len(re.findall(entry, source)) > 0:
            return False
    return True


# setup folder structure
folders = [
    "benchmark",
    "benchmark/aptos",
    "benchmark/candidates",
    "benchmark/no_source",
    "benchmark/trivial",
    "benchmark/unsupported"
]

for folder in folders:
    if not os.path.isdir(folder):
        os.mkdir(folder)


accounts = loadData()[bookmark:]

for account in accounts:
    print("Requesting modules of {acc}".format(acc=account))
    
    modules = getModulesFrom(account)

    print("Found {num} module(s)".format(num=len(modules)))

    for module in modules:
        if not isSourceAvailable(module):
            out_dir="no_source"
            content=""
        else:
            content=extractCode(module)
            if isTrivial(content):
                out_dir="trivial"
            elif isAptosSpecific(content):
                out_dir="aptos"
            elif isSupported(content):
                out_dir="candidates"
            else:
                out_dir="unsupported"

        
        out="benchmark/{dir}/{acc}_{mod}.move".format(dir=out_dir, acc=account, mod=module["name"])
        print("-> Writing to {out}".format(out=out))
        with open(out, "w") as f:
            f.write(content)

        print("-> Compressing {out}".format(out=out))
        subprocess.run(["zstd", out, "-oq", "{out}.zst".format(out=out)])
        os.remove(out)

        # Please don't remove me! We do not want to stress the server, right? :-)
        # Grab a coffee (or two) while the script does it's job
        time.sleep(1)

    print("Bookmark={b}".format(b=bookmark))
    bookmark+=1
