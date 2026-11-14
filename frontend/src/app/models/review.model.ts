// The two score groups of a program (backend: GET /programs/:id/reviews?group=...).
// - critics:  reviews written by `critic` users  → program.pointsMeanCritics
// - audience: reviews written by `normal` (standard) and `admin` users → program.pointsMeanNormal
export type ReviewGroup = 'critics' | 'audience';
