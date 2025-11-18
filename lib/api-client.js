/**
 * API Client with automatic token refresh
 * Handles all API requests with authentication
 */

import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  clearAuthData,
} from "./auth/storage";
import { isTokenExpired, shouldRefreshToken } from "./auth/tokens";

class APIClient {
  constructor(baseURL = "/api") {
    this.baseURL = baseURL;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  /**
   * Subscribe to token refresh
   */
  subscribeTokenRefresh(callback) {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers about token refresh
   */
  notifyTokenRefresh() {
    this.refreshSubscribers.forEach((callback) => callback());
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.subscribeTokenRefresh(() => {
          resolve(getAccessToken());
        });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearAuthData();
        throw new Error("Failed to refresh token");
      }

      const { accessToken } = await response.json();
      setAccessToken(accessToken);

      this.notifyTokenRefresh();
      this.refreshSubscribers = [];

      return accessToken;
    } catch (error) {
      clearAuthData();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Get authorization headers
   */
  getAuthHeaders() {
    const token = getAccessToken();
    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token.value || token}`,
    };
  }

  /**
   * Make API request with automatic token management
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Check if token needs refresh
    const accessToken = getAccessToken();
    if (accessToken && shouldRefreshToken(accessToken)) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // If unauthorized, try to refresh token
      if (response.status === 401) {
        try {
          await this.refreshAccessToken();

          // Retry request with new token
          response = await fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...this.getAuthHeaders(),
              ...options.headers,
            },
          });
        } catch (error) {
          clearAuthData();
          window.location.href = "/auth/login";
          throw error;
        }
      }

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `API Error: ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Return empty response for 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed [${options.method || "GET"} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * PATCH request
   */
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
export { APIClient };
