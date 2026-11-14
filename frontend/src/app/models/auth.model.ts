import type { User } from './user.model';

// Which form the account entry screen shows.
export type AccountMode = 'login' | 'signup';

// Body of POST /auth/login. `login` is the username or the email.
export interface LoginCredentials {
  login: string;
  password: string;
}

// Body of POST /auth/register.
export interface SignupData {
  username: string;
  email: string;
  password: string;
}

// Response of POST /auth/login and POST /auth/register.
export interface Session {
  token: string;
  user: User;
}
