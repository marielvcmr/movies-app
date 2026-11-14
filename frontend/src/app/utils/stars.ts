const POINTS_PER_STAR = 20;
const MAX_STARS = 5;

// Stars for a score (frontend README → "Puntajes y estrellas"):
// 1–20 → 1, 21–40 → 2, 41–60 → 3, 61–80 → 4, 81–100 → 5. No score (null) → 0.
export function toStars(points: number | null): number {
  if (points === null) return 0;
  return Math.min(MAX_STARS, Math.max(1, Math.ceil(points / POINTS_PER_STAR)));
}

// Lowest score that still shows `stars` stars: 1 → 1, 2 → 21, 3 → 41, 4 → 61, 5 → 81.
// 0 stars → 0 (no minimum). Used to turn the "min. stars" filter into minCritics/minAudience.
export function starsToMinPoints(stars: number): number {
  return stars <= 0 ? 0 : (stars - 1) * POINTS_PER_STAR + 1;
}
