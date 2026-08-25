"use client";

import { useQuery } from "@tanstack/react-query";

import type { HttpError } from "@/lib/api/http";

import {
  getMatch,
  getMatchCommentary,
  getMatches,
  getMatchPlayers,
  getMatchScore,
} from "./matches.api";

import type {
  MatchCommentary,
  MatchDetails,
  MatchListItem,
  MatchPlayers,
  MatchScore,
} from "./matches.types";

export const matchesQueryKeys = {
  all: ["matches"] as const,

  list: () => [...matchesQueryKeys.all, "list"] as const,

  details: () => [...matchesQueryKeys.all, "detail"] as const,

  detail: (slug: string) =>
    [...matchesQueryKeys.details(), slug.trim()] as const,

  players: (slug: string) =>
    [...matchesQueryKeys.detail(slug), "players"] as const,

  score: (slug: string) => [...matchesQueryKeys.detail(slug), "score"] as const,

  commentary: (slug: string) =>
    [...matchesQueryKeys.detail(slug), "commentary"] as const,
};

export function useMatches() {
  return useQuery<MatchListItem[], HttpError>({
    queryKey: matchesQueryKeys.list(),
    queryFn: getMatches,
  });
}

export function useMatch(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery<MatchDetails, HttpError>({
    queryKey: matchesQueryKeys.detail(normalizedSlug),
    queryFn: () => getMatch(normalizedSlug),
    enabled: normalizedSlug.length > 0,
  });
}

export function useMatchPlayers(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery<MatchPlayers, HttpError>({
    queryKey: matchesQueryKeys.players(normalizedSlug),
    queryFn: () => getMatchPlayers(normalizedSlug),
    enabled: normalizedSlug.length > 0,
  });
}

export function useMatchScore(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery<MatchScore, HttpError>({
    queryKey: matchesQueryKeys.score(normalizedSlug),
    queryFn: () => getMatchScore(normalizedSlug),
    enabled: normalizedSlug.length > 0,
  });
}

export function useMatchCommentary(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery<MatchCommentary, HttpError>({
    queryKey: matchesQueryKeys.commentary(normalizedSlug),
    queryFn: () => getMatchCommentary(normalizedSlug),
    enabled: normalizedSlug.length > 0,
  });
}
