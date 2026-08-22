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

      await loginWithGoogle({
        idToken,
      });

      // Login successful → go to home page
      window.location.replace("/");
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
        <p className="mt-3 text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
