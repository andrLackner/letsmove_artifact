import csv
import requests
import gzip
import codecs
import subprocess
import os
import sys


def loadData():
    accounts=[]
    with open("module_accounts.csv") as csvfile:
        for row in csv.reader(csvfile):
            accounts.append(row[0])
    return accounts

def getApiUrl (account):
    url = "https://api.aptoscan.com/v1/accounts/{account}/sc-modules?cluster=mainnet".format(account=account)
    return url

def getModulesFrom(account):
    url = getApiUrl(account)
    ua = "Mozilla/5.0"
    mods = requests.get(url, headers={"User-Agent": ua}).json()["data"]
    return mods

def unzipSource(compressed):
    return gzip.decompress(codecs.decode(compressed, "hex"))
    
def isSourceAvailable(module):
    return module["source"] != "0x"

def extractCode(module):
    compressed = module["source"][2:]
    return unzipSource(compressed).decode("utf-8")


if len(sys.argv) != 3:
    print("Usage: {} ACCOUNT_ID MODULE_NAME".format(sys.argv[0]))
    exit(1)

account=sys.argv[1]
mod=sys.argv[2]

print("Requesting modules of {}".format(account))
modules = getModulesFrom(account)

if(len(modules) == 0):
    print("No modules found for {}".format(account))
    exit(1)

for module in modules:
    if module["name"] != mod:
        continue

    if not isSourceAvailable(module):
        print("This module does not provide any source code :-(")
        exit(0)
    
    content=extractCode(module)

    basedir=os.path.dirname(__file__)
    out="{acc}_{mod}.move".format(acc=account, mod=module["name"])
    print("-> Writing to {}".format(out))
    with open(out, "w") as f:
        f.write(content)

    print("-> Compressing {out}".format(out=out))
    subprocess.run(["zstd", out, "-qfo", "{out}.zst".format(out=out)])
    os.remove(out)
    exit(0)

print("Module not found in account {}".format(account))
