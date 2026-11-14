// TEMPORARY sample reviews, used while environment.mockReviewList is true (the backend doesn't
// have GET /programs/:id/reviews yet). Every program shows these same reviews. Delete this file
// once that endpoint exists.

import type { Observable } from 'rxjs';
import { delay, of } from 'rxjs';

import type { Page } from '../../models/api.model';
import type { ProgramReview, ReviewGroup } from '../../models/review.model';
import type { UserType } from '../../models/user.model';

const NETWORK_DELAY_MS = 300;

function review(
  id: string,
  username: string,
  type: UserType,
  points: number,
  date: string,
  comment: string | null,
): ProgramReview {
  return {
    _id: id,
    author: { _id: `user-${username}`, username, type },
    program: 'sample',
    points,
    comment,
    createdAt: date,
    updatedAt: date,
  };
}

// Newest first, like the API.
const CRITICS: ProgramReview[] = [
  review(
    'c1',
    'maria.reviews',
    'critic',
    95,
    '2026-03-03T00:00:00.000Z',
    'A towering, patient epic. The sound design alone is worth the ticket.',
  ),
  review(
    'c2',
    'cinefilo_ve',
    'critic',
    88,
    '2026-03-02T00:00:00.000Z',
    'Gorgeous and overwhelming, though the final act rushes a few beats.',
  ),
  review('c3', 'nightscreen', 'critic', 80, '2026-02-28T00:00:00.000Z', null),
  review(
    'c4',
    'reel.talk',
    'critic',
    72,
    '2026-02-20T00:00:00.000Z',
    'Ambitious and beautiful, but it asks a lot of patience.',
  ),
  review('c5', 'frame_by_frame', 'critic', 91, '2026-02-15T00:00:00.000Z', 'The best use of a big screen in years.'),
  review('c6', 'the.critic.desk', 'critic', 64, '2026-02-10T00:00:00.000Z', 'Impressive craft, cold characters.'),
];

const AUDIENCE: ProgramReview[] = [
  review('a1', 'jose23', 'normal', 100, '2026-03-05T00:00:00.000Z', 'Watched it twice in one week. No regrets.'),
  review('a2', 'ana.m', 'normal', 72, '2026-03-04T00:00:00.000Z', null),
  review('a3', 'popcornpete', 'normal', 45, '2026-03-01T00:00:00.000Z', 'Too long for me, but the visuals are unreal.'),
  review('a4', 'admin', 'admin', 85, '2026-02-25T00:00:00.000Z', 'Great pick for a movie night.'),
  review('a5', 'luisa_r', 'normal', 18, '2026-02-21T00:00:00.000Z', 'Fell asleep halfway through, sorry.'),
  review('a6', 'cami.watch', 'normal', 90, '2026-02-18T00:00:00.000Z', 'The music is still in my head.'),
  review('a7', 'tomas_g', 'normal', 60, '2026-02-12T00:00:00.000Z', null),
];

export function mockListReviews(group: ReviewGroup, page: number, limit: number): Observable<Page<ProgramReview>> {
  const all = group === 'critics' ? CRITICS : AUDIENCE;
  const start = (page - 1) * limit;
  const result: Page<ProgramReview> = { data: all.slice(start, start + limit), page, limit, total: all.length };
  return of(result).pipe(delay(NETWORK_DELAY_MS));
}
