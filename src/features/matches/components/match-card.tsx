"use client";

import { BarChart3, ChevronRight, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";

import type { MatchListItem, MatchTeamSummary } from "../matches.types";

interface MatchCardProps {
  match: MatchListItem;
  onViewDetails?: () => void;
}

function formatMatchDate(matchDateValue: string): string {
  const matchDate = new Date(matchDateValue);

  if (Number.isNaN(matchDate.getTime())) {
    return "Date unavailable";
  }

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(matchDate);

  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
  }).format(matchDate);

  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(matchDate);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(matchDate);

  return `${weekday}, ${day} ${month} - ${time}`;
}

function formatOvers(totalBalls: number): string {
  if (!Number.isFinite(totalBalls)) {
    return "0.0";
  }

  const validBallCount = Math.max(0, Math.trunc(totalBalls));

  const completedOvers = Math.floor(validBallCount / 6);
  const remainingBalls = validBallCount % 6;

  return `${completedOvers}.${remainingBalls}`;
}

function formatCountdownUnit(value: number): string {
  return String(value).padStart(2, "0");
}

function getTeamInitials(team: MatchTeamSummary): string {
  const teamIdentifier = team.shortName || team.teamName || "UN";

  return teamIdentifier.slice(0, 2).toUpperCase();
}

function getInningsTeams(match: MatchListItem): {
  firstInningsTeam: MatchTeamSummary;
  secondInningsTeam: MatchTeamSummary;
} {
  if (match.homeTeam.inningsNo === "FIRST") {
    return {
      firstInningsTeam: match.homeTeam,
      secondInningsTeam: match.awayTeam,
    };
  }

  if (match.awayTeam.inningsNo === "FIRST") {
    return {
      firstInningsTeam: match.awayTeam,
      secondInningsTeam: match.homeTeam,
    };
  }

  // Upcoming matches do not have an innings order yet.
  return {
    firstInningsTeam: match.homeTeam,
    secondInningsTeam: match.awayTeam,
  };
}

function getUpcomingMatchText(
  matchDateValue: string,
  currentTime: number | null,
): string {
  if (currentTime === null) {
    return "Starts in --:--:--";
  }

  const matchStartTime = new Date(matchDateValue).getTime();

  if (Number.isNaN(matchStartTime)) {
    return "Start time unavailable";
  }

  const remainingMilliseconds = matchStartTime - currentTime;

  if (remainingMilliseconds <= 0) {
    return "Starting soon";
  }

  const totalRemainingSeconds = Math.ceil(remainingMilliseconds / 1000);

  const totalHours = Math.floor(totalRemainingSeconds / 3600);

  const remainingMinutes = Math.floor((totalRemainingSeconds % 3600) / 60);

  const remainingSeconds = totalRemainingSeconds % 60;

  return `Starts in :\u00A0 ${formatCountdownUnit(totalHours)}h: ${formatCountdownUnit(
    remainingMinutes,
  )}m: ${formatCountdownUnit(remainingSeconds)}s`;
}

function getMatchDisplayText(
  match: MatchListItem,
  currentTime: number | null,
): string {
  switch (match.status) {
    case "COMPLETED":
      return match.result?.text ?? "Result unavailable";

    case "UPCOMING":
      return getUpcomingMatchText(match.matchDate, currentTime);

    case "CANCELLED":
      return "Match cancelled";

    case "ABANDONED":
      return "Match abandoned";
  }
}

