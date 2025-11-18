export default function SubmitButton({ isLoading, loadingText, submitText, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-black py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {submitText}
          <span>→</span>
        </>
      )}
    </button>
  );
}
