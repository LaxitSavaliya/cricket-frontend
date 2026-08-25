"use client";

import { useCallback, useState } from "react";

import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { toast } from "@/components/ui/Toast";

import {
  BATTING_STYLE_OPTIONS,
  BOWLING_STYLE_OPTIONS,
  PLAYER_ROLE_OPTIONS,
} from "../player.constants";
import { useCreatePlayer } from "../player.queries";
import { createPlayerSchema } from "../player.schema";
import type {
  BattingStyle,
  BowlingStyle,
  CreatePlayerRequest,
  FieldErrors,
  OnboardingFormData,
} from "../player.types";
import { OnboardingSuccessModal } from "./OnboardingSuccessModal";

const INITIAL_FORM_DATA: OnboardingFormData = {
  name: "",
  displayName: "",
  role: null,
  canKeepWickets: false,
  battingStyle: null,
  bowlingStyle: null,
  city: "",
  state: "",
  birthDate: "",
};

const FIELD_ELEMENT_IDS: Partial<Record<keyof OnboardingFormData, string>> = {
  name: "player-name",
  displayName: "display-name",
  role: "player-role",
  battingStyle: "batting-style",
  bowlingStyle: "bowling-style",
  city: "city",
  state: "state",
  birthDate: "birth-date",
};

