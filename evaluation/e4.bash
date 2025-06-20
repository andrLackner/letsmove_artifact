#!/bin/bash


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

IRM=$(cut -f 2 -d \;  "$SCRIPT_DIR/irm/results/aptos_gas_final.csv" | sort | cut -f 2 -d \;)
ORIG=$(cut -f 2 -d \;  "$SCRIPT_DIR/original/results/aptos_gas_final.csv" | sort | cut -f 2 -d \;)


IRM_TOTAL=$(echo "$IRM" | paste -sd+ - | bc)
ORIG_TOTAL=$(echo "$ORIG" | paste -sd+ - | bc)

IRM_N=$(echo "$IRM" | wc -l)
ORIG_N=$(echo "$ORIG" | wc -l)

R1T=$(echo "(($IRM_TOTAL / $IRM_N)-($ORIG_TOTAL / $ORIG_N))" | bc)
R1R=$(echo "(($IRM_TOTAL / $IRM_N)-($ORIG_TOTAL / $ORIG_N))*100/($ORIG_TOTAL / $ORIG_N)" | bc)

echo "C4 Overhead IRM vs ORIGINAL: $R1T ($R1R%)"