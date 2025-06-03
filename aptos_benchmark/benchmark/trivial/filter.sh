#!/bin/sh

file=$1
content=$(zstdcat $1)
comp=$(echo "$content" | sed "/^\s*\/\//d;" | tr -d "[:space:]\n")

# Check again if more than 3 lines
lc=$(echo "$content" | wc -l)

if [ $lc -le 3 ]; then
	exit 0
fi


pattern="^module(0x)?[a-zA-Z0-9_-]+::[a-zA-Z0-9_-]+\{(struct[a-zA-Z0-9_-]+\{\})*\}$"

if echo "$comp" | grep -qE "$pattern"; then
	exit 0
fi

echo $1


