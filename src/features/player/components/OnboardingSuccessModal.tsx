"use client";

import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";

import { PLAYER_ROLE_OPTIONS } from "../player.constants";
import type { OnboardingSuccessModalProps } from "../player.types";

export function OnboardingSuccessModal({
  name,
  displayName,
  role,
  city,
  state,
  onContinue,
}: OnboardingSuccessModalProps) {
  const [showContent, setShowContent] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const [checkmarkDrawn, setCheckmarkDrawn] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const checkmarkTimer = window.setTimeout(() => {
      setCheckmarkDrawn(true);
    }, 150);

    const contentTimer = window.setTimeout(() => {
      setShowContent(true);
    }, 450);

    return () => {
      window.clearTimeout(checkmarkTimer);
      window.clearTimeout(contentTimer);
    };
  }, []);

  const roleLabel =
    PLAYER_ROLE_OPTIONS.find((opt) => opt.value === role)?.label ?? "Player";

  const locationText = [city?.trim(), state?.trim()].filter(Boolean).join(", ");

  const greetingName = displayName?.trim() || name.trim() || "Player";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-success-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-md transition-opacity duration-300"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/5 sm:p-10">
        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />

        {/* Google Pay Style Animated Checkmark Badge */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          {/* Outer pulsating ring */}
          <div
            className={[
              "absolute inset-0 rounded-full bg-emerald-100 transition-all duration-700 ease-out",
              checkmarkDrawn ? "scale-100 opacity-100" : "scale-50 opacity-0",
            ].join(" ")}
          />

          {/* Secondary ring */}
          <div
            className={[
              "absolute h-20 w-20 rounded-full bg-emerald-500/20 transition-all delay-100 duration-500 ease-out",
              checkmarkDrawn ? "scale-100 opacity-100" : "scale-50 opacity-0",
            ].join(" ")}
          />

          {/* Core Green Checkmark Circle */}
          <div
            className={[
              "relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all duration-500 ease-out",
              checkmarkDrawn ? "scale-100" : "scale-0",
            ].join(" ")}
          >
            <Check
              strokeWidth={3}
              className={[
                "h-8 w-8 transition-all delay-200 duration-300",
                checkmarkDrawn ? "scale-100 opacity-100" : "scale-50 opacity-0",
              ].join(" ")}
            />
          </div>
        </div>

        {/* Text Content */}
        <div
          className={[
            "mt-6 transition-all duration-500 ease-out",
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          ].join(" ")}
        >
          <h2
            id="onboarding-success-title"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
          >
            You&apos;re all set!
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Welcome aboard,{" "}
            <span className="font-semibold text-slate-800">{greetingName}</span>
            ! Your cricket player profile is live and ready.
          </p>

          {/* Profile Quick Summary Card */}
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Player Name
                </p>
                <p className="mt-0.5 font-semibold text-slate-900">{name}</p>
              </div>

              <span className="rounded-xl bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                {roleLabel}
              </span>
            </div>

            {locationText && (
              <div className="mt-3 border-t border-slate-200/60 pt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Location</span>
                <span className="font-medium text-slate-700">
                  {locationText}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            autoFocus
            type="button"
            onClick={onContinue}
            className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
