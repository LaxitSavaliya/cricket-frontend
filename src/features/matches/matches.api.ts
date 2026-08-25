import type { ApiResponse } from "@/lib/api/api-response";
import { http } from "@/lib/api/http";

import type {
  MatchCommentary,
  MatchDetails,
  MatchListItem,
  MatchPlayers,
  MatchScore,
} from "./matches.types";

const buildMatchEndpoint = (slug: string): string => {
  const normalizedSlug = slug.trim();

  if (normalizedSlug.length === 0) {
    throw new Error("Match slug is required.");
  }

  return `/matches/${encodeURIComponent(normalizedSlug)}`;
};

export async function getMatches(): Promise<MatchListItem[]> {
  const { data: apiResponse } =
    await http.get<ApiResponse<MatchListItem[]>>("/matches");

  return apiResponse.data;
}

export async function getMatch(slug: string): Promise<MatchDetails> {
  const matchEndpoint = buildMatchEndpoint(slug);

  const { data: apiResponse } =
    await http.get<ApiResponse<MatchDetails>>(matchEndpoint);

  return apiResponse.data;
}

export async function getMatchPlayers(slug: string): Promise<MatchPlayers> {
  const matchEndpoint = buildMatchEndpoint(slug);

  const { data: apiResponse } = await http.get<ApiResponse<MatchPlayers>>(
    `${matchEndpoint}/players`,
  );

  return apiResponse.data;
}

export async function getMatchScore(slug: string): Promise<MatchScore> {
  const matchEndpoint = buildMatchEndpoint(slug);

  const { data: apiResponse } = await http.get<ApiResponse<MatchScore>>(
    `${matchEndpoint}/score`,
  );

  return apiResponse.data;
}

export async function getMatchCommentary(
  slug: string,
): Promise<MatchCommentary> {
  const matchEndpoint = buildMatchEndpoint(slug);

  const { data: apiResponse } = await http.get<ApiResponse<MatchCommentary>>(
    `${matchEndpoint}/commentary`,
  );

  return apiResponse.data;
}
