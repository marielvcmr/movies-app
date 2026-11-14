// Combining marks left over after splitting "é" into "e" + "´" (Unicode NFD).
const DIACRITICS_PATTERN = /\p{Diacritic}/gu;

// "Amélie " → "amelie". Used to store titleNormalized and, in Step 12, to normalize the search text the same way.
export function normalizeTitle(text) {
  return text.normalize('NFD').replace(DIACRITICS_PATTERN, '').toLowerCase().trim();
}
