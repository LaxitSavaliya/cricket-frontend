"use client";

import { useMatch } from "@/features/matches";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface MatchDetailsProps {
  children: ReactNode;
}

const tabs = [
  { name: "Info", path: "" },
  // { name: "Live", path: "live" },
  { name: "Commentary", path: "commentary" },
  { name: "Scorecard", path: "scorecard" },
  { name: "Summary", path: "summary" },
  { name: "Team Squads", path: "team-squads" },
];

export default function MatchDetails({ children }: MatchDetailsProps) {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();
  const { data: match } = useMatch(slug);

  const homeShort = match?.homeTeam?.shortName || "SLA";
  const awayShort = match?.awayTeam?.shortName || "AFGA";
  const matchTitle = match?.title || "6th ODI Match";

  return (
    <main className="min-h-dvh flex flex-col bg-slate-50">
      {/* Reference UI Top Header */}
      <div className="bg-white border-b border-slate-200 shrink-0 sticky top-0 z-20">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <Link
            href="/matches"
            className="p-1 hover:bg-slate-100 rounded-full transition outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-slate-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight uppercase">
              {homeShort} vs {awayShort}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              {matchTitle}
            </p>
          </div>
          <button
            title="More Options"
            className="p-1 hover:bg-slate-100 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-slate-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </button>
        </div>

        {/* Mobile & Tablet Tabs Layout (< 900px) */}
        <div className="flex min-[900px]:hidden px-4 max-w-4xl mx-auto justify-between overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            // Match pathname exactly or check sub-route
            const isActive =
              tab.path === ""
                ? pathname === `/matches/${slug}` ||
                  pathname === `/matches/${slug}/`
                : pathname.includes(tab.path);
            return (
              <Link
                key={tab.name}
                href={`/matches/${slug}/${tab.path}`}
                ref={(el) => {
                  if (isActive && el) {
                    el.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center",
                    });
                  }
                }}
                className={`text-sm font-semibold whitespace-nowrap pb-2.5 pt-2 relative transition-all duration-300 outline-none px-5 shrink-0 ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Tabs Layout (>= 900px) */}
      <div className="mx-auto mt-6 hidden shrink-0 w-full max-w-190 min-[1200px]:max-w-5xl items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-1.5 min-[1200px]:p-2 shadow-sm min-[900px]:flex min-[1000px]:max-w-3xl">
        {tabs.map((tab) => {
          const href = `/matches/${slug}/${tab.path}`;
          const isActive =
            tab.path === ""
              ? pathname === `/matches/${slug}` ||
                pathname === `/matches/${slug}/`
              : pathname.includes(tab.path);

          return (
            <Link
              key={tab.name}
              href={href}
              className={`flex-1 text-center whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold capitalize tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      <section className="flex-1 flex flex-col w-full max-w-4xl min-[1200px]:max-w-6xl mx-auto px-4 py-6 pb-12 sm:px-6 lg:px-8">
        <div className="flex-1 flex flex-col">{children}</div>
      </section>
    </main>
  );
}
