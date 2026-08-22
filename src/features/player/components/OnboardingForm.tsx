"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/ui/Input";
import { isHttpError } from "@/lib/api/http";

import { createPlayer } from "../player.api";
import {
  BATTING_STYLE_OPTIONS,
  BOWLING_STYLE_OPTIONS,
  PLAYER_ROLE_OPTIONS,
} from "../player.constants";

import type {
  BattingStyle,
  BowlingStyle,
  CreatePlayerRequest,
  PlayerRole,
} from "../player.types";

type FieldErrors = {
  name?: string;
  displayName?: string;
  role?: string;
  city?: string;
  state?: string;
  birthDate?: string;
};

export function OnboardingForm() {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [role, setRole] = useState<PlayerRole | null>(null);

  const [canKeepWickets, setCanKeepWickets] = useState(false);

  const [battingStyle, setBattingStyle] = useState<BattingStyle | null>(null);

  const [bowlingStyle, setBowlingStyle] = useState<BowlingStyle | null>(null);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formError, setFormError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const createPlayerMutation = useMutation({
    mutationFn: createPlayer,

    onSuccess: () => {
      window.location.replace("/");
    },

    onError: (error) => {
      if (isHttpError(error)) {
        setFormError(error.message);
        return;
      }

      setFormError("Unable to create your player profile. Please try again.");
    },
  });

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    const normalizedName = name.trim();
    const normalizedDisplayName = displayName.trim();
    const normalizedCity = city.trim();
    const normalizedState = state.trim();

    if (!normalizedName) {
      errors.name = "Player name is required.";
    } else if (normalizedName.length < 2) {
      errors.name = "Player name must contain at least 2 characters.";
    }

    if (normalizedDisplayName && normalizedDisplayName.length < 2) {
      errors.displayName = "Display name must contain at least 2 characters.";
    }

    if (!role) {
      errors.role = "Please select your player role.";
    }

    if (normalizedCity && normalizedCity.length < 2) {
      errors.city = "City must contain at least 2 characters.";
    }

    if (normalizedState && normalizedState.length < 2) {
      errors.state = "State must contain at least 2 characters.";
    }

    if (birthDate && birthDate > today) {
      errors.birthDate = "Birth date cannot be in the future.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (createPlayerMutation.isPending) {
      return;
    }

    setFormError(null);

    if (!validateForm()) {
      return;
    }

    const payload: CreatePlayerRequest = {
      name: name.trim(),
      role: role!,
      canKeepWickets,

      ...(displayName.trim() && {
        displayName: displayName.trim(),
      }),

      ...(battingStyle && {
        battingStyle,
      }),

      ...(bowlingStyle && {
        bowlingStyle,
      }),

      ...(city.trim() && {
        city: city.trim(),
      }),

      ...(state.trim() && {
        state: state.trim(),
      }),

      ...(birthDate && {
        birthDate,
      }),
    };

    createPlayerMutation.mutate(payload);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-2xl text-white shadow-sm">
            🏏
          </div>

          <p className="text-sm font-semibold text-emerald-600">Almost ready</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Create your player profile
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            Add your cricket details so we can build your player profile and
            match history.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <section className="border-b border-slate-100 p-6 sm:p-8">
            <SectionHeader
              number="01"
              title="Player details"
              description="Tell us how you want to appear in the cricket platform."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Player name"
                htmlFor="player-name"
                required
                error={fieldErrors.name}
              >
                <Input
                  id="player-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);

                    if (fieldErrors.name) {
                      setFieldErrors((current) => ({
                        ...current,
                        name: undefined,
                      }));
                    }
                  }}
                  placeholder="Enter your full name"
                  maxLength={100}
                  error={Boolean(fieldErrors.name)}
                  disabled={createPlayerMutation.isPending}
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
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);

                    if (fieldErrors.displayName) {
                      setFieldErrors((current) => ({
                        ...current,
                        displayName: undefined,
                      }));
                    }
                  }}
                  placeholder="e.g. Laxit"
                  maxLength={100}
                  error={Boolean(fieldErrors.displayName)}
                  disabled={createPlayerMutation.isPending}
                />
              </FormField>
            </div>
          </section>

          <section className="border-b border-slate-100 p-6 sm:p-8">
            <SectionHeader
              number="02"
              title="Playing role"
              description="Choose the role that best represents your game."
            />

            <FormField required error={fieldErrors.role} className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {PLAYER_ROLE_OPTIONS.map((option) => {
                  const selected = role === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={createPlayerMutation.isPending}
                      onClick={() => {
                        setRole(option.value);

                        if (fieldErrors.role) {
                          setFieldErrors((current) => ({
                            ...current,
                            role: undefined,
                          }));
                        }
                      }}
                      className={[
                        "rounded-2xl border p-4 text-left transition",
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

            <button
              type="button"
              disabled={createPlayerMutation.isPending}
              onClick={() => setCanKeepWickets((value) => !value)}
              className={[
                "mt-5 flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
                "disabled:cursor-not-allowed disabled:opacity-60",

                canKeepWickets
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 hover:bg-slate-50",
              ].join(" ")}
            >
              <div>
                <p className="font-semibold text-slate-900">Wicketkeeping</p>

                <p className="mt-1 text-sm text-slate-500">
                  I can play as a wicketkeeper.
                </p>
              </div>

              <span
                className={[
                  "relative h-6 w-11 rounded-full transition",
                  canKeepWickets ? "bg-emerald-600" : "bg-slate-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
                    canKeepWickets ? "left-6" : "left-1",
                  ].join(" ")}
                />
              </span>
            </button>
          </section>

          <section className="border-b border-slate-100 p-6 sm:p-8">
            <SectionHeader
              number="03"
              title="Playing style"
              description="Add your preferred batting and bowling styles."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField label="Batting style" optional>
                <select
                  value={battingStyle ?? ""}
                  disabled={createPlayerMutation.isPending}
                  onChange={(event) =>
                    setBattingStyle(
                      (event.target.value as BattingStyle) || null,
                    )
                  }
                  className={selectClassName}
                >
                  <option value="">Select batting style</option>

                  {BATTING_STYLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Bowling style" optional>
                <select
                  value={bowlingStyle ?? ""}
                  disabled={createPlayerMutation.isPending}
                  onChange={(event) =>
                    setBowlingStyle(
                      (event.target.value as BowlingStyle) || null,
                    )
                  }
                  className={selectClassName}
                >
                  <option value="">Select bowling style</option>

                  {BOWLING_STYLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <SectionHeader
              number="04"
              title="Personal details"
              description="Optional information for your player profile."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                label="City"
                htmlFor="city"
                optional
                error={fieldErrors.city}
              >
                <Input
                  id="city"
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);

                    if (fieldErrors.city) {
                      setFieldErrors((current) => ({
                        ...current,
                        city: undefined,
                      }));
                    }
                  }}
                  placeholder="e.g. Surat"
                  maxLength={100}
                  error={Boolean(fieldErrors.city)}
                  disabled={createPlayerMutation.isPending}
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
                  value={state}
                  onChange={(event) => {
                    setState(event.target.value);

                    if (fieldErrors.state) {
                      setFieldErrors((current) => ({
                        ...current,
                        state: undefined,
                      }));
                    }
                  }}
                  placeholder="e.g. Gujarat"
                  maxLength={100}
                  error={Boolean(fieldErrors.state)}
                  disabled={createPlayerMutation.isPending}
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
                  value={birthDate}
                  max={today}
                  onChange={(event) => {
                    setBirthDate(event.target.value);

                    if (fieldErrors.birthDate) {
                      setFieldErrors((current) => ({
                        ...current,
                        birthDate: undefined,
                      }));
                    }
                  }}
                  error={Boolean(fieldErrors.birthDate)}
                  disabled={createPlayerMutation.isPending}
                />
              </FormField>
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={createPlayerMutation.isPending}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createPlayerMutation.isPending && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
              )}

              {createPlayerMutation.isPending
                ? "Creating your profile..."
                : "Complete profile"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              You can update these details later.
            </p>
          </section>
        </form>
      </div>
    </main>
  );
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
        {number}
      </div>

      <div>
        <h2 className="font-semibold text-slate-950">{title}</h2>

        <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

const selectClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";
