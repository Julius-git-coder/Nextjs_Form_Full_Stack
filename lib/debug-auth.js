/**
 * Debug utilities for authentication flow
 */

export function logAuthState(label) {
  if (typeof window === "undefined") return;
  
  const userCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user="))
    ?.split("=")[1];
  
  const accessTokenCookie = document.cookie.includes("accessToken=");
  const refreshTokenCookie = document.cookie.includes("refreshToken=");
  
  const localStorageUser = localStorage.getItem("auth_user");
  const localStorageAccessToken = localStorage.getItem("auth_access_token");
  
  console.group(`🔐 Auth State: ${label}`);
  console.log("Cookies:", {
    hasUserCookie: !!userCookie,
    hasAccessTokenCookie: accessTokenCookie,
    hasRefreshTokenCookie: refreshTokenCookie,
  });
  
  if (userCookie) {
    try {
      console.log("User Cookie Data:", JSON.parse(decodeURIComponent(userCookie)));
    } catch {
      console.log("User Cookie (raw):", userCookie.substring(0, 50) + "...");
    }
  }
  
  console.log("LocalStorage:", {
    hasUser: !!localStorageUser,
    hasAccessToken: !!localStorageAccessToken,
  });
  
  if (localStorageUser) {
    try {
      console.log("LocalStorage User:", JSON.parse(localStorageUser));
    } catch {
      console.log("LocalStorage User (raw):", localStorageUser);
    }
  }
  
  console.groupEnd();
}
