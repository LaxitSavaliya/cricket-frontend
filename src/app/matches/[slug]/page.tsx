"use client";

import { useMatch } from "@/features/matches";
import { Calendar, ChevronRight, HandCoins, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MatchDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: matchDetails, isLoading, isError, error } = useMatch(slug);

  // Date Formatting helper
  const formatMatchDate = (value: Date | string) => {
    const d = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(d);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          role="status"
          aria-label="Loading matches"
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-primary"
        />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  if (!matchDetails) {
    return (
      <div className="flex-1 flex justify-center items-center text-lg text-slate-500 font-semibold py-20">
        Match not found.
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full py-1">
      <div className="bg-white rounded-xl p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-400/90 text-white text-xs sm:text-base font-black uppercase">
            {matchDetails.homeTeam.shortName?.slice(0, 2) ||
              matchDetails.homeTeam.teamName.slice(0, 2)}
          </div>
          <span className="text-sm sm:text-lg font-bold text-slate-900">
            {matchDetails.homeTeam.shortName}
          </span>
        </div>
        <div className="flex items-center justify-center text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm sm:text-lg font-bold text-slate-900">
            {matchDetails.awayTeam.shortName}
          </span>
          <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-400/90 text-white text-xs sm:text-base font-black uppercase">
            {matchDetails.awayTeam.shortName?.slice(0, 2) ||
              matchDetails.awayTeam.teamName.slice(0, 2)}
          </div>
        </div>
      </div>

      {/* 2. Match Name Card Container */}
      <div className="bg-white rounded-xl p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 bg-linear-to-tr from-indigo-500 to-blue-600 rounded-xl flex flex-col items-center justify-center text-white font-extrabold shadow-sm shrink-0">
            <span className="text-xs sm:text-xl tracking-tight leading-tight">
              {matchDetails.matchFormat}
            </span>
          </div>
          <h3 className="text-xs sm:text-lg font-bold text-slate-900 leading-snug">
            {matchDetails.title}
          </h3>
        </div>
      </div>

      {/* 3. Details List (Date, Toss, Venue) */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 divide-y divide-slate-100 overflow-hidden">
        {/* Date Row */}
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4.5">
          <Calendar className="text-blue-500 h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0" />
          <span className="text-xs sm:text-[15px] text-slate-700 font-semibold">
            {formatMatchDate(matchDetails.matchDate)} at Your Time
          </span>
        </div>

        {/* Toss Decision Row */}
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4.5">
          <HandCoins className="text-red-400 h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0" />
          <span className="text-xs sm:text-[15px] text-slate-700 font-semibold">
            {matchDetails.tossWinnerTeamId
              ? matchDetails.tossWinnerTeamId === matchDetails.homeTeam.id
                ? `${matchDetails.homeTeam.teamName} won the toss and elected to ${matchDetails.tossDecision?.toLowerCase()}`
                : `${matchDetails.awayTeam.teamName} won the toss and elected to ${matchDetails.tossDecision?.toLowerCase()}`
              : "Toss details not available"}
          </span>
        </div>

        {/* Venue/Stadium Row */}
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4.5">
          <MapPin className="text-green-500 h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0" />
          <span className="text-xs sm:text-[15px] text-slate-700 font-semibold leading-normal">
            {matchDetails.venue}, {matchDetails.city}
          </span>
        </div>
      </div>

      {/* 4. Team Squads Section */}
      <div className="pt-1 space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-slate-700 px-1">
          Team Squads
        </h3>
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 divide-y divide-slate-100 overflow-hidden">
          {/* Home Team Squad link */}
          <Link
            href={`/matches/${slug}/team-squads`}
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4.5 hover:bg-slate-50 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-400/70 text-white text-[10px] sm:text-xs font-black uppercase">
                {matchDetails.homeTeam.shortName?.slice(0, 2) ||
                  matchDetails.homeTeam.teamName.slice(0, 2)}
              </div>
              <span className="text-xs sm:text-[15px] text-slate-800 font-semibold">
                {matchDetails.homeTeam.teamName}
              </span>
            </div>
            <ChevronRight className="text-slate-700 h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </Link>

          {/* Away Team Squad link */}
          <Link
            href={`/matches/${slug}/team-squads`}
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4.5 hover:bg-slate-50 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-400/70 text-white text-[10px] sm:text-xs font-black uppercase">
                {matchDetails.awayTeam.shortName?.slice(0, 2) ||
                  matchDetails.awayTeam.teamName.slice(0, 2)}
              </div>
              <span className="text-xs sm:text-[15px] text-slate-800 font-semibold">
                {matchDetails.awayTeam.teamName}
              </span>
            </div>

            <ChevronRight className="text-slate-700 h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
