#!/bin/bash
# ----------------------------------------------------------------------------------------------------------------------
# This script generates the package archive with all node modules bundled
#
# 1. check if git working copy is clean
# 2. if an argument is passed, perform the next steps for that particular lambda, else do it for all lambdas
# 3. create a workspace directory in .tmp (delete if present)
# 4. copy the lambda function to the workspace
# 5. fresh npm install and test this newly copied source
# 6. zip the contents of the folder to the out directory
# 7. cleanup!
#
# ----------------------------------------------------------------------------------------------------------------------

# stop on error
set -e;

SWD=$PWD;

# the workspace path to be used for creating the package
PACK_DIR=".tmp/pack";

# base paths
LAMBDA_BASE_DIR="lambdas";
OUT_BASE_DIR="$SWD/out";

# function to be called on exit
# and ensure cleanup is called before the script exits
function cleanup {
  cd "$SWD"; # switch to starting work directory

  if [ "$?" != "0" ]; then
    echo -e "\033[31m\nPackaging failed!\033\n";
    exit 1;
  fi
}
trap cleanup EXIT;

function archive () {
    LAMBDA_FUNCTION=$1;
    LAMBDA_DIR="$LAMBDA_BASE_DIR/$LAMBDA_FUNCTION";
    LAMBDA_OUT_DIR="$OUT_BASE_DIR/$LAMBDA_FUNCTION";
    LAMBDA_VERSION=`sed -n 's/^[[:blank:]]*"version":[[:blank:]]"\(.*\)",/\1/p' $LAMBDA_DIR/package.json`;

    [ -d "$PACK_DIR" ] && rm -rf "$PACK_DIR";
    mkdir -p "$PACK_DIR";
    cp -r "$LAMBDA_DIR"/* "$PACK_DIR";

    cd "$PACK_DIR";
    [ -d node_modules ] && rm -rf node_modules/;

    npm install;

    mkdir -p "$LAMBDA_OUT_DIR";
    zip -r "$LAMBDA_OUT_DIR/v$LAMBDA_VERSION.zip" .;

    cd "$SWD";
}

echo "Starting the packaging procedure.";

# ensure that the working tree is clean
source ./scripts/archive/require_clean_work_tree.sh;
require_clean_work_tree "create archive";

if [ -n "$1" ]; then
    archive $1;
else
    for LAMBDA in "$LAMBDA_BASE_DIR"/*/; do
        archive $(basename $LAMBDA);
    done
fi
