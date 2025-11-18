"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthSyncPage() {
  const router = useRouter();

  useEffect(() => {
    // Sync user data from cookies to localStorage and verify session
    const syncAndRedirect = async () => {
      try {
        // Give cookies a moment to be fully set
        await new Promise(resolve => setTimeout(resolve, 200));

        // Verify the session by calling /api/auth/me
        // This endpoint will validate the accessToken cookie
        const meResponse = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (!meResponse.ok) {
          throw new Error(`Session verification failed: ${meResponse.status}`);
        }

        const meData = await meResponse.json();
        const userData = meData.user;

        // Store user data in localStorage
        localStorage.setItem("auth_user", JSON.stringify(userData));
        // Mark that we have a valid token (can't read HTTP-only cookie, so we use this flag)
        localStorage.setItem("auth_access_token", JSON.stringify("verified"));

        console.log("✅ OAuth sync completed for:", userData.email);

        // Redirect to dashboard
        router.replace("/dashboard");
      } catch (error) {
        console.error("Failed to sync OAuth data:", error);
        // Clear any partial data
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_access_token");
        // Redirect to login with error
        router.push("/auth/Login?error=oauth_sync_failed");
      }
    };

    syncAndRedirect();
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
