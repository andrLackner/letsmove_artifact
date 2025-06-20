#!/bin/bash


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

LBL=$(sort "$SCRIPT_DIR/solidity/results/rosetta_gas_final.csv" | cut -f 1 -d \;)
readarray -t LBL_ARR < <(echo "$LBL")

SOL=$(sort "$SCRIPT_DIR/solidity/results/rosetta_gas_final.csv" | cut -f 2 -d \;)
readarray -t SOL_ARR < <(echo "$SOL")
IRM=$(sort "$SCRIPT_DIR/irm/results/rosetta_gas_final.csv" | cut -f 2 -d \;)
readarray -t IRM_ARR < <(echo "$IRM")
ORIG=$(sort  "$SCRIPT_DIR/original/results/rosetta_gas_final.csv" | cut -f 2 -d \;)
readarray -t ORIG_ARR < <(echo "$ORIG")
OLD=(194000 155000 129000 134000 100000 147000 79000 168000 134000 215000)


GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'


echo "------------------------------------------------------------"
printf "%-15s %-10s %-10s %-10s %-10s \n" "Contract" "IRM" "M2E" "Sol" "Correction"
echo "------------------------------------------------------------"
for ((i=0; i<${#SOL_ARR[@]}; i++)); do
    label=${LBL_ARR[i]}
    sol=${SOL_ARR[i]}
    m2e=${ORIG_ARR[i]}
    irm=${IRM_ARR[i]}
    paper=${OLD[i]}

    rel_diff=$(echo "($irm - $paper)*100/$paper" | bc)

    if (( $(echo "$irm > $paper" | bc -l) )); then
        printf "%-15s %-10s %-10s %-10s ${YELLOW}~%-10s${NC}\n" "$label" "$irm" "$m2e" "$sol" "$rel_diff%"
    else
        printf "%-15s %-10s %-10s %-10s ${GREEN}%-10s${NC}\n" "$label" "$irm" "$m2e" "$sol" "$rel_diff%"
    fi

    
done
echo "----------------------------------------------------------"
echo -e "----------------------------------------------------------\n\n"




SOL_TOTAL=$(echo "$SOL" | paste -sd+ - | bc)
IRM_TOTAL=$(echo "$IRM" | paste -sd+ - | bc)
ORIG_TOTAL=$(echo "$ORIG" | paste -sd+ - | bc)

SOL_N=$(echo "$SOL" | wc -l)
IRM_N=$(echo "$IRM" | wc -l)
ORIG_N=$(echo "$ORIG" | wc -l)

R1T=$(echo "(($IRM_TOTAL / $IRM_N)-($ORIG_TOTAL / $ORIG_N))" | bc)
R1R=$(echo "(($IRM_TOTAL / $IRM_N)-($ORIG_TOTAL / $ORIG_N))*100/($ORIG_TOTAL / $ORIG_N)" | bc)

R2T=$(echo "(($IRM_TOTAL / $IRM_N)-($SOL_TOTAL / $SOL_N))" | bc)
R2R=$(echo "(($IRM_TOTAL / $IRM_N)-($SOL_TOTAL / $SOL_N))*100/($SOL_TOTAL / $SOL_N)" | bc)

R2=$(echo "$IRM_TOTAL / $IRM_N" | bc)

R3=$(echo "$ORIG_TOTAL / $ORIG_N" | bc)

echo "C3.1 Overhead IRM vs ORIGINAL: $R1T"
echo "C3.2 Overhead IRM vs SOLIDITY: $R2T"