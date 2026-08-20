import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";

export default async function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-4 py-10">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 -top-45 h-105 w-105 -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />

        <div className="absolute -bottom-55 -right-30 h-105 w-105 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="absolute -left-37.5 top-1/2 h-87.5 w-87.5 rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-7 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-9">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-xl font-bold text-white shadow-lg">
              C
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Sign in to continue to your account
            </p>
          </div>

          {/* Google Login */}
          <GoogleLoginButton />

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />

            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Secure login
            </span>

            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* Security message */}
          <div className="flex items-start gap-3 rounded-xl bg-zinc-50 p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-zinc-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-zinc-700"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3 5.5 6v5c0 4.4 2.7 8.4 6.5 10 3.8-1.6 6.5-5.6 6.5-10V6L12 3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.5 12 1.7 1.7 3.5-3.7"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-800">
                Your account is protected
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                We use Google authentication so your password is never shared
                with us.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-7 text-center text-xs leading-5 text-zinc-400">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          © 2026 Cricket. All rights reserved.
        </p>
      </div>
    </main>
  );
}
