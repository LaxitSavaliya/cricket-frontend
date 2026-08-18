"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isHttpError } from "@/lib/api/http";
import { useGoogleLoginMutation } from "../auth.queries";
import type { GoogleLoginResult } from "../auth.types";

export interface GoogleLoginButtonProps {
  /**
   * Optional custom success handler.
   */
  onSuccess?: (result: GoogleLoginResult) => void;
  /**
   * Optional custom error handler.
   */
  onError?: (error: unknown) => void;
  /**
   * Whether to automatically navigate after successful login. Defaults to true.
   */
  redirectOnSuccess?: boolean;
  /**
   * Destination path for new/un-onboarded users. Defaults to "/onboarding".
   */
  onboardingPath?: string;
  /**
   * Destination path for onboarded users. Defaults to "/player/dashboard".
   */
  dashboardPath?: string;
  /**
   * Google button visual theme.
   */
  theme?: "outline" | "filled_blue" | "filled_black";
  /**
   * Google button size.
   */
  size?: "large" | "medium" | "small";
  /**
   * Google button text style.
   */
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  /**
   * Google button shape.
   */
  shape?: "rectangular" | "pill" | "circle" | "square";
  /**
   * Google button width in pixels or CSS units.
   */
  width?: string;
  /**
   * Additional wrapper container class names.
   */
  className?: string;
}

export function GoogleLoginButton({
  onSuccess,
  onError,
  redirectOnSuccess = true,
  onboardingPath = "/onboarding",
  dashboardPath = "/player/dashboard",
  theme = "outline",
  size = "large",
  text = "continue_with",
  shape = "rectangular",
  width,
  className = "",
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useGoogleLoginMutation({
    onSuccess: (result) => {
      setErrorMessage(null);
      onSuccess?.(result);

      if (redirectOnSuccess) {
        // Robust check: check explicit flag or profile existence
        const needsOnboarding =
          result.requiresOnboarding ??
          (!result.user.hasPlayerProfile && !result.user.hasOrganizerProfile);

        router.push(needsOnboarding ? onboardingPath : dashboardPath);
      }
    },
    onError: (error) => {
      const message = isHttpError(error)
        ? error.message
        : "Failed to sign in with Google. Please try again.";
      setErrorMessage(message);
      onError?.(error);
    },
  });

  function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) {
      setErrorMessage("Google credential missing. Please try again.");
      return;
    }

    setErrorMessage(null);
    loginMutation.mutate({ idToken: credentialResponse.credential });
  }

  function handleGoogleError() {
    const message = "Google Sign-In failed or was cancelled.";
    setErrorMessage(message);
    onError?.(new Error(message));
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme={theme}
          size={size}
          text={text}
          shape={shape}
          width={width}
        />
      </div>

      {loginMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
          <svg
            className="h-4 w-4 animate-spin text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Authenticating your account...</span>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-2.5 text-xs font-medium text-red-700 border border-red-200 text-center max-w-xs animate-in fade-in"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
