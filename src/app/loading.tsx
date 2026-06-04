export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-rwanda-blue border-t-transparent animate-spin" />
        <p className="text-sm text-dark-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
