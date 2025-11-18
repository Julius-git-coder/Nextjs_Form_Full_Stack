"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthSyncPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Sync user data from cookies to localStorage
    try {
      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];

      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        localStorage.setItem("auth_user", JSON.stringify(userData));
        console.log("✅ OAuth data synced to localStorage:", userData);
      }

      const accessTokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (accessTokenCookie) {
        localStorage.setItem("auth_access_token", JSON.stringify(accessTokenCookie));
      }

      // Redirect to dashboard after a small delay to ensure cookies are set
      setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
    } catch (error) {
      console.error("Failed to sync OAuth data:", error);
      router.push("/auth/Login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <p>Completing sign up...</p>
      </div>
    </div>
  );
}
