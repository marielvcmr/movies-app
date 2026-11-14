// Average score as text: 89.6 → "90". No reviews (null) → "—".
export function formatScore(points: number | null): string {
  return points === null ? '—' : String(Math.round(points));
}

// ISO date → "Mar 1, 2024". null → null.
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC', // the API stores release dates at midnight UTC
  });
}

// 166 → "166 min". null → null.
export function formatMinutes(minutes: number | null): string | null {
  return minutes === null ? null : `${minutes} min`;
}

// (2, 'season') → "2 seasons", (1, 'season') → "1 season". null → null.
export function formatCount(count: number | null, singular: string, plural = `${singular}s`): string | null {
  if (count === null) return null;
  return `${count} ${count === 1 ? singular : plural}`;
}
