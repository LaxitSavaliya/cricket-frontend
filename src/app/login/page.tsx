import { GoogleLoginButton } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">Sign in to Cricket</h1>
      <GoogleLoginButton />
    </main>
  );
}
