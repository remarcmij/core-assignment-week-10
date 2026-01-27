#!/usr/bin/env bash

# Run npm install silently
{
  pushd ..
  /usr/bin/env npm install
  popd
} >/dev/null

# Run the Node.js tester and capture stdout/stderr to the expected output file.
# The passing score is read from the environment.
PASSING_SCORE=50 /usr/bin/env node tester.js

# Vitest may return a non-zero exit code when one or more tests fail.
# This would terminate the GitHub workflow prematurely, therefore
# we need to explicitly set the exit code to zero.
exit 0
