import type { ProgramType } from '../models/program.model';
import type { ReviewGroup } from '../models/review.model';

// Ionicons names. A component that shows one must register it with addIcons().

// Movie = clapperboard, Series = TV, the same drawings as assets/icons/movieIcon.jpg and serieIcon.jpg.
// Those two JPGs are watermarked stock previews with the checkered "transparent" background baked
// in, so they can't be shown as they are. To use your own icons, put a PNG/SVG with a real
// transparent background in assets/icons/ and show it in program-card-simple instead.
export const PROGRAM_TYPE_ICONS: Record<ProgramType, string> = {
  movie: 'film-outline',
  series: 'tv-outline',
};

// Critics = badge, Audience = people, so the two scores don't depend on color alone.
export const REVIEW_GROUP_ICONS: Record<ReviewGroup, string> = {
  critics: 'ribbon-outline',
  audience: 'people-outline',
};
