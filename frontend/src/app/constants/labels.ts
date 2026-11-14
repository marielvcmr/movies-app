import type { Genre, ProgramSort, ProgramType } from '../models/program.model';
import type { ReviewGroup } from '../models/review.model';
import type { AssignableUserType, UserType } from '../models/user.model';

// The API stores stable keys ('science_fiction'); the app shows these English labels ("Sci-Fi").
// `Record<Genre, string>` makes TypeScript complain if a genre is missing here.
export const GENRE_LABELS: Record<Genre, string> = {
  action: 'Action',
  adventure: 'Adventure',
  animation: 'Animation',
  biography: 'Biography',
  comedy: 'Comedy',
  crime: 'Crime',
  documentary: 'Documentary',
  drama: 'Drama',
  family: 'Family',
  fantasy: 'Fantasy',
  history: 'History',
  horror: 'Horror',
  music: 'Music',
  mystery: 'Mystery',
  reality: 'Reality',
  romance: 'Romance',
  science_fiction: 'Sci-Fi',
  sport: 'Sport',
  thriller: 'Thriller',
  war: 'War',
  western: 'Western',
  other: 'Other',
};

export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  movie: 'Movie',
  series: 'Series',
};

// Movies / Series tabs on Home.
export const PROGRAM_TYPE_PLURAL_LABELS: Record<ProgramType, string> = {
  movie: 'Movies',
  series: 'Series',
};

export const SORT_LABELS: Record<ProgramSort, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  critics: 'Critics score',
  audience: 'Audience score',
};

export const REVIEW_GROUP_LABELS: Record<ReviewGroup, string> = {
  critics: 'Critics',
  audience: 'Audience',
};

// Badge of each user type (profiles, Users module).
export const USER_TYPE_LABELS: Record<UserType, string> = {
  normal: 'Normal user',
  critic: 'Critic',
  admin: 'Admin',
};

// Options of user-type-selector. The same component shows one list or the other:
//   Details → Critics / Audience (whose reviews to show)
//   Users   → Normal / Critic   (the type of a user, admins only)
export interface SelectorOption<T extends string> {
  value: T;
  label: string;
}

export const REVIEW_GROUP_OPTIONS: SelectorOption<ReviewGroup>[] = [
  { value: 'critics', label: REVIEW_GROUP_LABELS.critics },
  { value: 'audience', label: REVIEW_GROUP_LABELS.audience },
];

export const ASSIGNABLE_USER_TYPE_OPTIONS: SelectorOption<AssignableUserType>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'critic', label: 'Critic' },
];

// Chips of user-filter (Users module). null = every type.
export const USER_FILTER_OPTIONS: { value: UserType | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'normal', label: 'Normal' },
  { value: 'critic', label: 'Critics' },
];
