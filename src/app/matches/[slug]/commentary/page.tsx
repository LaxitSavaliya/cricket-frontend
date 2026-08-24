"use client";

import {
  useMatchCommentary,
  type MatchBatterIntro,
  type MatchBowlerIntro,
  type MatchOverSummary,
} from "@/features/matches";
import { User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Fragment } from "react";

const getRunBadgeDetails = (text: string, shortLabel?: string) => {
  const label =
    shortLabel ||
    (() => {
      const upper = text.toUpperCase();
      if (upper.includes("OUT!")) return "W";
      if (upper.includes("SIX") || upper.includes("6 RUN")) return "6";
      if (upper.includes("FOUR") || upper.includes("4 RUN")) return "4";
      if (upper.includes("3 RUN")) return "3";
      if (
        upper.includes("2 RUN") ||
        upper.includes("2 WIDE") ||
        upper.includes("2 LEG BYE") ||
        upper.includes("2 BYE")
      ) {
        return "2";
      }
      if (
        upper.includes("1 RUN") ||
        upper.includes("1 WIDE") ||
        upper.includes("1 LEG BYE") ||
        upper.includes("1 BYE")
      ) {
        return "1";
      }
      return "0";
    })();

  if (label === "W") {
    return { label, color: "bg-rose-600 text-white border-transparent" };
  }
  if (label === "6") {
    return { label, color: "bg-purple-600 text-white border-transparent" };
  }
  if (label === "4") {
    return { label, color: "bg-sky-500 text-white border-transparent" };
  }
  if (["1", "2", "3", "5"].includes(label)) {
    return { label, color: "bg-emerald-600 text-white border-transparent" };
  }
  if (
    label.startsWith("Wd") ||
    label.startsWith("Nb") ||
    label.startsWith("B") ||
    label.startsWith("Lb")
  ) {
    return {
      label,
      color: "bg-amber-500 text-white border-transparent",
    };
  }
  return {
    label: label === "." ? "0" : label,
    color: "bg-slate-100 border-slate-300 text-slate-600",
  };
};

const renderCommentaryText = (text: string) => {
  let separatorIndex = text.indexOf(":");
  if (separatorIndex === -1) {
    const toIndex = text.indexOf(" to ");
    if (toIndex !== -1) {
      const commaIndex = text.indexOf(",", toIndex);
      if (commaIndex !== -1) {
        separatorIndex = commaIndex;
      }
    }
  }

  if (separatorIndex === -1) {
    return <span className="text-slate-800 font-normal">{text}</span>;
  }

  const matchInfo = text.substring(0, separatorIndex + 1);
  const rest = text.substring(separatorIndex + 1).trim();

  const lowerRest = rest.toLowerCase();
  const isEvent =
    lowerRest.startsWith("four") ||
    lowerRest.startsWith("six") ||
    lowerRest.startsWith("out") ||
    lowerRest.startsWith("wicket");

  if (isEvent) {
    const bangIndex = rest.indexOf("!!!");
    if (bangIndex !== -1) {
      const boldPart = rest.substring(0, bangIndex + 3);
      const normalPart = rest.substring(bangIndex + 3);
      return (
        <span className="text-slate-700 font-normal leading-relaxed">
          <span className="font-semibold text-slate-900">{matchInfo}</span>{" "}
          <strong className="font-bold text-slate-900">{boldPart}</strong>
          {normalPart}
        </span>
      );
    } else {
      const periodIndex = rest.indexOf(".");
      if (periodIndex !== -1) {
        const boldPart = rest.substring(0, periodIndex + 1);
        const normalPart = rest.substring(periodIndex + 1);
        return (
          <span className="text-slate-700 font-normal leading-relaxed">
            <span className="font-semibold text-slate-900">{matchInfo}</span>{" "}
            <strong className="font-bold text-slate-900">{boldPart}</strong>
            {normalPart}
          </span>
        );
      }
    }
  }

  return (
    <span className="text-slate-700 font-normal leading-relaxed">
      <span className="font-semibold text-slate-900">{matchInfo}</span>{" "}
      <span className="text-slate-800">{rest}</span>
    </span>
  );
};

