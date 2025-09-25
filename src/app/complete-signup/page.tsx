import Link from 'next/link';

export const metadata = {
  title: 'Complete Signup | Monanga',
};

export default function CompleteSignupPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-semibold">Welcome! Let’s complete your signup</h1>
        <p className="text-sm text-gray-600">
          Your account has been created. If this is your first time, please review your profile details
          and set a username to finish.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-black/90"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-50"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
