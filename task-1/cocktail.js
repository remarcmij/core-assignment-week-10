// API documentation: https://www.thecocktaildb.com/api.php
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

function createDrinkDetails(drink) {
  const lines = [];

  lines.push(`## ${drink.strDrink}\n`);
  if (drink.strDrinkThumb) {
    lines.push(`![${drink.strDrink}](${drink.strDrinkThumb}/medium)\n`);
  }
  lines.push(`**Category**: ${drink.strCategory}\n\n`);
  // lines.push(
  //   `**Alcoholic**: ${drink.strAlcoholic == 'Alcoholic' ? 'Yes' : 'No'}\n`
  // );
  lines.push(`### Ingredients\n`);
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient) {
      if (measure) {
        lines.push(`- ${measure.trim()} ${ingredient.trim()}`);
      } else {
        lines.push(`- ${ingredient.trim()}`);
      }
    }
  }
  lines.push(`\n### Instructions\n`);
  lines.push(`${drink.strInstructions}\n`);
  lines.push(`Serve in: ${drink.strGlass}\n`);
  return lines;
}

function createMarkdownContent(drinks) {
  let lines = [];
  lines.push(`# Cocktail Recipes\n`);
  for (const drink of drinks) {
    lines = lines.concat(createDrinkDetails(drink));
  }
  return lines.join('\n');
}

export async function main() {
  if (process.argv.length < 3) {
    console.error('Please provide a cocktail name as a command line argument.');
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `../output/${cocktailName}.md`);

  try {
    const data = await fetchData(url);

    if (data.drinks) {
      const content = createMarkdownContent(data.drinks);
      await fs.writeFile(outPath, content, 'utf-8');

      console.log(`Markdown file created for ${cocktailName}`);
    } else {
      console.error('No cocktails found with that name.');
    }
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}

if (!process.env.VITEST) {
  main();
}
