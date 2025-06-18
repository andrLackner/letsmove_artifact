#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 (IRM|ORIGINAL) DOCKER_CONTAINER_NAME"
    exit 1
fi

ENV="$1"
DCN="$2"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [ "$ENV" == "IRM" ]; then
    compiler="irm"
elif [ "$ENV" == "ORIGINAL" ]; then
    compiler="original"
else 
    echo "Unknown compiler $compiler"
fi

echo "$compiler"

docker run --rm                                                         \
    -v $SCRIPT_DIR/$compiler/contracts:/app/hardhat-test/contracts      \
    -v $SCRIPT_DIR/$compiler/test:/app/hardhat-test/test                \
    -v $SCRIPT_DIR/common/libs:/app/hardhat-test/libs                   \
    -v $SCRIPT_DIR/$compiler/results:/app/hardhat-test/results          \
    -e MOVE_COMPILER="$ENV"                                             \
    -ti $DCN bash                                                 