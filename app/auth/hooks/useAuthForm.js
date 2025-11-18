"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { validateForm } from "../utils/validation";
import { INITIAL_FORM_STATE } from "../utils/constants";

export function useAuthForm() {
  const router = useRouter();
  const { login, signup, forgotPassword, clearError } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [currentPage, setCurrentPage] = useState("login");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateForm(formData, currentPage);
    setErrors(newErrors);
    setApiError("");

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        if (currentPage === "login") {
          await login(formData.email, formData.password);
          showSuccess("Login successful!");
          router.push("/dashboard");
        } else if (currentPage === "signup") {
          await signup(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password
          );
          showSuccess("Account created successfully!");
          router.push("/dashboard");
        } else if (currentPage === "forgot") {
          await forgotPassword(formData.email);
          setApiError(""); // Clear any previous errors
          showInfo(
            "If an account exists with this email, a password reset link will be sent"
          );
          navigateTo("login");
        }
      } catch (error) {
        console.error("Auth error:", error);
        const message =
          error.data?.message || error.message || "An error occurred";
        setApiError(message);
        setErrors((prev) => ({ ...prev, general: message }));
        showError(message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      setApiError("");

      if (provider === "Google") {
        // Load Google API
        if (!window.google) {
          const message = "Google authentication service not available. Please reload the page.";
          setApiError(message);
          showError(message);
          setIsLoading(false);
          return;
        }

        // Store callback globally so Google can call it
        window.handleGoogleAuthCallback = handleGoogleCallback;

        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: window.handleGoogleAuthCallback,
        });

        // Trigger One Tap UI
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If One Tap not shown, show the Google Sign-In button click programmatically
            window.google.accounts.id.renderButton(
              document.getElementById("google-signin-button"),
              {
                type: "standard",
                size: "large",
                theme: "outline",
                text: "signin_with",
              }
            );
            // Trigger a manual click after a short delay
            setTimeout(() => {
              const button = document.querySelector("[data-google-signin-button]");
              if (button) {
                button.click();
              }
            }, 100);
          }
        });
      } else if (provider === "Apple") {
        // Apple Sign-In
        if (!window.AppleID) {
          const message = "Apple authentication service not available. Please reload the page.";
          setApiError(message);
          showError(message);
          setIsLoading(false);
          return;
        }

        window.AppleID.auth.init({
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
          teamId: process.env.NEXT_PUBLIC_APPLE_TEAM_ID,
          keyId: process.env.NEXT_PUBLIC_APPLE_KEY_ID,
          redirectURI: `${window.location.origin}/api/auth/apple/callback`,
          usePopup: true,
        });

        window.AppleID.auth.signIn();
      }
    } catch (error) {
      console.error("Social login error:", error);
      const message = "Failed to initialize social authentication";
      setApiError(message);
      showError(message);
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    if (!response.credential) {
      const message = "Google authentication failed. Please try again.";
      setApiError(message);
      showError(message);
      return;
    }

    try {
      setIsLoading(true);
      setApiError("");

      // Decode JWT to get user info
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const data = JSON.parse(jsonPayload);

      // Send to backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: response.credential,
          email: data.email,
          firstName: data.given_name || "User",
          lastName: data.family_name || "",
          profileImage: data.picture,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Google authentication failed");
      }

      const result = await res.json();

      // Store tokens and user info
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Update auth context if available
      if (login) {
        await login(result.user.email, "");
      }

      showSuccess("Google authentication successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Google callback error:", error);
      const message = error.message || "Google authentication failed. Please try again.";
      setApiError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setErrors({});
    setApiError("");
    setShowPassword(false);
    clearError();
    if (page !== currentPage) {
      setFormData(INITIAL_FORM_STATE);
    }

    // Update browser URL based on page
    const pageRoutes = {
      login: "/auth/Login",
      signup: "/auth/SignUp",
      forgot: "/auth/ForgetPassword",
    };

    if (pageRoutes[page]) {
      router.push(pageRoutes[page]);
    }
  };

  return {
    currentPage,
    formData,
    showPassword,
    errors,
    isLoading,
    apiError,
    handleInputChange,
    handleSubmit,
    handleSocialLogin,
    handleKeyPress,
    navigateTo,
    setShowPassword,
  };
}
