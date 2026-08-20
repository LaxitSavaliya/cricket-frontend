"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState } from "react";

import { loginWithGoogle } from "../auth.api";

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setError("Google did not return an ID token.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await loginWithGoogle({
        idToken,
      });

      console.log("Logged in user:", result.user);

      // Later:
      // router.replace("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);

      setError("Unable to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`flex w-full justify-center ${
          isLoading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.error("Google sign-in failed");
            setError("Google sign-in was unsuccessful. Please try again.");
          }}
          type="standard"
          theme="outline"
          size="large"
          shape="pill"
          logo_alignment="left"
          text="continue_with"
          width="300"
        />
      </div>

      {isLoading && (
        <p className="mt-3 text-center text-sm text-zinc-500">
          Signing you in...
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
