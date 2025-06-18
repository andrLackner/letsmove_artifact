#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 DOCKER_CONTAINER_NAME"
    exit 1
fi

DCN="$1"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )



docker run --rm                                            \
    -v $SCRIPT_DIR/contracts:/app/hardhat-test/contracts   \
    -v $SCRIPT_DIR/test:/app/hardhat-test/test             \
    -v $SCRIPT_DIR/libs:/app/hardhat-test/libs             \
    -v $SCRIPT_DIR/results:/app/hardhat-test/results             \
    -ti $DCN bash