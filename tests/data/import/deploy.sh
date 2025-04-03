set -eu

DEFAULT_ENV=""
POS_ENV="${1:-$DEFAULT_ENV}"
TEST_TOKEN="${TEST_TOKEN}"

pos-cli data clean $POS_ENV --auto-confirm --include-schema

pos-cli deploy $POS_ENV
cd ./tests/post_import
env CONFIG_FILE_PATH=./../../.pos pos-cli deploy -p $POS_ENV
cd -
pos-cli constants set --name POS_CI_REPO_ACCESS_TOKEN --value $TEST_TOKEN $POS_ENV