"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut, Mail, Calendar, CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Only redirect if we're absolutely sure we're not authenticated
    // The middleware will handle redirecting unauthenticated users
    // This useEffect is a secondary check for localStorage-based auth
    if (!isLoading && !isAuthenticated && typeof document !== "undefined") {
      // Check if we have an accessToken cookie (OAuth flow)
      const hasAccessTokenCookie = document.cookie.includes("accessToken=");
      
      // Only redirect if we're truly not authenticated
      if (!hasAccessTokenCookie) {
        router.push("/auth/Login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/Login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome, {user.firstName} {user.lastName}!
          </h2>
          <p className="text-blue-100">
            Your authentication is now fully functional with backend integration.
          </p>
        </div>

        {/* User Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Email Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 rounded-lg p-3">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email Address</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Full Name Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-green-600/20 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Full Name</p>
                <p className="text-white font-semibold">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600/20 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email Verification</p>
                <p className="text-white font-semibold">
                  {user.isEmailVerified ? "Verified" : "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Join Date Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-orange-600/20 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Member Since</p>
                <p className="text-white font-semibold">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Just now"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white mb-6">
            Implemented Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "User Authentication",
              "JWT Token Management",
              "Error Boundary",
              "Protected Routes",
              "Loading States",
              "Form Validation",
              "Email & Password Fields",
              "Responsive Design",
              "Global State Management",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white mb-6">Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Email Verification Flow",
              "Password Reset via Email",
              "Multi-language (i18n)",
              "Enhanced Accessibility",
              "Form Persistence",
              "Framer Motion Animations",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
              >
                <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                <span className="text-slate-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