function TeamLogo({ team }: { team: MatchTeamSummary }) {
  if (team.logoUrl) {
    return (
      <Image
        src={team.logoUrl}
        alt={`${team.teamName} logo`}
        width={54}
        height={54}
        className="h-10 w-10 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-13.5 lg:w-13.5 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div className="flex uppercase h-10 w-10 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-slate-100 text-sm sm:text-base md:text-base lg:text-lg font-semibold text-slate-700 ring-1 ring-slate-200 shrink-0">
      {getTeamInitials(team)}
    </div>
  );
}

function TeamScore({
  team,
  matchStatus,
  align = "left",
}: {
  team: MatchTeamSummary;
  matchStatus: MatchListItem["status"];
  align?: "left" | "right";
}) {
  const isRightAligned = align === "right";
  const isUpcomingMatch = matchStatus === "UPCOMING";
  const formattedOvers = formatOvers(team.balls);

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-3 sm:gap-3 md:gap-4 lg:gap-5 mt-1.5 ${
          isRightAligned ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div>
          <TeamLogo team={team} />

          <div
            className={`mt-1.5 min-[450px]:mt-1.5 sm:mt-1.5 md:mt-2 lg:mt-3 w-10 sm:w-12 md:w-12 lg:w-14 text-center text-[11px] sm:text-sm md:text-sm lg:text-[16px] font-semibold text-slate-950 uppercase tracking-wide ${
              isRightAligned ? "ml-auto" : "mr-auto"
            }`}
          >
            {team.shortName || team.teamName}
          </div>
        </div>

        <div
          className={`self-start flex flex-col mt-1.25 sm:mt-1.5 ${
            isRightAligned ? "text-right" : "text-left"
          }`}
        >
          {isUpcomingMatch ? (
            <div className="mt-1.75 sm:mt-1.75 md:mt-1.5 lg:mt-2.25 max-w-25 text-[14px] font-medium leading-tight tracking-tight text-slate-900 sm:max-w-32.5 sm:text-[18px] md:max-w-37.5 md:text-[20px] lg:max-w-45 lg:text-[22px]">
              {team.teamName}
            </div>
          ) : (
            <>
              <div className="text-[15px] sm:text-[19px] md:text-[20px] lg:text-[22px] font-semibold text-slate-900 tracking-tight leading-tight">
                {team.runs}-{team.wickets}
              </div>

              <div className="text-[11px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-slate-500 font-medium leading-none mt-1">
                {formattedOvers} Over
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchTitle({ title }: { title: string }) {
  return (
    <h2 className="flex items-center gap-1 sm:gap-1.5 text-[13.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-medium text-slate-950 tracking-tight leading-snug min-w-0 w-full">
      <span className="truncate">{title}</span>

      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5 lg:h-6.25 lg:w-6.25 -mt-px text-indigo-900 shrink-0 stroke-[2.2] translate-y-px" />
    </h2>
  );
}

export function MatchCard({ match, onViewDetails }: MatchCardProps) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  const { firstInningsTeam, secondInningsTeam } = getInningsTeams(match);

  useEffect(() => {
    if (match.status !== "UPCOMING") {
      return;
    }

    const updateCurrentTime = () => {
      setCurrentTime(Date.now());
    };

    updateCurrentTime();

    const countdownIntervalId = window.setInterval(updateCurrentTime, 1000);

    return () => {
      window.clearInterval(countdownIntervalId);
    };
  }, [match.status, match.matchDate]);

  const matchDisplayText = getMatchDisplayText(match, currentTime);

  const handleViewDetails = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onViewDetails?.();
  };

  return (
    <article className="mx-auto w-full max-w-110 sm:max-w-135 md:max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="px-3 min-[450px]:px-4.5 sm:px-5 md:px-6 lg:px-8 pt-2 min-[450px]:pt-3.5 sm:pt-4 md:pt-4.5 lg:pt-6 pb-1 min-[450px]:pb-1.5 sm:pb-1.5 md:pb-2 lg:pb-3">
        <MatchTitle title={match.title} />

        <p className="mt-1 text-[11px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-slate-500 font-medium">
          {formatMatchDate(match.matchDate)}
        </p>
      </div>

      <div className="mx-3 min-[450px]:mx-4.5 sm:mx-5 md:mx-6 lg:mx-8 border-t border-slate-200/70" />

      <div className="flex items-center justify-between px-3 min-[450px]:px-4.5 sm:px-5 md:px-6 lg:px-8 py-2.5 min-[450px]:py-3.5 sm:py-4 md:py-5 lg:py-8">
        <TeamScore team={firstInningsTeam} matchStatus={match.status} />

        <div className="flex shrink-0 items-center justify-center px-1 sm:px-3 md:px-4">
          <Zap className="h-5.5 w-5.5 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-11 lg:w-11 -mt-2 min-[450px]:-mt-3.5 sm:-mt-3 md:-mt-3.5 lg:-mt-5 fill-slate-400 text-slate-400 stroke-[1.5]" />
        </div>

        <TeamScore
          team={secondInningsTeam}
          matchStatus={match.status}
          align="right"
        />
      </div>

      <div className="mx-3 min-[450px]:mx-4.5 sm:mx-5 md:mx-6 lg:mx-8 border-t border-slate-200/70" />

      <div className="flex items-center justify-between px-3 min-[450px]:px-4.5 sm:px-5 md:px-6 lg:px-8 pb-2.5 min-[450px]:pb-3 sm:pb-3.5 md:pb-3.5 lg:pb-5 pt-1.5 min-[450px]:pt-2 sm:pt-2 md:pt-2 lg:pt-3">
        <p className="min-w-0 truncate pr-2 text-[12px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-medium text-[#c25e5e] tracking-tight">
          {matchDisplayText}
        </p>

        <button
          type="button"
          onClick={handleViewDetails}
          className="rounded-lg border border-slate-600 p-1 sm:p-1.5 md:p-1.5 lg:p-1.5 text-slate-950 transition hover:bg-slate-50 cursor-pointer"
          aria-label={`View statistics for ${match.title}`}
        >
          <BarChart3 className="h-4.5 w-4.5 sm:h-5 md:h-5 lg:h-6 lg:w-6 stroke-[1.75]" />
        </button>
      </div>
    </article>
  );
}
