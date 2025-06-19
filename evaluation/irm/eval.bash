#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
RESULT="$SCRIPT_DIR/results/gas.json"

function grepResult() {
    contract=$1
    shift

    tsum=0
    tnum=0

    for result in "$@"; do
        gas=$(cat "$RESULT" | jq ".data.methods.$result.gasData")
        sum=$(echo "$gas" | jq ". | add")
        num=$(echo "$gas" | jq ". | length")
        
        tsum=$(($tsum + $sum))
        tnum=$(($tnum + $num))
    done

    result=$(($tsum / $tnum))
    echo "$contract;$result"
}

grepResult "aptos" "aliens_events_6f260334" "aliens_events_6f260334"
grepResult "base64" "base64_49145c91" "base64_6a11b2a8"
grepResult "bytes32" "bytes32_6f260334" 
grepResult "circle_int" "Circle_Intersections_Module_77841b8d" "Circle_Intersections_Module_da806b91"
grepResult "counter" "counter_6f260334"
grepResult "full_math" "full_math_u64_d059a39e" "full_math_u64_9df15a42" "full_math_u64_452e15c6" "full_math_u64_d1419319" "full_math_u64_5198c9f5" "full_math_u64_95dbdee5"
grepResult "i64" "i64_6f260334"
grepResult "imperfect_locker" imperfect_locker_6f260334
grepResult "math" "math_505e00bd" "math_09b45194" "math_557e71ac" "math_1aaae892" "math_79b4cc58" "math_011f6e5e" "math_44a48d67" "math_6f260334" "math_a849b24f" "math_31941bcb" "math_7ac3c02f" "math_51789fab"
grepResult "math2" "math2_593f41d4" "math2_823c397e" "math2_33c11758" "math2_bd475345" "math2_44a48d67"
grepResult "multi_admin" "MultiAdmin_6f260334"
grepResult "nav" "nav_6f260334"
grepResult "picture" "Module_Domain_IV_Picture_363fd203" "Module_Domain_IV_Picture_da806b91" "Module_Domain_IV_Picture_9b01d96a" "Module_Domain_IV_Picture_5d6df199"
grepResult "req_lev" "req_lev_6f260334"
grepResult "token" "Token_70a08231" "Token_8129fc1c" "Token_fb9d09c8" "Token_6f260334"
grepResult "token_mod" "TokenModule_f8b2cb4f" "TokenModule_6f260334"
grepResult "uq64x64" "uq64x64_6f260334"


grepResult "test" "AuctionBasicCoin_6f260334"