// Imports the titles of seed-titles.json with full detail. Safe to run many times (pnpm seed).
import { readFile } from 'node:fs/promises';
import { connectDB, disconnectDB } from '../config/db.js';
import { importProgramWithDetail, ImportResult } from '../services/program.service.js';

const SEED_FILE = new URL('./seed-titles.json', import.meta.url);
const FAILURE_EXIT_CODE = 1;

const imdbIds = JSON.parse(await readFile(SEED_FILE, 'utf8'));
const counts = Object.fromEntries(Object.values(ImportResult).map((result) => [result, 0]));

await connectDB();
try {
  // One title at a time: gentle with OMDb, and the log stays in order.
  for (const imdbId of imdbIds) {
    const result = await importProgramWithDetail(imdbId);
    counts[result] += 1;
    console.log(`${imdbId}: ${result}`);
  }
} finally {
  await disconnectDB();
}

console.log('Seed finished:', counts);
if (counts[ImportResult.FAILED] > 0) process.exitCode = FAILURE_EXIT_CODE;
