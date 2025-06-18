#!/bin/bash

YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color


function showExpFolderStructure() {
    local target
    if [ $# -eq 1 ]; then
        target="Cannot find $1"
    else
        target="Unexpected Folder Structure"
    fi

    echo $target
    echo "artifact_root
├── aptos_benchmark
├── docker
│   ├── hardhat-move
│   ├── hardhat-test
│   └── move
├── Dockerfile
├── evaluation
│   ├── attach.bash
│   ├── contracts
│   ├── libs
│   ├── ...
├── gas_prices
└── lets-move-to-evm"
}

function reject() {
    mode=$1
    if [ "$mode" == "exit" ]; then
        exit 1
    else
        echo "no"
    fi
}

function check() {
    path=$1
    type=$2
    name=$(basename $path)
    dir=$(dirname $path)

    if [ "$type" == "dir" ]; then
        if [ ! -d "$SCRIPT_DIR/../$path" ]; then
            showExpFolderStructure "$name in $dir"
            exit 1
        fi
    else
        if [ ! -f "$SCRIPT_DIR/../$path" ]; then
            showExpFolderStructure "$name in $dir"
            exit 1
        fi
    fi
}

function getModName() {
    acc=$1
    mod=$2

    if [[ $mod = "math" ]] && [[ "$acc" =~ ^0x5307ab72.*$ ]]; then
        echo "math2"
    elif [[ $mod = "contract" ]]; then
        echo "nav"
    else
        echo "$mod"
    fi
}

function writeMoveToml() {
    echo "[package]
name = "'"'"$1"'"'"
version = "'"'"0.0.0"'"'"

[dependencies]
EvmStdlib = { local = "'"'"../../../libs/stdlib"'"'" }" > "$2/Move.toml"
}

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )


# Loading Aptos Benchmarks

## First, check the folder structure
files=(
0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e_math.move.txt
0x0910ba00e95ba168f4f4e7ed261a92a199d75b1bf1b5a2c5da3f0bf1dcb00af8_date.move
0x10e94332b34f7bc1ffb4ee6455566dec57af60bb8ba2eff47f1fffd4e731d33d_aliens_events.txt
0x15aa2e621f592264e1b726374fd3c5a41a9927f1332c14cdb2b47c95e339ba10_TokenModule.txt
0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c_uq64x64.move.txt
0x29b0709f4f433b9a92f9f8d2690d24f21985c9c2363ac49503a0e3e3aa9e7080_Circle_Intersections_Module.move.txt
0x3800237570b1785dcb7e788d7858be48a885f96faaf94c894516c43b4dcd76c3_contract.move.txt
0x5307ab72309475ca0ea84ead9124d1931e76df1a6dd86ddd050bc0fe1a317c60_math.move.txt
0x718f20ae37f309e0aa59fcbe38eb731b73f01aa1459a01d1e157f347c3c6db6d_base64.move
0x76889126132b55bbc79692244fd42b97c0fa2ccb6a4d3658cb14b5737d19e34f_offer.move.txt
0x84d2cca2d2ef38438f93eaa2ef6ce876817dd52d175aac7a9ec308c4ecf75441_req_lev.move.txt
0xa5eca327e3ba1bd3c46594faf43fad5b2bc6b0e6d9a244ea7ae9dc22cd27d0b9_Token.move.txt
0xaaff464474b94bdb37e4d14fb2bd9ed8eadc9e34d3b74dd95f67f42be8467f5a_counter.move.txt
0xdc30257cf0a47029819834963ac65346bb44e77054a82c5d437e5e16d7a48e53_imperfect_locker.move.txt
0xdc9ba0b6c2f8e52c1172e90551e8e5b0e89c43c7d664249ddb93329bffeb61ef_Module_Domain_IV_Picture.move.txt
0xe1dc2a62b445403bea0dbd73df8cee03b3ead0a06b003e72e401c030a810a133_bytes32.move.txt
0xe1dc2a62b445403bea0dbd73df8cee03b3ead0a06b003e72e401c030a810a133_universal_config.move.txt
0xf03607bec13972d4768441ed8eb30a50e88804808f61e4f1c355e525f851277c_full_math_u64.move.txt
0xfef14aeb54ee33cadc8277685b008e001e9b7d69635f82c88f34247f6bd98b54_MultiAdmin.move.txt
0xfff1e5bad5901cdb1c6755ece8603b992b3f0000a3e5b96d8d0bdc49d6433fff_i64.move.txt
)

for file in "${files[@]}"
do
  check "aptos_benchmark/benchmark/candidates/pick_20/$file" "file"
done


mkdir -p $SCRIPT_DIR/tmp
cd $SCRIPT_DIR/tmp

for file in "${files[@]}"
do
    acc=$(echo $file | sed -E 's/(0x[a-f0-9]+).*/\1/')
    mod=$(echo $file | sed -E 's/0x[a-f0-9]+_([^\.]+).*$/\1/')


    name=$(getModName $acc $mod)
    dir="$SCRIPT_DIR/../evaluation/contracts/aptos/$name/sources"
    file="$dir/$name.move"
    patch="$SCRIPT_DIR/../evaluation/patches/aptos/$name/$name.diff"

    if [ ! -f "$patch" ]; then
        echo -e "${YELLOW}[skipped]${NC} $name (${acc::10}...)"
        continue
    fi

    mkdir -p "$dir"
    writeMoveToml "$name" "$dir/../"
    
    python3 $SCRIPT_DIR/get_benchmark.py $acc $mod > /dev/null
    zstdcat -f "$SCRIPT_DIR/tmp/$acc""_$mod.move.zst" > $file
    echo -e "${GREEN}[loaded] ${NC} $name (${acc::10}...)"

    patch -s $file < $patch
    echo -e "${GREEN}[patched]${NC} $name (${acc::10}...)"
done

rm -R $SCRIPT_DIR/tmp