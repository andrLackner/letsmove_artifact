#!/bin/bash


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

SOL=$(cut -f 2 -d \; "$SCRIPT_DIR/solidity/results/rosetta_gas_final.csv")
IRM=$(cut -f 2 -d \;  "$SCRIPT_DIR/irm/results/rosetta_gas_final.csv" | cut -f 2 -d \;)
ORIG=$(cut -f 2 -d \;  "$SCRIPT_DIR/original/results/rosetta_gas_final.csv" | cut -f 2 -d \;)


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

echo "C3.1 Overhead IRM vs ORIGINAL: $R1T ($R1R%)"
echo "C3.2 Overhead IRM vs SOLIDITY: $R2T ($R2R):"
echo "C3.2 Overhead IRM vs SOLIDITY: $R3T ($R):"