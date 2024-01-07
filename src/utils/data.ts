/**
 * Utility functions for generating random test data.
 */

/**
 * Generates a random string of given length from alphanumeric characters.
 * @param {number} length Desired length.
 * @returns {string} Random string.
 */
export function randomString(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

/**
 * Generates a reasonably complex password with letters, digits, and symbols.
 * @param {number} length Desired length.
 * @returns {string} Random password.
 */
export function randomPassword(length = 16): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = lower.toUpperCase();
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>/?';
  const all = lower + upper + digits + symbols;
  let out = '';
  out += lower[Math.floor(Math.random() * lower.length)];
  out += upper[Math.floor(Math.random() * upper.length)];
  out += digits[Math.floor(Math.random() * digits.length)];
  out += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = out.length; i < length; i++) {
    out += all.charAt(Math.floor(Math.random() * all.length));
  }
  return out;
}

/**
 * Generates a random email address with a timestamp to avoid collisions.
 * @param {string} domain Optional domain (default: example.com).
 * @returns {string} Email address.
 */
export function randomEmail(domain = 'example.com'): string {
  const stamp = Date.now().toString(36);
  const user = `${randomString(6)}.${stamp}`.toLowerCase();
  return `${user}@${domain}`;
}

/**
 * Generates a pseudo-random phone-like string (digits only).
 * @param {number} length Number of digits (default: 10).
 * @returns {string} Phone digits.
 */
export function randomPhone(length = 10): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += Math.floor(Math.random() * 10).toString();
  }
  return out;
}
