import type { Genre, ProgramSort, ProgramType } from '../models/program.model';
import type { ReviewGroup } from '../models/review.model';
import type { UserType } from '../models/user.model';

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
