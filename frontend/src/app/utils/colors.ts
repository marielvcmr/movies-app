// Dark backgrounds for posters without an image (same palette as the mockups).
const POSTER_TONES = [
  '#5A3A1C',
  '#3D2A22',
  '#7A2E4F',
  '#2E3B5C',
  '#26302E',
  '#4A3420',
  '#2C3A2A',
  '#23324A',
  '#34402A',
  '#4B2A22',
  '#22394A',
  '#2B2433',
];

// Brighter colors for the round avatar of a review's author.
const AVATAR_COLORS = ['#8E3B2E', '#3B5A8E', '#4E6B3A', '#6B3A6B', '#8E6B2E', '#2E7A7A', '#7A2E4F', '#5A4E8E'];

// Picks one item from the text, so the same text always gets the same item.
function pickByText(text: string, options: string[]): string {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return options[hash % options.length];
}

// "Dune" → always the same dark tone.
export function posterTone(title: string): string {
  return pickByText(title, POSTER_TONES);
}

// "maria.reviews" → always the same avatar color.
export function avatarColor(username: string): string {
  return pickByText(username, AVATAR_COLORS);
}
