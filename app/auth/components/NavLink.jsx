export default function NavLink({ text, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-teal-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 rounded ${className}`}
    >
      {text}
    </button>
  );
}
