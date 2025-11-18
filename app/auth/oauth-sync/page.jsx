"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthSyncPage() {
  const router = useRouter();

  useEffect(() => {
    // Sync user data from cookies to localStorage
    const syncAndRedirect = async () => {
      try {
        // Give cookies a moment to be fully set
        await new Promise(resolve => setTimeout(resolve, 200));

        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="))
          ?.split("=")[1];

        if (userCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userCookie));
            localStorage.setItem("auth_user", JSON.stringify(userData));
          } catch (parseErr) {
            console.error("Failed to parse user cookie:", parseErr);
          }
        }

        // Redirect to dashboard
        // The middleware will verify the accessToken cookie
        router.replace("/dashboard");
      } catch (error) {
        console.error("Failed to sync OAuth data:", error);
        router.push("/auth/Login");
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
