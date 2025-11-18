/**
 * Secure token storage utilities
 * Manages storing and retrieving auth tokens from localStorage
 */

const TOKEN_KEYS = {
  ACCESS: "auth_access_token",
  REFRESH: "auth_refresh_token",
  USER: "auth_user",
};

/**
 * Check if running in browser environment
 */
function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Store access token
 */
export function setAccessToken(token) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(TOKEN_KEYS.ACCESS, JSON.stringify(token));
  } catch (error) {
    console.error("Failed to store access token:", error);
  }
}

/**
 * Get access token
 */
export function getAccessToken() {
  if (!isBrowser()) return null;
  try {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error("Failed to retrieve access token:", error);
    return null;
  }
}

/**
 * Store refresh token
 */
export function setRefreshToken(token) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(TOKEN_KEYS.REFRESH, JSON.stringify(token));
  } catch (error) {
    console.error("Failed to store refresh token:", error);
  }
}

/**
 * Get refresh token
 */
export function getRefreshToken() {
  if (!isBrowser()) return null;
  try {
    const token = localStorage.getItem(TOKEN_KEYS.REFRESH);
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error("Failed to retrieve refresh token:", error);
    return null;
  }
}

/**
 * Store user data
 */
export function setUser(user) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user:", error);
  }
}

/**
 * Get user data
 */
export function getUser() {
  if (!isBrowser()) return null;
  try {
    const user = localStorage.getItem(TOKEN_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    return null;
  }
}

/**
 * Clear all auth data
 */
export function clearAuthData() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.USER);
  } catch (error) {
    console.error("Failed to clear auth data:", error);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  if (!isBrowser()) return false;
  const accessToken = getAccessToken();
  return !!accessToken;
}

export { TOKEN_KEYS };
