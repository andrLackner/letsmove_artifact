#!/bin/bash


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

LBL=$(sort "$SCRIPT_DIR/irm/results/aptos_gas_final.csv" | cut -f 1 -d \;)
readarray -t LBL_ARR < <(echo "$LBL")

IRM=$(sort "$SCRIPT_DIR/irm/results/aptos_gas_final.csv" | cut -f 2 -d \;)
readarray -t IRM_ARR < <(echo "$IRM")

ORIG=$(sort "$SCRIPT_DIR/original/results/aptos_gas_final.csv" | cut -f 2 -d \;)
readarray -t ORIG_ARR < <(echo "$ORIG")

echo "------------------------------------------------------------"
printf "%-20s %-10s %-10s %-10s\n" "Contract" "IRM" "M2E" "DIFF"
echo "------------------------------------------------------------"
for ((i=0; i<${#IRM_ARR[@]}; i++)); do
    label=${LBL_ARR[i]}
    m2e=${ORIG_ARR[i]}
    irm=${IRM_ARR[i]}

    diff=$(echo "$irm-$m2e" | bc)

    printf "%-20s %-10s %-10s %-10s\n" "$label" "$irm" "$m2e" "$diff"
done
echo "----------------------------------------------------------"
echo -e "----------------------------------------------------------\n\n"



IRM_TOTAL=$(echo "$IRM" | paste -sd+ - | bc)
ORIG_TOTAL=$(echo "$ORIG" | paste -sd+ - | bc)

IRM_N=$(echo "$IRM" | wc -l)
ORIG_N=$(echo "$ORIG" | wc -l)

R1T=$(echo "(($IRM_TOTAL / $IRM_N)-($ORIG_TOTAL / $ORIG_N))" | bc)
R1R=$(echo "(($IRM_TOTAL / $IRM_N)-($ORIG_TOTAL / $ORIG_N))*100/($ORIG_TOTAL / $ORIG_N)" | bc)

echo "C4 Overhead IRM vs ORIGINAL: $R1T ($R1R%)"