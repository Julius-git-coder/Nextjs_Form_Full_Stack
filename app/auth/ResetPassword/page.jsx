"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import { useToast } from "@/app/context/ToastContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Reset failed");
        }

        showSuccess("Password reset successfully!");
        setTimeout(() => {
          router.push("/auth/Login");
        }, 1500);
      } catch (error) {
        console.error("Reset error:", error);
        showError(error.message || "Failed to reset password");
        setErrors({ general: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 max-w-md w-full text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Link</h2>
          <p className="text-gray-600 mb-6">
            The password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => router.push("/auth/ForgetPassword")}
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Request New Link
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h2>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <InputField
            name="password"
            type="password"
            placeholder="New Password"
            hasToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            value={password}
            error={errors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            onKeyPress={handleKeyPress}
          />

          <InputField
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            hasToggle
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            value={confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
            }}
            onKeyPress={handleKeyPress}
          />

          <SubmitButton
            isLoading={isLoading}
            loadingText="Resetting..."
            submitText="Reset Password"
            onClick={handleSubmit}
          />
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/auth/Login")}
            className="text-teal-600 text-sm hover:underline"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
