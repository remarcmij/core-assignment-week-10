#!/usr/bin/env bash

# Run the Node.js tester and capture stdout/stderr to the expected output file
cd .. && /usr/bin/env npm install
cd .hyf && NO_COLOR=true /usr/bin/env node tester.js
exit 0
