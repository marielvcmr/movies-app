// Dark backgrounds for posters without an image (same palette as the mockups).
const TONES = [
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

// Picks one tone from the text, so the same title always gets the same color.
export function posterTone(text: string): string {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return TONES[hash % TONES.length];
}
