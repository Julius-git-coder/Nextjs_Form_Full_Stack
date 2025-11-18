import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function InputField({
  name,
  type,
  placeholder,
  hasToggle,
  showPassword,
  onToggle,
  value,
  error,
  onChange,
  onKeyPress,
}) {
  return (
    <div>
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={hasToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            hasToggle ? "pr-12" : ""
          } text-gray-900 placeholder-gray-400 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-teal-500"
          }`}
          aria-invalid={error ? "true" : "false"}
        />
        {hasToggle && (
          <button
            type="button"
            onClick={onToggle}
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
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
