// API documentation: https://www.thecocktaildb.com/api.php

import path from 'path';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

// Add helper functions as needed here

export async function main() {
  if (process.argv.length < 3) {
    console.log('Please provide a cocktail name as a command line argument.');
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `../output/${cocktailName}.md`);

  try {
    // 1. Fetch data from the API at the given URL
    // 2. Generate markdown content to match the examples
    // 3. Write the generated content to a markdown file as given by outPath
  } catch (error) {
    // 4. Handle errors
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
