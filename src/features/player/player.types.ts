import type { UseMutationOptions } from "@tanstack/react-query";

export type PlayerRole = "BATSMAN" | "BOWLER" | "ALL_ROUNDER";

export type BattingStyle = "RIGHT_HANDED_BATSMAN" | "LEFT_HANDED_BATSMAN";

export type BowlingStyle =
  | "RIGHT_ARM_FAST"
  | "RIGHT_ARM_MEDIUM_FAST"
  | "RIGHT_ARM_MEDIUM"
  | "RIGHT_ARM_SLOW_MEDIUM"
  | "RIGHT_ARM_SLOW"
  | "LEFT_ARM_FAST"
  | "LEFT_ARM_MEDIUM_FAST"
  | "LEFT_ARM_MEDIUM"
  | "LEFT_ARM_SLOW_MEDIUM"
  | "LEFT_ARM_SLOW"
  | "RIGHT_ARM_OFF_SPIN"
  | "RIGHT_ARM_LEG_SPIN"
  | "LEFT_ARM_OFF_SPIN"
  | "LEFT_ARM_LEG_SPIN";

export interface PlayerOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface CreatePlayerRequest {
  name: string;
  displayName?: string;
  role: PlayerRole;
  canKeepWickets: boolean;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  city?: string;
  state?: string;
  birthDate?: string;
}

export interface PlayerOnboardingStatus {
  onboarded: boolean;
}

export interface OnboardingFormData {
  name: string;
  displayName: string;
  role: PlayerRole | null;
  canKeepWickets: boolean;
  battingStyle: BattingStyle | null;
  bowlingStyle: BowlingStyle | null;
  city: string;
  state: string;
  birthDate: string;
}

export type FieldErrors = Partial<Record<keyof OnboardingFormData, string>>;

export type OnboardingSuccessModalProps = Pick<
  CreatePlayerRequest,
  "name" | "displayName" | "role" | "city" | "state"
> & {
  onContinue: () => void;
};

export type CreatePlayerResult = void;

export type CreatePlayerMutationOptions = Omit<
  UseMutationOptions<CreatePlayerResult, Error, CreatePlayerRequest>,
  "mutationFn"
>;
