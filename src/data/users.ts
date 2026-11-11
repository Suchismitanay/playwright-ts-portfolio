/**
 * Public demo accounts published on https://www.saucedemo.com (not real credentials).
 * Override via env vars in CI if needed.
 */
const password = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password },
  lockedOut: { username: 'locked_out_user', password },
  invalid: { username: 'not_a_user', password: 'wrong_password' },
} as const;

export interface User {
  username: string;
  password: string;
}
