/**
 * Token management utilities
 * Handles token generation, validation, and expiration
 */

const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
  VERIFICATION: "verification",
  PASSWORD_RESET: "password_reset",
};

const TOKEN_EXPIRY = {
  ACCESS: 15 * 60 * 1000, // 15 minutes
  REFRESH: 7 * 24 * 60 * 60 * 1000, // 7 days
  VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
};

/**
 * Generate a random token
 */
export function generateRandomToken() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Create token payload with expiry
 */
export function createTokenPayload(data, type = TOKEN_TYPES.ACCESS) {
  const expiresIn = TOKEN_EXPIRY[type] || TOKEN_EXPIRY.ACCESS;
  const expiresAt = Date.now() + expiresIn;

  return {
    ...data,
    type,
    expiresAt,
    iat: Date.now(),
  };
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token) {
  if (!token || !token.expiresAt) {
    return true;
  }

  return Date.now() > token.expiresAt;
}

/**
 * Get time until token expiry in milliseconds
 */
export function getTokenExpiresIn(token) {
  if (!token || !token.expiresAt) {
    return 0;
  }

  const expiresIn = token.expiresAt - Date.now();
  return Math.max(0, expiresIn);
}

/**
 * Check if token should be refreshed (if it expires in less than 5 minutes)
 */
export function shouldRefreshToken(token) {
  if (!token) {
    return false;
  }

  const expiresIn = getTokenExpiresIn(token);
  const refreshThreshold = 5 * 60 * 1000; // 5 minutes

  return expiresIn > 0 && expiresIn < refreshThreshold;
}

export { TOKEN_TYPES, TOKEN_EXPIRY };
