// Copy of UserType in backend/src/constants/enums.js. Keep the values identical.
export const UserType = {
  NORMAL: 'normal',
  CRITIC: 'critic',
  ADMIN: 'admin',
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];

// A user as the API returns it (login, register, GET /auth/me). Dates come as ISO text.
export interface User {
  _id: string;
  username: string;
  email: string;
  type: UserType;
  createdAt: string;
  updatedAt: string;
}

// Public profile of any user (GET /users/:id). Never has the email.
// The two numbers are calculated from the user's reviews; pointsMean is null without reviews.
export interface PublicProfile {
  _id: string;
  username: string;
  type: UserType;
  createdAt: string;
  reviewsCount: number;
  pointsMean: number | null;
}

// The two types an admin can give (PATCH /users/:id/type). Admins are only created in the database.
export type AssignableUserType = typeof UserType.NORMAL | typeof UserType.CRITIC;

// One row of the admin Users list (GET /users). Has the email: only admins get this list.
export interface UserListItem {
  _id: string;
  username: string;
  email: string;
  type: UserType;
  createdAt: string;
  reviewsCount: number;
}

// What Edit profile sends to PATCH /users/me: only the fields that changed.
export interface ProfileChanges {
  username?: string;
  email?: string;
  password?: string;
}
