#!/usr/bin/env bash

# Run the Node.js tester and capture stdout/stderr to the expected output file
{
  pushd ..
  /usr/bin/env npm install
  popd
} >/dev/null

NO_COLOR=true PASSING_SCORE=50 /usr/bin/env node tester.js
exit 0
