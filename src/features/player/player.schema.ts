import { z } from "zod";

import {
  BATTING_STYLE_VALUES,
  BOWLING_STYLE_VALUES,
  PLAYER_ROLE_VALUES,
} from "./player.constants";

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function optionalText(minimumMessage: string, maximumMessage: string) {
  return z
    .string()
    .trim()
    .max(100, { error: maximumMessage })
    .refine((value) => !value || value.length >= 2, {
      error: minimumMessage,
    })
    .optional()
    .transform((value) => value || undefined);
}

const isoDateSchema = z.iso.date();

export const createPlayerSchema = z.object({
  name: z
    .string({ error: "Player name is required." })
    .trim()
    .min(1, { error: "Player name is required." })
    .min(2, {
      error: "Player name must contain at least 2 characters.",
    })
    .max(100, {
      error: "Player name cannot exceed 100 characters.",
    }),

  displayName: optionalText(
    "Display name must contain at least 2 characters.",
    "Display name cannot exceed 100 characters.",
  ),

  role: z.enum(PLAYER_ROLE_VALUES, {
    error: "Please select your player role.",
  }),

  canKeepWickets: z.boolean(),

  battingStyle: z
    .enum(BATTING_STYLE_VALUES)
    .nullable()
    .optional()
    .transform((value) => value ?? undefined),

  bowlingStyle: z
    .enum(BOWLING_STYLE_VALUES)
    .nullable()
    .optional()
    .transform((value) => value ?? undefined),

  city: optionalText(
    "City must contain at least 2 characters.",
    "City cannot exceed 100 characters.",
  ),

  state: optionalText(
    "State must contain at least 2 characters.",
    "State cannot exceed 100 characters.",
  ),

  birthDate: z
    .string()
    .trim()
    .refine((value) => !value || isoDateSchema.safeParse(value).success, {
      error: "Please enter a valid birth date.",
    })
    .refine(
      (value) =>
        !value ||
        !isoDateSchema.safeParse(value).success ||
        value <= getTodayString(),
      {
        error: "Birth date cannot be in the future.",
      },
    )
    .optional()
    .transform((value) => value || undefined),
});

export type CreatePlayerFormInput = z.input<typeof createPlayerSchema>;

export type ValidatedCreatePlayerInput = z.output<typeof createPlayerSchema>;
