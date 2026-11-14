import type { UserType } from './user.model';

// The two score groups of a program (backend: GET /programs/:id/reviews?group=...).
// - critics:  reviews written by `critic` users  → program.pointsMeanCritics
// - audience: reviews written by `normal` (standard) and `admin` users → program.pointsMeanNormal
export type ReviewGroup = 'critics' | 'audience';

// A review as POST /programs/:id/reviews and GET .../reviews/mine return it.
// `author` and `program` are only ids here.
export interface Review {
  _id: string;
  author: string;
  program: string;
  points: number; // 1–100
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// The author as the review lists bring it (populate('author', 'username type')).
export interface ReviewAuthor {
  _id: string;
  username: string;
  type: UserType;
}

// A review inside the list of a program: same fields, but with the author's name and type.
export interface ProgramReview extends Omit<Review, 'author'> {
  author: ReviewAuthor;
}

// Body of POST /programs/:id/reviews and PATCH /reviews/:id.
export interface ReviewInput {
  points: number;
  comment: string | null;
}
