import { AlertCircle } from "lucide-react";

export default function CheckboxField({ name, label, checked, onChange, error }) {
  return (
    <div>
      <label className="flex items-center text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="mr-2 w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
