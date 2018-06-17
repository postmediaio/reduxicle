#!/usr/bin/env bash
echo "Enter package name"
read package_name
cwd=$(pwd)

mkdir "$cwd/packages/reduxicle-$package_name"
cd "$cwd/packages/reduxicle-$package_name"

package_file="{\n
  \"name\": \"@reduxicle/$package_name\",\n
  \"version\": \"0.1.0\",\n
  \"main\": \"index.js\",\n
  \"author\": \"Postmedia IO\",\n
  \"license\": \"MIT\",\n
  \"scripts\": {\n
      \"test\": \"cd ../../ && TEST_PACKAGE=reduxicle-$package_name yarn test\",\n
     \"build\": \"gulp build --package=reduxicle-$package_name\",\n
     \"build:watch\": \"gulp build:watch --package=reduxicle-$package_name\"\n
  },\n
  \"files\": [\n
     \"lib\",\n
     \"index.d.ts\",\n
     \"index.js\",\n
     \"README.md\"\n
  ],\n
  \"devDependencies\": {\n
     \"@types/node\": \"9\",\n
     \"@types/sinon\": \"^5.0.1\",\n
     \"sinon\": \"^5.1.1\"\n
  },\n
  \"dependencies\": {\n
    \"@reduxicle/core\": \"x.x.x\"\n
  }\n
}\n"

index_file="module.exports = require('./lib/index.js');"
src_index_file="export const answer: number = 42;"


echo $package_file >> package.json
echo $index_file >> index.js
mkdir src
echo $src_index_file >> src/index.ts
cd ../../
yarn
cd "packages/reduxicle-$package_name"
yarn build
