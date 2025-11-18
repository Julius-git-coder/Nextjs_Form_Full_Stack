export default function SocialButton({ provider, icon, onClick, variant = "secondary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-google-signin-button={provider === "Google" ? true : undefined}
      className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
        variant === "primary"
          ? "bg-black hover:bg-gray-800 text-white"
          : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
      }`}
    >
      {icon}
      {provider === "Google"
        ? `Sign ${variant === "primary" ? "in" : "up"} with Google`
        : `Sign ${variant === "primary" ? "in" : "up"} with Apple`}
    </button>
  );
}
