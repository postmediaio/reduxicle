#!/usr/bin/env bash
echo "Enter new version"
read new_version
cwd=$(pwd)

find packages/reduxicle-* -prune -type d | while read d; do
    echo $d
    cd "$cwd/$d"
    npm version --no-git-tag-version $new_version
done

