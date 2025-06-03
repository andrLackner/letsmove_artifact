#!/bin/sh


file=$1
hash=$(md5sum "$1" | awk '{print $1}')
dir="./grouped/$hash/"

mkdir -p "$dir"
cp "$1" "$dir"
