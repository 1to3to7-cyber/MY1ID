"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="h-16 w-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-dark-400 mb-6 text-sm">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-rwanda-blue text-white text-sm font-medium hover:bg-rwanda-blue/90 transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
