#!/bin/sh


num=$1

groups=$(ls ./grouped/ | sort | head -n "$num")

out="pick_$num"
mkdir -p "$out"

for group in $groups; do
  candidate=$(ls "./grouped/$group" | sort | head -n 1)
  file=$(basename -s .zst $candidate)
  zstdcat "grouped/$group/$candidate" > "$out/$file"
done
