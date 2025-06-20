#!/bin/bash


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

SOL=$(cut -f 2 -d \; "$SCRIPT_DIR/solidity/results/erc20_gas_final.csv")
IRM_MV=$(grep "erc20_mv" "$SCRIPT_DIR/irm/results/erc20_gas_final.csv" | cut -f 2 -d \;)
IRM_COIN=$(grep "erc-coin" "$SCRIPT_DIR/irm/results/erc20_gas_final.csv" | cut -f 2 -d \;)
ORIGINAL_MV=$(grep "erc20_mv" "$SCRIPT_DIR/original/results/erc20_gas_final.csv" | cut -f 2 -d \;)
ORIGINAL_COIN=$(grep "erc-coin" "$SCRIPT_DIR/original/results/erc20_gas_final.csv" | cut -f 2 -d \;)


R1=$(echo "($ORIGINAL_MV - $SOL)*100/$SOL" | bc)
R2=$(echo "($ORIGINAL_COIN - $SOL)*100/$SOL" | bc)
R3=$(echo "($IRM_COIN - $SOL)*100/$SOL" | bc)
R4=$(echo "($IRM_COIN - $ORIGINAL_COIN)*100/($IRM_COIN - $SOL)" | bc)

echo "ERC-20:               $SOL"
echo "ERC-20MV (Original):  $ORIGINAL_MV"
echo "ERC-20MV (IRM):       $IRM_MV"
echo "ERC-Coin (Original):  $ORIGINAL_COIN"
echo "ERC-Coin (IRM):       $IRM_COIN"

echo -e "\n\n"

echo -e "C2.1: ERC-20 vs ERC-20MV:           \t$R1%"
echo -e "C2.2: ERC-20 vs ERC-Coin (Original):\t$R2%"
echo -e "C2.3: ERC-20 vs ERC-Coin (IRM):     \t$R3%"
echo -e "C2.4: Overhead due to protections:  \t$R4%"

