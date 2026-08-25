"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState } from "react";

import { toast } from "@/components/ui/Toast";
import { isHttpError } from "@/lib/api/http";

import { loginWithGoogle } from "../auth.api";

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      const msg = "Google did not return an ID token.";
      setError(msg);
      toast.error("Sign-in failed", msg);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await loginWithGoogle({
        idToken,
      });

      // Login successful → redirect
      window.location.replace("/dashboard");
    } catch (err) {
      const message = isHttpError(err)
        ? err.message
        : err instanceof Error
          ? err.message
          : "Unable to sign in with Google. Please try again.";

      setError(message);
      toast.error("Sign-in failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailure = () => {
    const message = "Google sign-in was unsuccessful. Please try again.";
    setError(message);
    toast.error("Sign-in cancelled", message);
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
          onError={handleFailure}
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
        <p className="mt-3 text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
