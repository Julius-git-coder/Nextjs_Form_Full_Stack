export default function SocialButton({ provider, icon, onClick, variant = "secondary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
        variant === "primary"
          ? "bg-black hover:bg-gray-800"
          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {provider === "Google"
        ? `Sign ${variant === "primary" ? "in" : "up"} with Google`
        : `Sign ${variant === "primary" ? "in" : "up"} with Apple`}
    </button>
  );
}