const BatterIntroCard = ({ intro }: { intro: MatchBatterIntro }) => {
  return (
    <div className="my-3.5 mx-2.5 sm:mx-4 md:mx-6 min-[1200px]:mx-8 p-3 sm:p-4 md:p-4.5 rounded-2xl bg-violet-600 text-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-1 sm:px-2 pb-2.5 border-b border-violet-400/60 text-xs sm:text-sm md:text-base">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-violet-200 shrink-0" />
          <span className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm md:text-[15px]">
            Batter
          </span>
        </div>
        <div className="font-medium text-violet-100 text-xs sm:text-sm md:text-base">
          Best <span className="font-bold text-white ml-0.5">{intro.best}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 md:mt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-3.5 px-0.5 sm:px-1">
        {/* Player info */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl overflow-hidden bg-violet-700/30 shrink-0 border border-violet-400/80 flex items-center justify-center relative shadow-inner">
            {intro.photoUrl ? (
              <Image
                src={intro.photoUrl}
                alt={intro.name}
                width={56}
                height={56}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm sm:text-base md:text-lg text-white truncate leading-tight">
              {intro.name}
            </h4>
            <span className="text-[11px] sm:text-[13px] text-violet-200 font-medium">
              Batter
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-10 text-center shrink-0 w-full md:w-auto pt-1 md:pt-0">
          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.matches}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              Matches
            </div>
          </div>

          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.runs}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              Runs
            </div>
          </div>

          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.strikeRate.toFixed(1)}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              S/R
            </div>
          </div>

          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.average.toFixed(1)}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              Avg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BowlerIntroCard = ({ intro }: { intro: MatchBowlerIntro }) => {
  return (
    <div className="my-3.5 mx-2.5 sm:mx-4 md:mx-6 min-[1200px]:mx-8 p-3 sm:p-4 md:p-4.5 rounded-2xl bg-violet-600 text-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-1 sm:px-2 pb-2.5 border-b border-violet-400/60 text-xs sm:text-sm md:text-base">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-violet-200 shrink-0" />
          <span className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm md:text-[15px]">
            Bowler
          </span>
        </div>
        <div className="font-medium text-violet-100 text-xs sm:text-sm md:text-base">
          Best <span className="font-bold text-white ml-0.5">{intro.best}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 md:mt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-3.5 px-0.5 sm:px-1">
        {/* Player info */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl overflow-hidden bg-violet-700/30 shrink-0 border border-violet-400/80 flex items-center justify-center relative shadow-inner">
            {intro.photoUrl ? (
              <Image
                src={intro.photoUrl}
                alt={intro.name}
                width={56}
                height={56}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm sm:text-base md:text-lg text-white truncate leading-tight">
              {intro.name}
            </h4>
            <span className="text-[11px] sm:text-[13px] text-violet-200 font-medium">
              Bowler
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-10 text-center shrink-0 w-full md:w-auto pt-1 md:pt-0">
          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.matches}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              Matches
            </div>
          </div>

          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.wickets}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              Wickets
            </div>
          </div>

          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.economy.toFixed(1)}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              Econ
            </div>
          </div>

          <div className="px-1.5 py-1 md:px-0 md:py-0">
            <div className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
              {intro.average.toFixed(1)}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-white font-medium mt-0.5">
              Avg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverSummaryCard = ({
  summary,
  overBalls,
}: {
  summary: MatchOverSummary;
  overBalls: { shortLabel?: string; commentaryText: string }[];
}) => {
  // Format ordinal e.g. 1st, 2nd, 3rd, 4th, 5th, etc.
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="my-3.5 mx-2.5 sm:mx-4 md:mx-6 min-[1200px]:mx-8 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
      {/* Top Bar: Left Heading "END OF 1ST OVER", Right Side Balls in Row */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 text-xs sm:text-sm md:text-base">
        <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs sm:text-sm md:text-[15px]">
          END OF {getOrdinal(summary.overNo)} OVER
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {overBalls.map((b, idx) => {
            const badge = getRunBadgeDetails(b.commentaryText, b.shortLabel);
            return (
              <div
                key={`over-ball-badge-${idx}`}
                className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border text-[11px] sm:text-xs font-semibold shadow-xs ${badge.color}`}
              >
                {badge.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Row - stays row on all screen sizes and stretches items */}
      <div className="mt-3 flex flex-row items-stretch gap-3 sm:gap-5 md:gap-6">
        {/* Left Side Box: Batting team total runs in overs (full height match) */}
        <div className="flex flex-col justify-center items-center px-2.5 sm:px-4 py-2.5 sm:py-3.5 rounded-xl bg-slate-50 border border-slate-200/90 w-23 sm:w-36 md:w-44 shrink-0 text-center self-stretch">
          <div className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            {summary.runs}-{summary.wickets}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-bold mt-0.5">
            {summary.overNo} {summary.overNo === 1 ? "Over" : "Overs"}
          </div>
        </div>

        {/* Right Side Column */}
        <div className="flex-1 flex flex-col justify-center space-y-2.5 min-w-0 py-0.5">
          {/* Batters */}
          {summary.battersOnCrease.map((batter, idx) => (
            <div
              key={`crease-batter-${batter.slug}-${idx}`}
              className="flex items-center justify-between text-xs sm:text-sm md:text-base"
            >
              <span className="font-semibold text-slate-800 truncate pr-2">
                {batter.name}
              </span>
              <span className="font-bold text-slate-900 shrink-0">
                {batter.runs}{" "}
                <span className="font-normal text-slate-500 text-xs sm:text-sm">
                  ({batter.balls})
                </span>
              </span>
            </div>
          ))}

          {/* Bowler (after batters, separated by line) */}
          {summary.bowler && (
            <>
              <div className="border-t border-slate-200/70 mb-1 pt-0.75" />
              <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
                <span className="font-semibold text-slate-800 truncate pr-2">
                  {summary.bowler.name}
                </span>
                <span className="font-bold text-slate-900 shrink-0">
                  {summary.bowler.runs}{" "}
                  <span className="font-normal text-slate-500 text-xs sm:text-sm">
                    ({summary.bowler.overs})
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Commentary = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: matchCommentary,
    isLoading: isCommentaryLoading,
    isError: isCommentaryError,
    error: commentaryError,
  } = useMatchCommentary(slug);

  if (isCommentaryLoading) {
    return (
      <main className="flex flex-1 justify-center items-center py-20">
        <div
          role="status"
          aria-label="Loading commentary"
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
        />
      </main>
    );
  }

  if (isCommentaryError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
        {commentaryError?.message || "Failed to load commentary data."}
      </div>
    );
  }

  const batterIntroMap = new Map<string, MatchBatterIntro[]>();
  if (matchCommentary?.secondInning?.batterIntro) {
    for (const intro of matchCommentary.secondInning.batterIntro) {
      const key = `2-${intro.deliveryNo}`;
      const existing = batterIntroMap.get(key) || [];
      batterIntroMap.set(key, [...existing, intro]);
    }
  }
  if (matchCommentary?.firstInning?.batterIntro) {
    for (const intro of matchCommentary.firstInning.batterIntro) {
      const key = `1-${intro.deliveryNo}`;
      const existing = batterIntroMap.get(key) || [];
      batterIntroMap.set(key, [...existing, intro]);
    }
  }

  const bowlerIntroMap = new Map<string, MatchBowlerIntro>();
  if (matchCommentary?.secondInning?.bowlerIntro) {
    for (const intro of matchCommentary.secondInning.bowlerIntro) {
      bowlerIntroMap.set(`2-${intro.deliveryNo}`, intro);
    }
  }
  if (matchCommentary?.firstInning?.bowlerIntro) {
    for (const intro of matchCommentary.firstInning.bowlerIntro) {
      bowlerIntroMap.set(`1-${intro.deliveryNo}`, intro);
    }
  }

  // Maps for over summaries per inning & overNo
  const overSummaryMap = new Map<string, MatchOverSummary>();
  if (matchCommentary?.firstInning?.overSummaries) {
    for (const summary of matchCommentary.firstInning.overSummaries) {
      overSummaryMap.set(`1-${summary.overNo}`, summary);
    }
  }
  if (matchCommentary?.secondInning?.overSummaries) {
    for (const summary of matchCommentary.secondInning.overSummaries) {
      overSummaryMap.set(`2-${summary.overNo}`, summary);
    }
  }

  const commentaryList = [
    ...(matchCommentary?.secondInning?.commentary.map((item) => ({
      ...item,
      inningNo: 2,
    })) || []),
    ...(matchCommentary?.firstInning?.commentary.map((item) => ({
      ...item,
      inningNo: 1,
    })) || []),
  ].sort((a, b) => {
    if (a.inningNo !== b.inningNo) {
      return b.inningNo - a.inningNo;
    }
    return b.deliveryNo - a.deliveryNo;
  });

  // Group commentary balls by inning and overNo for over summary row badges
  const ballsByOverMap = new Map<
    string,
    { shortLabel?: string; commentaryText: string }[]
  >();
  for (const item of commentaryList) {
    const displayOverNo = item.overNo + 1; // 1-indexed
    const key = `${item.inningNo}-${displayOverNo}`;
    const list = ballsByOverMap.get(key) || [];
    // Keep in chronological order (left to right: ball 1 to ball 6)
    list.unshift({
      shortLabel: item.shortLabel,
      commentaryText: item.commentaryText,
    });
    ballsByOverMap.set(key, list);
  }

  return (
    <div className="space-y-4 w-full py-1">
      {/* Commentary Card */}
      <div className="space-y-3 -mx-1.5">
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          {/* Card Header Bar */}
          <div className="w-full flex items-center justify-between px-4 py-3 md:px-5 min-[1200px]:pl-8! min-[1200px]:pr-6! min-[1200px]:py-3.5 bg-neutral-800 text-white font-semibold text-left">
            <span className="text-xs sm:text-base tracking-wide font-semibold">
              Match Commentary
            </span>
          </div>

          {/* Commentary List */}
          {commentaryList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-medium text-xs sm:text-sm">
              No commentary available for this match yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-300">
              {commentaryList.map((ball, idx) => {
                const overLabel = `${ball.overNo}.${ball.ballNo}`;
                const badge = getRunBadgeDetails(
                  ball.commentaryText,
                  ball.shortLabel,
                );
                const batterIntros = batterIntroMap.get(
                  `${ball.inningNo}-${ball.deliveryNo}`,
                );
                const bowlerIntro = bowlerIntroMap.get(
                  `${ball.inningNo}-${ball.deliveryNo}`,
                );

                // In descending order (latest ball first), the top of an over is where previous ball is from a different over/inning
                const prevBall = commentaryList[idx - 1];
                const isStartOfOverInDescending =
                  !prevBall ||
                  prevBall.inningNo !== ball.inningNo ||
                  prevBall.overNo !== ball.overNo;

                const displayOverNo = ball.overNo + 1;
                const overSummary = isStartOfOverInDescending
                  ? overSummaryMap.get(`${ball.inningNo}-${displayOverNo}`)
                  : undefined;
                const overBalls = isStartOfOverInDescending
                  ? ballsByOverMap.get(`${ball.inningNo}-${displayOverNo}`) ||
                    []
                  : [];

                // Check if this ball represents the transition between 2nd inning and 1st inning in descending order
                const isInningBreak =
                  prevBall && prevBall.inningNo === 2 && ball.inningNo === 1;

                return (
                  <Fragment
                    key={`inning-${ball.inningNo}-del-${ball.deliveryNo}-over-${ball.overNo}-${ball.ballNo}-${idx}`}
                  >
                    {isInningBreak && (
                      <div className="my-4 mx-2.5 sm:mx-4 md:mx-6 min-[1200px]:mx-8 py-3 px-4 rounded-xl bg-slate-100 border border-slate-200 text-center flex items-center justify-center gap-3">
                        <div className="h-px bg-slate-300 flex-1" />
                        <span className="text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-widest">
                          End of 1st Innings
                        </span>
                        <div className="h-px bg-slate-300 flex-1" />
                      </div>
                    )}

                    {overSummary && (
                      <OverSummaryCard
                        summary={overSummary}
                        overBalls={overBalls}
                      />
                    )}

                    <div className="flex items-start gap-3 sm:gap-4 min-[900px]:gap-6 py-2.5 px-3 md:px-5 min-[1200px]:px-8! text-xs sm:text-sm text-slate-800 transition hover:bg-slate-50/50">
                      <div className="flex flex-col mt-1 items-center shrink-0 w-10 sm:w-12 min-[1200px]:w-14">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900">
                          {overLabel}
                        </span>

                        <div
                          className={`mt-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border text-[11px] sm:text-xs font-semibold shadow-xs transition-all ${badge.color}`}
                        >
                          {badge.label}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5 text-xs sm:text-sm leading-relaxed">
                        {renderCommentaryText(ball.commentaryText)}
                      </div>
                    </div>

                    {bowlerIntro && <BowlerIntroCard intro={bowlerIntro} />}
                    {batterIntros?.map((batterIntro) => (
                      <BatterIntroCard
                        key={`batter-${batterIntro.slug}-${ball.inningNo}-${ball.deliveryNo}`}
                        intro={batterIntro}
                      />
                    ))}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Commentary;
