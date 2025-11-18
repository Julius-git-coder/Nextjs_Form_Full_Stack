"use client";

import { ArrowLeft } from "lucide-react";
import { useAuthForm } from "./hooks/useAuthForm";
import { PAGE_CONFIG, GOOGLE_SVG, APPLE_SVG } from "./utils/constants";
import InputField from "./components/InputField";
import CheckboxField from "./components/CheckboxField";
import SocialButton from "./components/SocialButton";
import NavLink from "./components/NavLink";
import SubmitButton from "./components/SubmitButton";
import ColoredPanel from "./components/ColoredPanel";
import BackgroundParticles from "./components/BackgroundParticles";

export default function AuthSystem({ initialPage = "login" }) {
  const {
    currentPage,
    formData,
    showPassword,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
    handleSocialLogin,
    handleKeyPress,
    navigateTo,
    setShowPassword,
  } = useAuthForm();

  // Set initial page if provided
  if (currentPage !== initialPage && initialPage !== "login") {
    navigateTo(initialPage);
  }

  const config = PAGE_CONFIG[currentPage];

  const renderLoginForm = () => (
    <>
      <InputField
        name="email"
        type="email"
        placeholder="Email address"
        value={formData.email}
        error={errors.email}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <InputField
        name="password"
        type="password"
        placeholder="Password"
        hasToggle
        showPassword={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        value={formData.password}
        error={errors.password}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />

      <SubmitButton
        isLoading={isLoading}
        loadingText="Logging in..."
        submitText="Login"
        onClick={handleSubmit}
      />

      <div className="text-center text-sm my-4">or</div>

      <SocialButton
        provider="Google"
        icon={GOOGLE_SVG}
        onClick={() => handleSocialLogin("Google")}
      />
      <SocialButton
        provider="Apple"
        icon={APPLE_SVG}
        onClick={() => handleSocialLogin("Apple")}
      />

      <div className="text-center mt-4">
        <NavLink
          text="Forgot Password?"
          onClick={() => navigateTo("forgot")}
          className="text-sm"
        />
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <NavLink
          text="Sign up"
          onClick={() => navigateTo("signup")}
        />
      </div>
    </>
  );

  const renderSignupForm = () => (
    <>
      <InputField
        name="firstName"
        type="text"
        placeholder="First name"
        value={formData.firstName}
        error={errors.firstName}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <InputField
        name="lastName"
        type="text"
        placeholder="Last name"
        value={formData.lastName}
        error={errors.lastName}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <InputField
        name="email"
        type="email"
        placeholder="Email address"
        value={formData.email}
        error={errors.email}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <InputField
        name="password"
        type="password"
        placeholder="Password"
        hasToggle
        showPassword={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        value={formData.password}
        error={errors.password}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />

      <CheckboxField
        name="acceptTerms"
        label="Accept Terms & Conditions"
        checked={formData.acceptTerms}
        onChange={handleInputChange}
        error={errors.acceptTerms}
      />

      <SubmitButton
        isLoading={isLoading}
        loadingText="Creating account..."
        submitText="Join us"
        onClick={handleSubmit}
      />

      <div className="text-center text-gray-500 text-sm my-4">or</div>

      <SocialButton
        provider="Google"
        icon={GOOGLE_SVG}
        onClick={() => handleSocialLogin("Google")}
      />
      <SocialButton
        provider="Apple"
        icon={APPLE_SVG}
        onClick={() => handleSocialLogin("Apple")}
      />

      <div className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <NavLink
          text="Login"
          onClick={() => navigateTo("login")}
        />
      </div>
    </>
  );

  const renderForgotForm = () => (
    <>
      <InputField
        name="email"
        type="email"
        placeholder="Email address"
        value={formData.email}
        error={errors.email}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />

      <SubmitButton
        isLoading={isLoading}
        loadingText="Sending..."
        submitText="Send Reset Link"
        onClick={handleSubmit}
      />

      <div className="text-center text-gray-500 text-sm my-4">or</div>

      <SocialButton
        provider="Google"
        icon={GOOGLE_SVG}
        onClick={() => handleSocialLogin("Google")}
      />
      <SocialButton
        provider="Apple"
        icon={APPLE_SVG}
        onClick={() => handleSocialLogin("Apple")}
      />

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
        <BackgroundParticles />

        <div className="relative z-20 flex flex-col max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-700">
          <div className="w-full bg-gradient-to-br from-teal-600 to-black">
            <ColoredPanel config={config} />
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

  // Login and Signup use horizontal layout (responsive stacking)
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8">
      <BackgroundParticles />

      <div
        className={`relative z-20 flex flex-col lg:flex-row max-w-6xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ${
          currentPage === "signup" ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <div className="lg:w-1/2 bg-gradient-to-br from-teal-600 to-black transition-all duration-700">
          <ColoredPanel config={config} />
        </div>

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
