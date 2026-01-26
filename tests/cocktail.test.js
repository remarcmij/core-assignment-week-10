import fs from 'fs/promises';
import path from 'path';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { main } from '../task-1/cocktail.js';

import { data } from './drinks.js';

let lines = [];

beforeAll(async () => {
  const originalArgv = process.argv;
  process.argv = ['node', 'main.js', 'margarita']; // Example cocktail name

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );

  // Mock console.log to suppress output during test
  const originalConsoleLog = console.log;
  console.log = () => {};

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `../output/margarita.md`);
  await fs.unlink(outPath).catch(() => {});

  await main();

  // Restore original process.argv and console.log
  process.argv = originalArgv;
  console.log = originalConsoleLog;

  try {
    const content = await fs.readFile(outPath, 'utf-8');
    lines = content.trim().split('\n');
  } catch (error) {
    console.error('Error reading generated markdown file:', error);
  }
});

describe('Content tests', () => {
  test('Markdown file created', async () => {
    expect(lines.length).toBeGreaterThan(0);
  });

  test('Content starts with # Cocktail Recipes', async () => {
    expect(lines[0]).toBe('# Cocktail Recipes');
  });

  test('Content includes drink name as ## Margarita', async () => {
    expect(lines).toContain('## Margarita');
  });

  test('Content includes medium drink image', async () => {
    expect(lines).toContain(
      '![Margarita](https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg/medium)'
    );
  });

  test('Content includes category and alcoholic info', async () => {
    expect(lines).toContain('**Category**: Ordinary Drink');
    expect(lines).toContain('**Alcoholic**: Yes');
  });

  test('Content includes header ### Ingredients', async () => {
    expect(lines).toContain('### Ingredients');
  });

  test('Content includes ingredients list', async () => {
    expect(lines).toContain('- 1 1/2 oz Tequila');
    expect(lines).toContain('- 1/2 oz Triple sec');
    expect(lines).toContain('- 1 oz Lime juice');
    expect(lines).toContain('- Salt');
  });

  test('Content includes header ### Instructions', async () => {
    expect(lines).toContain('### Instructions');
  });

  test('Content includes instruction details', async () => {
    expect(lines).toContain('Rub the rim of the glass.');
  });

  test('Content includes glass type', async () => {
    expect(lines).toContain('Serve in: Cocktail glass');
  });
});

describe('Error handling', () => {
  test('Calls console.error() if no cocktail name argument provided', async () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'main.js']; // No cocktail name

    // Mock console.log to capture output
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await main();

    expect(consoleErrorMock).toHaveBeenCalled();

    // Restore original process.argv and console.log
    process.argv = originalArgv;
    consoleErrorMock.mockRestore();
  });

  test('Calls console.error() if cocktail not found', async () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'main.js', 'nonexistentcocktail']; // Example cocktail name

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ drinks: null }),
      })
    );

    // Mock console.log to capture output
    const consoleLogMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await main();

    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining('No cocktails found with that name.')
    );

    // Restore original process.argv and console.log
    process.argv = originalArgv;
    consoleLogMock.mockRestore();

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('Calls console.error() if fetch was not OK', async () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'main.js', 'margarita']; // Example cocktail name

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })
    );

    // Mock console.log to suppress output during test
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await main();

    expect(consoleErrorMock).toHaveBeenCalled();

    // Restore original process.argv and console.log
    process.argv = originalArgv;
    consoleErrorMock.mockRestore();

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
