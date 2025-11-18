"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logAuthState } from "@/lib/debug-auth";

export default function OAuthSyncPage() {
  const router = useRouter();

  useEffect(() => {
    // Sync user data from cookies to localStorage
    try {
      console.log("🔄 [OAuth Sync] Starting sync...");
      logAuthState("Before Sync");

      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];

      console.log("🔍 [OAuth Sync] User cookie present:", !!userCookie);

      if (userCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userCookie));
          localStorage.setItem("auth_user", JSON.stringify(userData));
          console.log("✅ [OAuth Sync] User data synced to localStorage:", userData);
        } catch (parseErr) {
          console.error("❌ [OAuth Sync] Failed to parse user cookie:", parseErr);
        }
      } else {
        console.warn("⚠️ [OAuth Sync] No user cookie found");
      }

      const accessTokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      console.log("🔍 [OAuth Sync] AccessToken cookie present:", !!accessTokenCookie);

      logAuthState("After Sync");

      // Redirect to dashboard after a small delay to ensure cookies are set
      console.log("⏳ [OAuth Sync] Redirecting to dashboard in 100ms...");
      setTimeout(() => {
        console.log("→ [OAuth Sync] Now redirecting to dashboard");
        router.replace("/dashboard");
      }, 100);
    } catch (error) {
      console.error("❌ [OAuth Sync] Failed to sync OAuth data:", error);
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
