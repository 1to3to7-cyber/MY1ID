import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="h-16 w-16 rounded-2xl bg-glass border border-glass-border flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-dark-400">404</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Page not found
        </h2>
        <p className="text-dark-400 mb-6 text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-2.5 rounded-lg bg-rwanda-blue text-white text-sm font-medium hover:bg-rwanda-blue/90 transition-colors duration-200"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
