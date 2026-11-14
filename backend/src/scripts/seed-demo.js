// Demo data for presentations: real titles + demo users + generated reviews. Safe to run many times.
//   pnpm seed:demo           → creates what is missing
//   pnpm seed:demo --reset   → deletes the demo users and their reviews (averages are recalculated)
import { readFile } from 'node:fs/promises';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { UserType } from '../constants/enums.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ReviewLimits } from '../constants/reviewLimits.js';
import { AppError } from '../utils/AppError.js';
import { register } from '../services/auth.service.js';
import { findUserByUsername, changeUserType, deleteMe } from '../services/user.service.js';
import { createReview } from '../services/review.service.js';
import {
  importProgramWithDetail,
  ImportResult,
  getProgramsByExternalIds,
} from '../services/program.service.js';

const RESET_FLAG = '--reset';
const FAILURE_EXIT_CODE = 1;

// Review generation (deterministic: the same user and title always get the same review).
const PERCENT = 100;
const REVIEW_CHANCE_PERCENT = 60; // each user reviews about 60% of the titles
const NO_COMMENT_PERCENT = 20; // about 20% of reviews have no comment
const QUALITY_MIN = 55; // each title gets a base quality from 55 to 95
const QUALITY_RANGE = 41;
const USER_VARIATION = 15; // each user gives up to ±15 points around the base
const CRITIC_STRICTNESS = 5; // critics give 5 points less on average
const HIGH_SCORE = 80;
const MID_SCORE = 55;

// FNV-1a hash: a small, deterministic number from a text.
const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

function hashText(text) {
  let hash = FNV_OFFSET_BASIS;
  for (const character of text) {
    hash = Math.imul(hash ^ character.codePointAt(0), FNV_PRIME) >>> 0;
  }
  return hash;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function wantsToReview(username, externalId) {
  return hashText(`${username}|${externalId}|review`) % PERCENT < REVIEW_CHANCE_PERCENT;
}

function pointsFor(demoUser, externalId) {
  const quality = QUALITY_MIN + (hashText(externalId) % QUALITY_RANGE);
  const variation = (hashText(`${demoUser.username}|${externalId}|points`) % (2 * USER_VARIATION + 1)) - USER_VARIATION;
  const strictness = demoUser.type === UserType.CRITIC ? CRITIC_STRICTNESS : 0;
  return clamp(quality + variation - strictness, ReviewLimits.POINTS_MIN, ReviewLimits.POINTS_MAX);
}

function commentFor(username, externalId, points, comments) {
  const seed = hashText(`${username}|${externalId}|comment`);
  if (seed % PERCENT < NO_COMMENT_PERCENT) return null;

  let bank = comments.low;
  if (points >= HIGH_SCORE) bank = comments.high;
  else if (points >= MID_SCORE) bank = comments.mid;
  return bank[seed % bank.length];
}

async function readJson(fileName) {
  return JSON.parse(await readFile(new URL(fileName, import.meta.url), 'utf8'));
}

// ── Reset ───────────────────────────────────────────────────────────────────

async function resetDemo(demoUsers) {
  let deleted = 0;
  for (const { username } of demoUsers) {
    const user = await findUserByUsername(username);
    if (!user) continue;
    await deleteMe(user); // cascade: reviews → user → recalculation (Step 16)
    deleted += 1;
    console.log(`${username}: deleted`);
  }
  console.log(`Demo reset finished: ${deleted} demo users deleted.`);
}

// ── Create ──────────────────────────────────────────────────────────────────

async function ensureDemoUser(demoUser) {
  const existing = await findUserByUsername(demoUser.username);
  if (existing) return { user: existing, created: false };

  const { user } = await register({
    username: demoUser.username,
    email: demoUser.email,
    password: env.DEMO_USER_PASSWORD,
  });
  if (demoUser.type === UserType.CRITIC) {
    await changeUserType(user._id, UserType.CRITIC);
  }
  return { user: await findUserByUsername(demoUser.username), created: true };
}

async function createDemo(titleIds, demo) {
  // 1. Titles with full detail (Step 17 logic).
  const titleCounts = Object.fromEntries(Object.values(ImportResult).map((result) => [result, 0]));
  for (const imdbId of titleIds) {
    titleCounts[await importProgramWithDetail(imdbId)] += 1;
  }
  console.log('Titles:', titleCounts);

  // 2. Demo users.
  const users = [];
  let usersCreated = 0;
  for (const demoUser of demo.users) {
    const { user, created } = await ensureDemoUser(demoUser);
    users.push({ demoUser, user });
    if (created) usersCreated += 1;
  }
  console.log(`Users: ${usersCreated} created, ${users.length - usersCreated} already existed`);

  // 3. Reviews.
  const programs = await getProgramsByExternalIds(titleIds);
  let reviewsCreated = 0;
  let reviewsSkipped = 0;
  for (const { demoUser, user } of users) {
    for (const program of programs) {
      if (!wantsToReview(demoUser.username, program.externalId)) continue;

      const points = pointsFor(demoUser, program.externalId);
      const comment = commentFor(demoUser.username, program.externalId, points, demo.comments);
      try {
        await createReview(user, program._id, { points, comment });
        reviewsCreated += 1;
      } catch (err) {
        const alreadyReviewed = err instanceof AppError && err.status === HttpStatus.CONFLICT;
        if (!alreadyReviewed) throw err;
        reviewsSkipped += 1;
      }
    }
  }
  console.log(`Reviews: ${reviewsCreated} created, ${reviewsSkipped} already existed`);

  return titleCounts[ImportResult.FAILED];
}

// ── Main ────────────────────────────────────────────────────────────────────

const isReset = process.argv.includes(RESET_FLAG);
const demo = await readJson('./demo-data.json');
const titleIds = await readJson('./seed-titles.json');

if (!isReset && !env.DEMO_USER_PASSWORD) {
  console.error('Set DEMO_USER_PASSWORD in backend/.env before running pnpm seed:demo.');
  process.exit(FAILURE_EXIT_CODE);
}

await connectDB();
try {
  if (isReset) {
    await resetDemo(demo.users);
  } else {
    const failedTitles = await createDemo(titleIds, demo);
    if (failedTitles > 0) process.exitCode = FAILURE_EXIT_CODE;
  }
} finally {
  await disconnectDB();
}