function getLocalTodayString(): string {
  const today: Date = new Date();
  const year: number = today.getFullYear();
  const month: string = String(today.getMonth() + 1).padStart(2, "0");
  const day: string = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function OnboardingForm() {
  const [formData, setFormData] =
    useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [createdPlayer, setCreatedPlayer] =
    useState<CreatePlayerRequest | null>(null);

  const today: string = getLocalTodayString();

  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(
      field: K,
      value: OnboardingFormData[K],
    ) => {
      setFormData((current) => ({ ...current, [field]: value }));
      setFieldErrors((current) => {
        if (!current[field]) {
          return current;
        }
        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    },
    [],
  );

  const { mutate: createPlayer, isPending: isSubmitting } = useCreatePlayer({
    onSuccess: (_data, variables) => {
      setCreatedPlayer(variables);
    },
    onError: (error) => {
      toast.error("Profile creation failed", error.message);
    },
  });

  const validateForm = (): CreatePlayerRequest | null => {
    const validation = createPlayerSchema.safeParse(formData);

    if (!validation.success) {
      const errors: FieldErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field !== "string" || !(field in INITIAL_FORM_DATA)) {
          return;
        }

        const fieldKey = field as keyof OnboardingFormData;

        if (!errors[fieldKey]) {
          errors[fieldKey] = issue.message;
        }
      });

      setFieldErrors(errors);

      const firstErrorField = (
        Object.keys(FIELD_ELEMENT_IDS) as Array<keyof OnboardingFormData>
      ).find((key) => errors[key]);

      if (firstErrorField && FIELD_ELEMENT_IDS[firstErrorField]) {
        const elementId = FIELD_ELEMENT_IDS[firstErrorField];
        setTimeout(() => {
          const element = document.getElementById(elementId!);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            if ("focus" in element && typeof element.focus === "function") {
              element.focus();
            }
          }
        }, 50);
      }

      return null;
    }

    setFieldErrors({});
    return validation.data;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validatedData = validateForm();
    if (!validatedData) {
      return;
    }

    createPlayer(validatedData);
  };

  if (createdPlayer) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 flex items-center justify-center">
        <OnboardingSuccessModal
          name={createdPlayer.name}
          displayName={createdPlayer.displayName ?? ""}
          role={createdPlayer.role}
          city={createdPlayer.city ?? ""}
          state={createdPlayer.state ?? ""}
          onContinue={() => {
            window.location.replace("/dashboard");
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Section 01: Player Details */}
          <section className="border-b border-slate-100 p-6 sm:p-8">
            <SectionHeader number="01" title="Player details" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Player name"
                htmlFor="player-name"
                required
                error={fieldErrors.name}
              >
                <Input
                  id="player-name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter your full name"
                  maxLength={100}
                  error={Boolean(fieldErrors.name)}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                label="Display name"
                htmlFor="display-name"
                optional
                error={fieldErrors.displayName}
              >
                <Input
                  id="display-name"
                  value={formData.displayName}
                  onChange={(event) =>
                    updateField("displayName", event.target.value)
                  }
                  placeholder="e.g. Laxit"
                  maxLength={100}
                  error={Boolean(fieldErrors.displayName)}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
          </section>

          {/* Section 02: Playing Role */}
          <section className="border-b border-slate-100 p-6 sm:p-8">
            <SectionHeader number="02" title="Playing role" />

            <FormField required error={fieldErrors.role} className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {PLAYER_ROLE_OPTIONS.map((option, index) => {
                  const selected = formData.role === option.value;

                  return (
                    <button
                      key={option.value}
                      id={index === 0 ? "player-role" : undefined}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => updateField("role", option.value)}
                      className={[
                        "rounded-2xl border p-4 text-left transition cursor-pointer",
                        "disabled:cursor-not-allowed disabled:opacity-60",

                        selected
                          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                          : fieldErrors.role
                            ? "border-red-300 bg-red-50/30"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",

                            selected
                              ? "border-emerald-600 bg-emerald-600"
                              : fieldErrors.role
                                ? "border-red-400"
                                : "border-slate-300",
                          ].join(" ")}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>

                        <span>
                          <span className="block font-semibold text-slate-900">
                            {option.label}
                          </span>

                          {option.description && (
                            <span className="mt-1 block text-sm leading-5 text-slate-500">
                              {option.description}
                            </span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </FormField>

            {/* Wicketkeeping Switch */}
            <div
              className={[
                "mt-5 flex w-full items-center justify-between rounded-2xl border p-4 transition",
                isSubmitting ? "opacity-60" : "",
                formData.canKeepWickets
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200",
              ].join(" ")}
            >
              <div>
                <p className="font-semibold text-slate-900">Wicketkeeping</p>

                <p className="mt-1 text-sm text-slate-500">
                  I can play as a wicketkeeper.
                </p>
              </div>

              <Switch
                checked={formData.canKeepWickets}
                onChange={(checked) => updateField("canKeepWickets", checked)}
                disabled={isSubmitting}
                activeColor="bg-emerald-600"
                aria-label="I can play as a wicketkeeper"
              />
            </div>
          </section>

          {/* Section 03: Playing Style */}
          <section className="border-b border-slate-100 p-6 sm:p-8">
            <SectionHeader number="03" title="Playing style" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Batting style"
                htmlFor="batting-style"
                optional
                error={fieldErrors.battingStyle}
              >
                <Select
                  id="batting-style"
                  value={formData.battingStyle ?? ""}
                  placeholder="Select batting style"
                  options={BATTING_STYLE_OPTIONS}
                  error={Boolean(fieldErrors.battingStyle)}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    updateField(
                      "battingStyle",
                      (event.target.value as BattingStyle) || null,
                    )
                  }
                />
              </FormField>

              <FormField
                label="Bowling style"
                htmlFor="bowling-style"
                optional
                error={fieldErrors.bowlingStyle}
              >
                <Select
                  id="bowling-style"
                  value={formData.bowlingStyle ?? ""}
                  placeholder="Select bowling style"
                  options={BOWLING_STYLE_OPTIONS}
                  error={Boolean(fieldErrors.bowlingStyle)}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    updateField(
                      "bowlingStyle",
                      (event.target.value as BowlingStyle) || null,
                    )
                  }
                />
              </FormField>
            </div>
          </section>

          {/* Section 04: Personal Details */}
          <section className="p-6 sm:p-8">
            <SectionHeader number="04" title="Personal details" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                label="City"
                htmlFor="city"
                optional
                error={fieldErrors.city}
              >
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="e.g. Surat"
                  maxLength={100}
                  error={Boolean(fieldErrors.city)}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                label="State"
                htmlFor="state"
                optional
                error={fieldErrors.state}
              >
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  placeholder="e.g. Gujarat"
                  maxLength={100}
                  error={Boolean(fieldErrors.state)}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                label="Date of birth"
                htmlFor="birth-date"
                optional
                error={fieldErrors.birthDate}
                className="sm:col-span-2"
              >
                <Input
                  id="birth-date"
                  type="date"
                  value={formData.birthDate}
                  max={today}
                  onChange={(event) =>
                    updateField("birthDate", event.target.value)
                  }
                  error={Boolean(fieldErrors.birthDate)}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-950"
            >
              {isSubmitting && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
              )}

              {isSubmitting ? "Creating your profile..." : "Complete profile"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              You can update these details later from your profile settings.
            </p>
          </section>
        </form>
      </div>
    </main>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-600">
        {number}
      </div>

      <h2 className="font-semibold text-slate-950">{title}</h2>
    </div>
  );
}
