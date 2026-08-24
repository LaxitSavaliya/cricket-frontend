export type MatchFormat = "ODI" | "T20" | "T10";

export type MatchStatus = "UPCOMING" | "COMPLETED" | "CANCELLED" | "ABANDONED";

export type TossDecision = "BAT" | "BOWL";

export type InningsNo = "FIRST" | "SECOND";

export type PlayerRole = "BATSMAN" | "BOWLER" | "ALL_ROUNDER";

export interface TeamSummary {
  id: string;
  teamName: string;
  shortName: string;
  slug: string;
  logoUrl: string | null;
}

export interface MatchTeamSummary extends TeamSummary {
  inningsNo: InningsNo | null;
  runs: number;
  wickets: number;
  balls: number;
}

export type MatchResult =
  | {
      type: "RUNS";
      winnerTeamId: string;
      margin: number;
      text: string;
    }
  | {
      type: "WICKETS";
      winnerTeamId: string;
      margin: number;
      text: string;
    }
  | {
      type: "TIED";
      winnerTeamId: null;
      margin: null;
      text: string;
    };

interface MatchBase {
  id: string;
  title: string;
  slug: string;
  matchFormat: MatchFormat;
  status: MatchStatus;
  matchDate: string;
  tossWinnerTeamId: string | null;
  tossDecision: TossDecision | null;
}

export interface MatchListItem extends MatchBase {
  result: MatchResult | null;
  homeTeam: MatchTeamSummary;
  awayTeam: MatchTeamSummary;
}

export interface MatchDetails extends MatchBase {
  venue: string;
  city: string;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
}

export interface MatchPlayer {
  id: string;
  name: string;
  displayName: string;
  role: PlayerRole;
  photoUrl: string | null;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isWicketKeeper: boolean;
}

export interface MatchPlayersTeam extends TeamSummary {
  players: MatchPlayer[];
  benchPlayers: MatchPlayer[];
}

export interface MatchPlayers {
  homeTeam: MatchPlayersTeam;
  awayTeam: MatchPlayersTeam;
}

export interface MatchScorePlayer {
  name: string;
  slug: string;
}

export interface MatchScoreBatter extends MatchScorePlayer {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalText: string;
}

export interface MatchScoreExtras {
  byes: number;
  legByes: number;
  wides: number;
  noBalls: number;
  penalties: number;
  total: number;
}

export interface MatchScoreBowler extends MatchScorePlayer {
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economyRate: number;
}

export interface MatchScoreFallOfWicket extends MatchScorePlayer {
  overs: number;
  runs: number;
  wicketNo: number;
}

export interface MatchScorePartnershipBatter extends MatchScorePlayer {
  runs: number;
  balls: number;
}

export interface MatchScorePartnership {
  forWicket: number;
  runs: number;
  balls: number;
  firstBatter: MatchScorePartnershipBatter;
  secondBatter: MatchScorePartnershipBatter;
}

export interface MatchInningScorecard {
  batters: MatchScoreBatter[];
  extras: MatchScoreExtras;
  notBat: MatchScorePlayer[];
  bowlers: MatchScoreBowler[];
  fallOfWickets: MatchScoreFallOfWicket[];
  partnerships: MatchScorePartnership[];
}

export interface MatchInningScore {
  teamName: string;
  shortName: string;
  slug: string;
  logoUrl: string | null;
  runs: number;
  overs: number;
  wickets: number;
  score: MatchInningScorecard;
}

export interface MatchScore {
  firstInning: MatchInningScore | null;
  secondInning: MatchInningScore | null;
}

export interface MatchCommentary {
  firstInning: MatchCommentaryInning | null;
  secondInning: MatchCommentaryInning | null;
}

export interface MatchCommentaryInning {
  batterIntro: MatchBatterIntro[];
  bowlerIntro: MatchBowlerIntro[];
  commentary: MatchCommentaryItem[];
  overSummaries: MatchOverSummary[];
}

export type MatchBatterIntro = {
  name: string;
  slug: string;
  photoUrl: string | null;
  deliveryNo: number;
  matches: number;
  runs: number;
  strikeRate: number;
  average: number;
  best: string;
};

export type MatchBowlerIntro = {
  name: string;
  slug: string;
  photoUrl: string | null;
  deliveryNo: number;
  matches: number;
  wickets: number;
  average: number;
  economy: number;
  best: string;
};

export type BattingCreasePlayer = {
  name: string;
  slug: string;
  runs: number;
  balls: number;
};

export type BowlingOverPlayer = {
  name: string;
  slug: string;
  runs: number;
  overs: string;
};

export type MatchOverSummary = {
  overNo: number;
  runs: number;
  wickets: number;
  battersOnCrease: BattingCreasePlayer[];
  bowler: BowlingOverPlayer | null;
};

export type CommentaryLabel =
  | "."
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "W"
  | "Wd"
  | "Wd1"
  | "Wd2"
  | "Wd3"
  | "Wd4"
  | "Wd5"
  | "Nb"
  | "Nb1"
  | "Nb2"
  | "Nb3"
  | "Nb4"
  | "Nb5"
  | "Nb6"
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "B5"
  | "Lb1"
  | "Lb2"
  | "Lb3"
  | "Lb4"
  | "Lb5";

export interface MatchCommentaryItem {
  deliveryNo: number;
  overNo: number;
  ballNo: number;
  commentaryText: string;
  shortLabel: CommentaryLabel;
}
