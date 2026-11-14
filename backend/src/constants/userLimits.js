// Rules for user fields. Shared with the frontend so form validation matches the API.
export const UserLimits = Object.freeze({
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  // Letters, numbers, dots, hyphens and underscores. No "@", so a login can't be both a username and an email.
  USERNAME_PATTERN: /^[a-zA-Z0-9._-]+$/,
  EMAIL_MAX: 254,
  PASSWORD_MIN: 8,
  // Any characters except whitespace (spaces, tabs, line breaks).
  PASSWORD_PATTERN: /^\S+$/,
  // bcrypt only uses the first 72 bytes of a password; longer ones would be silently cut.
  PASSWORD_MAX: 72,
});
