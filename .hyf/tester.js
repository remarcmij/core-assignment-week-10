import fs from 'fs/promises';
import path from 'path';

const __dirname = import.meta.dirname;
const reportPath = path.join(__dirname, 'report.json');

try {
  const reportContent = await fs.readFile(reportPath, 'utf-8');
  await fs.unlink(reportPath);

  const { testResults } = JSON.parse(reportContent);
  let maxPoints = 0;
  let earnedPoints = 0;
  let passedCount = 0;
  let failedCount = 0;

  console.log('Vitest unit test results:\n');

  const passingScore = Number(process.env.PASSING_SCORE || 50);

  for (const result of testResults) {
    for (const { title, status } of result.assertionResults) {
      const match = title.match(/^\[(\d+)]/);
      const points = match ? Number(match[1]) || 1 : 1;
      maxPoints += points;
      let icon;
      if (status === 'passed') {
        icon = '✅';
        passedCount += 1;
        earnedPoints += points;
      } else {
        icon = '❌';
        failedCount += 1;
      }
      console.log(`${icon} ${title}`);
    }
  }

  console.log(`\nTotal passed: ${passedCount}`);
  console.log(`Total failed: ${failedCount}`);

  const totalScore = Math.round((earnedPoints / maxPoints) * 100);

  const results = {
    score: totalScore,
    pass: totalScore >= passingScore,
    passingScore: passingScore,
  };

  await fs.writeFile('score.json', JSON.stringify(results, null, 2));
  process.exit(0);
} catch (error) {
  console.error('Error parsing report JSON:', error);
  process.exit(1);
}
