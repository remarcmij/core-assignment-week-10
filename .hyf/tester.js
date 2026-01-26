import fs from 'fs/promises';
import { startVitest } from 'vitest/node';

const __dirname = import.meta.dirname;
process.chdir(__dirname);

const outputFile = 'temp.json';

await startVitest(
  'test',
  [], // CLI filters
  {
    include: ['../**/*.test.js'],
    reporters: ['json', 'default'],
    outputFile: outputFile,
    watch: false,
  }, // override test config
  {}, // override Vite config
  {} // custom Vitest options
);

const reportContent = await fs.readFile(outputFile, 'utf-8');
await fs.unlink(outputFile).catch(() => {});

try {
  const { testResults } = JSON.parse(reportContent);
  let testCount = 0;
  let passedCount = 0;
  for (const result of testResults) {
    for (const assertionResult of result.assertionResults) {
      const { status } = assertionResult;
      if (status == 'passed') {
        passedCount++;
      }
      testCount++;
    }
  }

  const PASSING_SCORE = 50;
  const totalScore = (passedCount / testCount) * 100;

  const results = {
    score: totalScore,
    pass: totalScore >= PASSING_SCORE,
    passingScore: PASSING_SCORE,
  };

  await fs.writeFile('score.json', JSON.stringify(results, null, 2));
} catch (error) {
  console.error('Error parsing report JSON:', error);
  process.exit(1);
}
