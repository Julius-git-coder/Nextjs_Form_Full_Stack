"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingIndicator from "./LoadingIndicator";

/**
 * ProtectedRoute component
 * Wraps components that require authentication
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children, redirectTo = "/auth/login" }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
