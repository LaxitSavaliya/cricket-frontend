"use client";

import { useMatchScore } from "@/features/matches";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const ScoreCard = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: matchScore,
    isLoading: isScoreLoading,
    isError: isScoreError,
    error: scoreError,
  } = useMatchScore(slug);

  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({
    home: false,
    away: true,
  });

  const toggleTeam = (team: "home" | "away") => {
    setOpenTeams((previousTeams) => ({
      ...previousTeams,
      [team]: !previousTeams[team],
    }));
  };

  if (isScoreLoading) {
    return (
      <main className="flex flex-1 justify-center items-center py-20">
        <div
          role="status"
          aria-label="Loading scorecard"
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
        />
      </main>
    );
  }

  if (isScoreError || !matchScore) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
        {scoreError?.message || "Failed to load scorecard data."}
      </div>
    );
  }

  const { firstInning, secondInning } = matchScore;

  const scorecardTeams = [
    ...(firstInning
      ? [
          {
            key: "home" as const,
            team: firstInning,
          },
        ]
      : []),

    ...(secondInning
      ? [
          {
            key: "away" as const,
            team: secondInning,
          },
        ]
      : []),
  ];

  const formatPlayerName = (player: {
    name: string;
    isCaptain?: boolean;
    isViceCaptain?: boolean;
    isWicketKeeper?: boolean;
  }) => {
    const roles: string[] = [];

    if (player.isCaptain) {
      roles.push("c");
    }

    if (player.isViceCaptain) {
      roles.push("vc");
    }

    if (player.isWicketKeeper) {
      roles.push("wk");
    }

    return `${player.name}${roles.length > 0 ? ` (${roles.join(" & ")})` : ""}`;
  };

  const ordinalSuffix = (number: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;

    return (
      suffixes[(remainder - 20) % 10] ||
      suffixes[remainder] ||
      suffixes[0] ||
      "th"
    );
  };

  return (
    <div className="space-y-4 w-full py-1">
      {/* Head to Head Header Card */}
      {/* <div className="min-[900px]:bg-white min-[900px]:py-2.5 min-[900px]:px-5 rounded-2xl shadow-none border-0 min-[900px]:shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:border lg:border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-[500px]:gap-2.5 sm:gap-4">
          {renderTeamHeaderLogo(
            firstTeam.teamName,
            firstTeam.shortName,
            firstTeam.logoUrl,
          )}

          <span className="text-sm min-[500px]:text-base md:text-lg font-bold text-slate-900">
            {firstTeam.shortName || firstTeam.teamName}
          </span>
        </div>

        <Zap className="h-5 w-5 min-[500px]:h-6 min-[500px]:w-6 md:h-7 md:w-7 text-slate-400 fill-slate-100" />

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm min-[500px]:text-base md:text-lg font-bold text-slate-900">
            {secondTeam.shortName || secondTeam.teamName}
          </span>

          {renderTeamHeaderLogo(
            secondTeam.teamName,
            secondTeam.shortName,
            secondTeam.logoUrl,
          )}
        </div>
      </div> */}

      {/* Match Result Winner Banner */}
      {/* {matchResultText && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-300 text-center text-xs sm:text-sm font-semibold text-orange-400/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {matchResultText}
        </div>
      )} */}

      {/* Team scorecards accordions */}
      <div className="space-y-3 -mx-1.5">
        {scorecardTeams.map(({ key, team }) => {
          const isOpen = openTeams[key];
          const score = team.score;
          const extras = score.extras;

          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
            >
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleTeam(key)}
                className="w-full flex items-center justify-between px-4 py-3 md:px-5 min-[1200px]:pl-8! min-[1200px]:pr-6! min-[1200px]:py-3.5 bg-neutral-800 text-white font-semibold transition hover:bg-neutral-900 cursor-pointer text-left"
              >
                <span className="text-xs sm:text-base tracking-wide font-semibold">
                  {team.teamName}
                </span>

                <div className="flex items-center gap-3 min-[1200px]:gap-5!">
                  <span className="text-xs sm:text-base">
                    {team.runs}-{team.wickets} ({team.overs})
                  </span>

                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 min-[1200px]:h-5.5! min-[1200px]:w-5.5! opacity-80" />
                  ) : (
                    <ChevronDown className="w-5 h-5 min-[1200px]:h-5.5! min-[1200px]:w-5.5! opacity-80" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="divide-y divide-slate-300">
                  {/* Batter Section */}
                  <div>
                    {/* Table Header */}
                    <div className="flex bg-slate-200/60 text-[11px] sm:text-sm font-semibold text-slate-500 uppercase py-2 md:py-2.25 pr-1 pl-3 md:pl-6 md:pr-5 min-[1200px]:pl-9! min-[1200px]:pr-8! min-[1200px]:py-2.5! border-b border-slate-200">
                      <div className="flex-1 min-w-0">Batter</div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        R
                      </div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        B
                      </div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        4s
                      </div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        6s
                      </div>

                      <div className="w-14 md:w-15 min-[1200px]:w-18! text-center shrink-0">
                        SR
                      </div>
                    </div>

                    {/* Batters List */}
                    <div className="divide-y divide-slate-300">
                      {score.batters.map((batter, index) => {
                        const isActive = !batter.isOut;

                        return (
                          <div
                            key={`${batter.slug}-${index}`}
                            className={`flex items-center py-2.5 px-1 pl-3 md:px-5 min-[1200px]:px-8! text-xs sm:text-sm text-slate-800 transition hover:bg-slate-50/50 ${
                              isActive ? "border-l-4 border-l-amber-500" : ""
                            }`}
                          >
                            <div className="flex-1 min-w-0 pr-5">
                              <div className="font-medium text-slate-900 wrap-break-word whitespace-normal">
                                {formatPlayerName(batter)}
                              </div>

                              {batter.isOut && batter.dismissalText && (
                                <div className="text-[10px] sm:text-xs text-amber-700 font-medium mt-0.5 whitespace-normal wrap-break-word">
                                  {batter.dismissalText}
                                </div>
                              )}
                            </div>

                            <div className="w-9 md:w-12 min-[1200px]:w-15! text-center font-medium text-slate-900 shrink-0">
                              {batter.runs}
                            </div>

                            <div className="w-9 md:w-12 min-[1200px]:w-15! text-center text-slate-500 shrink-0">
                              {batter.balls}
                            </div>

                            <div className="w-9 md:w-12 min-[1200px]:w-15! text-center text-slate-500 shrink-0">
                              {batter.fours}
                            </div>

                            <div className="w-9 md:w-12 min-[1200px]:w-15! text-center text-slate-500 shrink-0">
                              {batter.sixes}
                            </div>

                            <div className="w-14 md:w-15 min-[1200px]:w-18! text-center text-slate-500 font-medium shrink-0">
                              {batter.strikeRate.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Extras & Did Not Bat Row */}
                  <div className="bg-white text-xs sm:text-sm space-y-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-slate-700 font-semibold border-b border-slate-300 py-3 px-4 md:pl-6 md:pr-8 min-[1200px]:pl-9! min-[1200px]:pr-12!">
                      <span>Extras:</span>

                      <span className="font-bold text-slate-900">
                        {extras.total}{" "}
                        <span className="text-slate-500 font-normal">
                          ({extras.byes} b, {extras.legByes} lb, {extras.wides}{" "}
                          wd, {extras.noBalls} nb, {extras.penalties} p)
                        </span>
                      </span>
                    </div>

                    {score.notBat.length > 0 && (
                      <div className="text-slate-600 px-4 pb-4 md:pl-6 md:pr-8 min-[1200px]:pl-9! min-[1200px]:pr-12! flex flex-col gap-1">
                        <span className="font-semibold text-[13px] sm:text-sm text-slate-700 block mb-0.5">
                          Did not bat
                        </span>

                        <p className="text-[11px] sm:text-xs md:text-[13px] text-slate-500 leading-relaxed font-medium">
                          {score.notBat.map((player) => player.name).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bowler Section */}
                  <div className="border-t border-slate-200">
                    {/* Table Header */}
                    <div className="flex bg-slate-200/60 text-[11px] sm:text-sm font-semibold text-slate-500 uppercase py-2 md:py-2.25 pr-1 pl-3 md:pl-5.5 md:pr-5 min-[1200px]:pl-9! min-[1200px]:pr-8! border-b border-slate-200">
                      <div className="flex-1 min-w-0">Bowler</div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        O
                      </div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        M
                      </div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        R
                      </div>

                      <div className="w-9 md:w-12 min-[1200px]:w-15! text-center shrink-0">
                        W
                      </div>

                      <div className="w-14 md:w-15 min-[1200px]:w-18! text-center shrink-0">
                        ER
                      </div>
                    </div>

                    {/* Bowlers List */}
                    <div className="divide-y divide-slate-300">
                      {score.bowlers.map((bowler, index) => (
                        <div
                          key={`${bowler.slug}-${index}`}
                          className="flex items-center py-2.5 px-1 pl-3 md:pl-5.5 md:pr-5 min-[1200px]:pl-9! min-[1200px]:pr-8! text-xs sm:text-sm text-slate-800 transition hover:bg-slate-50/50"
                        >
                          <div className="flex-1 min-w-0 pr-5 font-medium text-slate-900 wrap-break-word whitespace-normal">
                            {formatPlayerName(bowler)}
                          </div>

                          <div className="w-9 md:w-12 min-[1200px]:w-15! text-center text-slate-600 shrink-0">
                            {bowler.overs.toFixed(1)}
                          </div>

                          <div className="w-9 md:w-12 min-[1200px]:w-15! text-center text-slate-600 shrink-0">
                            {bowler.maidens}
                          </div>

                          <div className="w-9 md:w-12 min-[1200px]:w-15! text-center text-slate-600 shrink-0">
                            {bowler.runs}
                          </div>

                          <div className="w-9 md:w-12 min-[1200px]:w-15! text-center font-medium text-slate-950 shrink-0">
                            {bowler.wickets}
                          </div>

                          <div className="w-14 md:w-15 min-[1200px]:w-18! text-center text-slate-500 font-medium shrink-0">
                            {bowler.economyRate.toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fall of Wicket Section */}
                  {score.fallOfWickets.length > 0 && (
                    <div className="border-t border-slate-200">
                      {/* Table Header */}
                      <div className="flex bg-slate-200/60 text-[11px] sm:text-sm font-semibold text-slate-500 uppercase py-2 md:py-2.25 pr-1 pl-3 md:pl-5.5 md:pr-5 min-[1200px]:pl-9! min-[1200px]:pr-8! border-b border-slate-200">
                        <div className="flex-1 min-w-0">Fall of Wickets</div>

                        <div className="w-20 sm:w-24 md:w-28 min-[1200px]:w-32! text-center shrink-0">
                          Score
                        </div>

                        <div className="w-20 sm:w-24 md:w-28 min-[1200px]:w-32! text-center shrink-0">
                          Over
                        </div>
                      </div>

                      {/* Fall of Wickets List */}
                      <div className="divide-y divide-slate-300">
                        {score.fallOfWickets.map((fallOfWicket) => (
                          <div
                            key={`${fallOfWicket.wicketNo}-${fallOfWicket.slug}`}
                            className="flex items-center py-2.5 px-1 pl-3 md:pl-5.5 md:pr-5 min-[1200px]:pl-9! min-[1200px]:pr-8! text-xs sm:text-sm text-slate-800 transition hover:bg-slate-50/50"
                          >
                            <div className="flex-1 min-w-0 pr-5 font-medium text-slate-900 wrap-break-word whitespace-normal">
                              {fallOfWicket.name}
                            </div>

                            <div className="w-20 sm:w-24 md:w-28 min-[1200px]:w-32! text-center text-slate-600 font-medium shrink-0">
                              {fallOfWicket.runs}/{fallOfWicket.wicketNo}
                            </div>

                            <div className="w-20 sm:w-24 md:w-28 min-[1200px]:w-32! text-center text-slate-500 shrink-0">
                              {fallOfWicket.overs.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Partnership Section */}
                  {score.partnerships.length > 0 && (
                    <div className="border-t border-slate-200">
                      {/* Section Header */}
                      <div className="flex bg-slate-200/60 text-[11px] sm:text-sm font-semibold text-slate-500 uppercase py-2 md:py-2.25 pr-1 pl-3 md:pl-5.5 md:pr-5 min-[1200px]:pl-9! min-[1200px]:pr-8! border-b border-slate-200">
                        Partnership
                      </div>

                      {/* Partnerships List */}
                      <div className="divide-y divide-slate-400/80">
                        {score.partnerships.map((partnership, index) => {
                          const isUnfinished =
                            partnership.forWicket > score.fallOfWickets.length;

                          return (
                            <div
                              key={`${partnership.forWicket}-${index}`}
                              className="flex items-stretch text-xs sm:text-sm text-slate-800 transition hover:bg-slate-50/50"
                            >
                              {/* Left column: Partnership player details */}
                              <div className="flex-1 flex flex-col justify-center">
                                {/* Player 1 */}
                                <div className="flex justify-between items-center py-2.5 pl-3 md:pl-6 pr-3 min-[1200px]:pl-9! md:pr-5 min-[1200px]:pr-8! border-b border-slate-200">
                                  <span className="font-medium text-slate-850 pr-2 truncate">
                                    {partnership.firstBatter.name}
                                  </span>

                                  <span className="text-slate-900 font-semibold shrink-0">
                                    {partnership.firstBatter.runs}

                                    <span className="text-slate-500 font-normal text-[10px] sm:text-xs ml-1">
                                      ({partnership.firstBatter.balls})
                                    </span>
                                  </span>
                                </div>

                                {/* Player 2 */}
                                <div className="flex justify-between items-center py-2.5 pl-3 md:pl-6 pr-3 min-[1200px]:pl-9! md:pr-5 min-[1200px]:pr-8!">
                                  <span className="font-medium text-slate-850 pr-2 truncate">
                                    {partnership.secondBatter.name}
                                  </span>

                                  <span className="text-slate-900 font-semibold shrink-0">
                                    {partnership.secondBatter.runs}

                                    <span className="text-slate-500 font-normal text-[10px] sm:text-xs ml-1">
                                      ({partnership.secondBatter.balls})
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Right column: Partnership Runs & Wicket No */}
                              <div className="w-24 sm:w-28 md:w-30 min-[1200px]:w-32! border-l border-slate-300 shrink-0 flex flex-col justify-center items-center gap-1">
                                <div className="font-bold text-slate-900 text-[15px] sm:text-sm">
                                  {partnership.runs}
                                  {isUnfinished ? "*" : ""}

                                  <span className="text-slate-600/80 font-normal text-[11px] sm:text-xs ml-1">
                                    ({partnership.balls})
                                  </span>
                                </div>

                                <div className="text-[10px] sm:text-xs text-slate-500 font-normal mt-0.5 whitespace-nowrap">
                                  {partnership.forWicket}
                                  <sup className="lowercase">
                                    {ordinalSuffix(partnership.forWicket)}
                                  </sup>{" "}
                                  Wicket
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreCard;
