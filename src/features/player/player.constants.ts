import type {
  BattingStyle,
  BowlingStyle,
  PlayerOption,
  PlayerRole,
} from "./player.types";

function extractOptionValues<T extends string>(
  options: readonly PlayerOption<T>[],
): [T, ...T[]] {
  const values = options.map((option) => option.value);

  if (values.length === 0) {
    throw new Error("Player options cannot be empty.");
  }

  return values as [T, ...T[]];
}

export const PLAYER_ROLE_OPTIONS = [
  {
    value: "BATSMAN",
    label: "Batsman",
    description: "Primarily focused on batting.",
  },
  {
    value: "BOWLER",
    label: "Bowler",
    description: "Primarily focused on bowling.",
  },
  {
    value: "ALL_ROUNDER",
    label: "All-rounder",
    description: "Contributes with both bat and ball.",
  },
] as const satisfies readonly PlayerOption<PlayerRole>[];

export const BATTING_STYLE_OPTIONS = [
  {
    value: "RIGHT_HANDED_BATSMAN",
    label: "Right-handed",
  },
  {
    value: "LEFT_HANDED_BATSMAN",
    label: "Left-handed",
  },
] as const satisfies readonly PlayerOption<BattingStyle>[];

export const BOWLING_STYLE_OPTIONS = [
  {
    value: "RIGHT_ARM_FAST",
    label: "Right-arm fast",
  },
  {
    value: "RIGHT_ARM_MEDIUM_FAST",
    label: "Right-arm medium fast",
  },
  {
    value: "RIGHT_ARM_MEDIUM",
    label: "Right-arm medium",
  },
  {
    value: "RIGHT_ARM_SLOW_MEDIUM",
    label: "Right-arm slow medium",
  },
  {
    value: "RIGHT_ARM_SLOW",
    label: "Right-arm slow",
  },
  {
    value: "LEFT_ARM_FAST",
    label: "Left-arm fast",
  },
  {
    value: "LEFT_ARM_MEDIUM_FAST",
    label: "Left-arm medium fast",
  },
  {
    value: "LEFT_ARM_MEDIUM",
    label: "Left-arm medium",
  },
  {
    value: "LEFT_ARM_SLOW_MEDIUM",
    label: "Left-arm slow medium",
  },
  {
    value: "LEFT_ARM_SLOW",
    label: "Left-arm slow",
  },
  {
    value: "RIGHT_ARM_OFF_SPIN",
    label: "Right-arm off spin",
  },
  {
    value: "RIGHT_ARM_LEG_SPIN",
    label: "Right-arm leg spin",
  },
  {
    value: "LEFT_ARM_OFF_SPIN",
    label: "Left-arm off spin",
  },
  {
    value: "LEFT_ARM_LEG_SPIN",
    label: "Left-arm leg spin",
  },
] as const satisfies readonly PlayerOption<BowlingStyle>[];

export const PLAYER_ROLE_VALUES = extractOptionValues(PLAYER_ROLE_OPTIONS);

export const BATTING_STYLE_VALUES = extractOptionValues(BATTING_STYLE_OPTIONS);

export const BOWLING_STYLE_VALUES = extractOptionValues(BOWLING_STYLE_OPTIONS);
