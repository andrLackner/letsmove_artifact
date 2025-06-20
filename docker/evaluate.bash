#!/bin/bash

rm -f ./results/*
npx hardhat test

files=(
    "aptos_gas"
    "rosetta_gas"
    "erc20_gas"
)

for file in "${files[@]}"; do
    if [ -f "./results/$file.csv" ]; then
        awk -F';' '
        {
            group = $1
            value = $3
            sum[group] += value
            count[group] += 1
        }
        END {
            for (g in sum) {
                avg = sum[g] / count[g]
                printf "%s;%d\n", g, avg
            }
        }
        ' "./results/$file.csv" | sort > "./results/$file""_final.csv"
    fi
done