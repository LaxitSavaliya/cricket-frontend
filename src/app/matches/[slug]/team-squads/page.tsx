"use client";

import { useMatchPlayers } from "@/features/matches";
import renderTeamHeaderLogo from "@/features/matches/components/render-logo";
import type { MatchPlayer } from "@/features/matches/matches.types";
import { User, Zap } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const TeamSquads = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: matchPlayers,
    isLoading,
    isError,
    error,
  } = useMatchPlayers(slug);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center py-20">
        <div
          role="status"
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        Error loading squads: {error?.message || "Something went wrong"}
      </div>
    );
  }

  if (!matchPlayers) {
    return (
      <div className="text-center py-10 text-slate-500 font-semibold">
        No squads data available for this match.
      </div>
    );
  }

  const { homeTeam, awayTeam } = matchPlayers;

  const formatRole = (role: string) => {
    let displayRole = role.replace(/_/g, " ").toLowerCase();

    // capitalize
    displayRole = displayRole
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (displayRole.includes("Wicket Keeper")) {
      if (displayRole.includes("Batsman")) {
        return "Batter (wk)";
      }
      if (displayRole.includes("All Rounder")) {
        return "All Rounder (wk)";
      }
      return "Wicket Keeper";
    }

    if (displayRole === "Batsman") return "Batter";
    if (displayRole === "Bowler") return "Bowler";
    if (displayRole === "All Rounder") return "All Rounder";

    return displayRole;
  };

  const getPlayerRoleText = (player: MatchPlayer) => {
    const baseRole = formatRole(player.role);
    if (player.isCaptain) {
      return `${baseRole} (C)`;
    }
    if (player.isViceCaptain) {
      return `${baseRole} (VC)`;
    }
    if (player.isWicketKeeper) {
      return `${baseRole} (WK)`;
    }
    return baseRole;
  };

  // Helper to render a player row
  const renderPlayer = (
    player: MatchPlayer | undefined,
    align: "left" | "right",
    isLast = false,
  ) => {
    if (!player) return <div className="py-4" />; // Empty placeholder to keep alignment

    const avatar = player.photoUrl ? (
      <Image
        src={player.photoUrl}
        alt={player.name}
        width={40}
        height={40}
        unoptimized
        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border border-slate-200"
      />
    ) : (
      <div className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
        <User className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    );

    if (align === "left") {
      return (
        <div
          className={`flex items-center gap-2.5 sm:gap-3 py-3 ${isLast ? "" : "border-b border-slate-200"} text-left min-w-0`}
        >
          {avatar}
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-[11px] sm:text-[13px] md:text-[15px] truncate">
              {player.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
              {getPlayerRoleText(player)}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={`flex items-center justify-end gap-2.5 sm:gap-3 py-3 ${isLast ? "" : "border-b border-slate-200"} text-right min-w-0`}
        >
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-[11px] sm:text-[13px] md:text-[15px] truncate">
              {player.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
              {getPlayerRoleText(player)}
            </p>
          </div>
          {avatar}
        </div>
      );
    }
  };

  const homePlaying = homeTeam.players || [];
  const awayPlaying = awayTeam.players || [];
  const playingLength = Math.max(homePlaying.length, awayPlaying.length);

  const homeBench = homeTeam.benchPlayers || [];
  const awayBench = awayTeam.benchPlayers || [];
  const benchLength = Math.max(homeBench.length, awayBench.length);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      {/* Team Header Row */}
      <div className="min-[900px]:bg-white min-[900px]:py-2.5 min-[900px]:px-5 rounded-2xl shadow-none border-0 min-[900px]:shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:border lg:border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-[500px]:gap-2.5 sm:gap-4">
          {renderTeamHeaderLogo(
            homeTeam.teamName,
            homeTeam.shortName,
            homeTeam.logoUrl,
          )}
          <span className="text-sm min-[500px]:text-base md:text-lg font-bold text-slate-900">
            {homeTeam.shortName || homeTeam.teamName}
          </span>
        </div>

        <Zap className="h-5 w-5 min-[500px]:h-6 min-[500px]:w-6 md:h-7 md:w-7 text-slate-400 fill-slate-100" />

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm min-[500px]:text-base md:text-lg font-bold text-slate-900">
            {awayTeam.shortName || awayTeam.teamName}
          </span>
          {renderTeamHeaderLogo(
            awayTeam.teamName,
            awayTeam.shortName,
            awayTeam.logoUrl,
          )}
        </div>
      </div>

      {/* Squad Cards Container */}
      <div className="min-[900px]:bg-white rounded-2xl min-[900px]:shadow-[0_1px_4px_rgba(0,0,0,0.05)] min-[900px]:border min-[900px]:border-slate-100 min-[900px]:px-4 min-[900px]:pt-4 flex flex-col">
        {/* PLAYING XI SECTION */}
        <div className="flex justify-center my-3 sm:my-3">
          <div className="w-full max-w-70 sm:max-w-xs text-center py-2 px-6 bg-[#3f3f46] text-white rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            Playing XI
          </div>
        </div>

        <div className="relative bg-white/20 grid grid-cols-2 gap-x-4 sm:gap-x-8 md:gap-x-12 my-2 min-[900px]:my-5 max-[900px]:border-y max-[900px]:border-slate-300 -mx-4 sm:-mx-6 min-[900px]:mx-0!">
          {/* Vertical Middle Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

          {Array.from({ length: playingLength }).map((_, idx) => {
            const isLast = idx === playingLength - 1;
            return (
              <div
                key={`playing-${idx}`}
                className="col-span-2 grid grid-cols-2 gap-x-4 sm:gap-x-8 md:gap-x-12 px-2.5"
              >
                <div className="min-w-0">
                  {renderPlayer(homePlaying[idx], "left", isLast)}
                </div>
                <div className="min-w-0">
                  {renderPlayer(awayPlaying[idx], "right", isLast)}
                </div>
              </div>
            );
          })}
        </div>

        {/* BENCH PLAYERS SECTION */}
        {(homeBench.length > 0 || awayBench.length > 0) && (
          <>
            <div className="flex justify-center mt-6 mb-3">
              <div className="w-full max-w-70 sm:max-w-xs text-center py-2 px-6 bg-[#3f3f46] text-white rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
                Bench Players
              </div>
            </div>

            <div className="relative bg-white/20 grid grid-cols-2 gap-x-4 sm:gap-x-8 md:gap-x-12 mt-2 max-[900px]:border-y max-[900px]:border-slate-300 -mx-4 sm:-mx-6 min-[900px]:mx-0!">
              {/* Vertical Middle Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

              {Array.from({ length: benchLength }).map((_, idx) => {
                const isLast = idx === benchLength - 1;
                return (
                  <div
                    key={`bench-${idx}`}
                    className="col-span-2 grid grid-cols-2 gap-x-4 sm:gap-x-8 md:gap-x-12 px-2.5"
                  >
                    <div className="min-w-0">
                      {renderPlayer(homeBench[idx], "left", isLast)}
                    </div>
                    <div className="min-w-0">
                      {renderPlayer(awayBench[idx], "right", isLast)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamSquads;
