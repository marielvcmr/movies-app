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
