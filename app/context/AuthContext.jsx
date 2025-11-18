"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import {
  getAccessToken,
  getUser,
  setAccessToken,
  setRefreshToken,
  setUser,
  clearAuthData,
  isAuthenticated,
} from "@/lib/auth/storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated_, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getUser();
        const hasToken = isAuthenticated();
        
        // Check if OAuth was recently synced
        const oauthSynced = localStorage.getItem("oauth_synced") === "true";

        // Try to get user from cookie if not in localStorage
        let userToUse = storedUser;
        let hasAccessToken = hasToken;
        
        if (!hasToken) {
          // Check if accessToken cookie exists (server-set, can't read it, but we know it's there if this succeeded)
          const hasCookie = document.cookie.includes("accessToken=");
          if (hasCookie && oauthSynced && storedUser) {
            hasAccessToken = true;
          }
        }

        if (userToUse && hasAccessToken) {
          setUserState(userToUse);
          setIsAuthenticated(true);
          // Clear the oauth sync flag after use
          if (oauthSynced) {
            localStorage.removeItem("oauth_synced");
          }
        } else {
          setUserState(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response;

      // Store tokens and user
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(userData);

      setUserState(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (err) {
      const message = err.data?.message || err.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (firstName, lastName, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response;

      // Store tokens and user
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(userData);

      setUserState(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (err) {
      const message = err.data?.message || err.message || "Signup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call logout endpoint if needed
      await apiClient.post("/auth/logout", {});
    } catch (err) {
      console.error("Logout API call failed:", err);
      // Continue with client-side logout even if API fails
    } finally {
      clearAuthData();
      setUserState(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/forgot-password", {
        email,
      });

      return response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to send reset email";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });

      return response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to reset password";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/verify-email", {
        token,
      });

      // Update user verification status
      const updatedUser = { ...user, isEmailVerified: true };
      setUser(updatedUser);
      setUserState(updatedUser);

      return response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to verify email";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: isAuthenticated_,
    error,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
