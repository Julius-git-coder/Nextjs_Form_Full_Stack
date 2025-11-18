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
 * Get access token (from localStorage or cookies)
 */
export function getAccessToken() {
  if (!isBrowser()) return null;
  try {
    // Try localStorage first
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    if (token) return JSON.parse(token);
    
    // Fall back to cookie
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    
    return cookieValue || null;
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
 * Get refresh token (from localStorage or cookies)
 */
export function getRefreshToken() {
  if (!isBrowser()) return null;
  try {
    // Try localStorage first
    const token = localStorage.getItem(TOKEN_KEYS.REFRESH);
    if (token) return JSON.parse(token);
    
    // Fall back to cookie
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];
    
    return cookieValue || null;
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
    // Try localStorage first
    const user = localStorage.getItem(TOKEN_KEYS.USER);
    if (user) return JSON.parse(user);
    
    // Fall back to cookie (for OAuth callbacks)
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1];
    
    if (cookieValue) {
      try {
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch {
        return null;
      }
    }
    
    return null;
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
  
  // Check for token in localStorage
  const accessToken = getAccessToken();
  if (accessToken) return true;
  
  // Fall back to checking if accessToken cookie exists (for OAuth flow)
  // We can't read HTTP-only cookies, but we can check if they're set
  const hasAccessTokenCookie = document.cookie.includes("accessToken=");
  return hasAccessTokenCookie;
}

export { TOKEN_KEYS };
