"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import Particles from "./Particles";

// Simulating framer-motion with CSS transitions
const AnimatedPanel = ({ children, isColored, position }) => {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        isColored ? "bg-white" : "bg-white"
      }`}
      style={{
        order: position === "left" ? 1 : 2,
      }}
    >
      {children}
    </div>
  );
};

export default function AuthSystem() {
  const [currentPage, setCurrentPage] = useState("login"); // 'login', 'signup', 'forgot'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (currentPage !== "forgot") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (currentPage === "signup") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      console.log("Form submitted:", { page: currentPage, data: formData });
      setIsLoading(false);
      alert(`${currentPage} functionality would be implemented here!`);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} authentication would be implemented here!`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setErrors({});
    if (page !== currentPage) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });
    }
  };

  // Configuration for each page
  const pageConfig = {
    login: {
      title: "Welcome Back",
      subtitle: "Log in to continue your journey",
      formTitle: "Login",
      coloredPosition: "right",
    },
    signup: {
      title: "Create your Account",
      subtitle: "Share your artwork and Get projects!",
      formTitle: "Sign Up",
      coloredPosition: "left",
    },
    forgot: {
      title: "Reset Password",
      subtitle: "We will send you reset instructions",
      formTitle: "Forgot Password",
      coloredPosition: "top",
    },
  };

  const config = pageConfig[currentPage];

  const renderColoredPanel = () => (
    <div className="relative overflow-hidden flex items-center justify-center p-8 lg:p-12 min-h-[200px] lg:min-h-0">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={5}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10  text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 transition-all duration-500">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg opacity-90 transition-all duration-500">
          {config.subtitle}
        </p>
      </div>
    </div>
  );

  const renderInput = (name, type, placeholder, hasToggle = false) => (
    <div key={name}>
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={hasToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            hasToggle ? "pr-12" : ""
          } text-gray-900 placeholder-gray-400 ${
            errors[name]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-teal-500"
          }`}
          aria-invalid={errors[name] ? "true" : "false"}
        />
        {hasToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-700 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderLoginForm = () => (
    <>
      {renderInput("email", "email", "Email address")}
      {renderInput("password", "password", "Password", true)}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-black  py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            Login
            <span>→</span>
          </>
        )}
      </button>

      <div className="text-center  text-sm my-4">or</div>

      <button
        type="button"
        onClick={() => handleSocialLogin("Google")}
        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin("Apple")}
        className="w-full bg-black  py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        Sign in with Apple
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => navigateTo("forgot")}
          className="text-teal-600 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
        >
          Forgot Password?
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => navigateTo("signup")}
          className="text-teal-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
        >
          Sign up
        </button>
      </div>
    </>
  );

  const renderSignupForm = () => (
    <>
      {renderInput("firstName", "text", "First name")}
      {renderInput("lastName", "text", "Last name")}
      {renderInput("email", "email", "Email address")}
      {renderInput("password", "password", "Password", true)}

      <div>
        <label className="flex items-center text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="mr-2 w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <span>Accept Terms & Conditions</span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.acceptTerms}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-black  py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Join us
            <span>→</span>
          </>
        )}
      </button>

      <div className="text-center text-gray-500 text-sm my-4">or</div>

      <button
        type="button"
        onClick={() => handleSocialLogin("Google")}
        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin("Apple")}
        className="w-full bg-black  py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        Sign up with Apple
      </button>

      <div className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigateTo("login")}
          className="text-teal-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
        >
          Login
        </button>
      </div>
    </>
  );

  const renderForgotForm = () => (
    <>
      {renderInput("email", "email", "Email address")}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-black py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Reset Link
            <span>→</span>
          </>
        )}
      </button>

      <div className="text-center text-gray-500 text-sm my-4">or</div>

      <button
        type="button"
        onClick={() => handleSocialLogin("Google")}
        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin("Apple")}
        className="w-full bg-black  py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        Sign in with Apple
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => navigateTo("login")}
          className="text-teal-600 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 rounded inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </>
  );

  const renderForm = () => {
    switch (currentPage) {
      case "login":
        return renderLoginForm();
      case "signup":
        return renderSignupForm();
      case "forgot":
        return renderForgotForm();
      default:
        return null;
    }
  };

  // Forgot password uses vertical layout
  if (currentPage === "forgot") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <Particles
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={200}
            particleSpread={20}
            speed={0.1}
            particleBaseSize={300}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-20 flex flex-col max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-700">
          <div className="w-full bg-gradient-to-br from-teal-600 to-black">
            {renderColoredPanel()}
          </div>
          <div className="w-full bg-white p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 lg:mb-8 text-center transition-all duration-500">
              {config.formTitle}
            </h2>
            <div className="space-y-4 max-w-md mx-auto">{renderForm()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Login and Signup use horizontal layout (with responsive stacking)
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={20}
          speed={0.1}
          particleBaseSize={300}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      <div
        className={`relative z-20 flex flex-col lg:flex-row max-w-6xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ${
          currentPage === "signup" ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        {/* Colored Panel */}
        <div className="lg:w-1/2 bg-gradient-to-br from-teal-600 to-black transition-all duration-700">
          {renderColoredPanel()}
        </div>

        {/* Form Panel */}
        <div className="lg:w-1/2 bg-white p-6 sm:p-8 lg:p-12 flex flex-col justify-center transition-all duration-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 lg:mb-8 text-center transition-all duration-500">
            {config.formTitle}
          </h2>
          <div className="space-y-4">{renderForm()}</div>
        </div>
      </div>
    </div>
  );
}
