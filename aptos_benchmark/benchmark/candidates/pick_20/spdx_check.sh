#!/bin/bash

function getNote() {
    echo "
================================================================================
                             Source Code Access Notice
================================================================================

This source code is either subject to a license that prohibits redistribution, or
its license could not be clearly identified. However, you can manually retrieve
the source code for this module using the "get_benchmark.py" script by running
the following command:

    python3 get_benchmark.py $1 $2

If you intend to use this data solely for scientific purposes, you are also
welcome to contact one of the authors.
"
}

FILE=$1
SPDX=$(zstdcat $FILE | grep -F "SPDX")


dirname=$(dirname $FILE)
basename=$(basename -s '.move.zst' $FILE)

if [[ $SPDX =~ "MIT" ]] || [[ $SPDX =~ "Apache-2.0" ]]; then
    echo "File $basename is free, keeping it!"
else
    echo "Replacing $basename by note"
    account=$(echo $basename | sed -E 's/(0x[a-f0-9]+)_.*$/\1/')
    module=$(echo $basename | sed -E 's/0x[a-f0-9]+_(.*)$/\1/')

    rm $1
    echo "$(getNote $account $module)" > "$dirname/$basename.txt"
fi