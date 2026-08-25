"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type KeyboardEvent, type UIEvent } from "react";

import { MatchCard, useMatches } from "@/features/matches";

export default function MatchesPage() {
  const { data: matches = [], isLoading, isError, error } = useMatches();

  const router = useRouter();

  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const matchCarouselRef = useRef<HTMLDivElement>(null);

  const clampedActiveMatchIndex =
    matches.length === 0 ? 0 : Math.min(activeMatchIndex, matches.length - 1);

  if (activeMatchIndex !== clampedActiveMatchIndex) {
    setActiveMatchIndex(clampedActiveMatchIndex);
  }

  const getMatchCardElements = (
    carouselElement: HTMLDivElement,
  ): HTMLElement[] => {
    return Array.from(carouselElement.children) as HTMLElement[];
  };

  const handleCarouselScroll = (event: UIEvent<HTMLDivElement>) => {
    const carouselElement = event.currentTarget;
    const matchCardElements = getMatchCardElements(carouselElement);

    if (matchCardElements.length === 0) {
      return;
    }

    const carouselBounds = carouselElement.getBoundingClientRect();
    const carouselCenter =
      carouselBounds.left + carouselElement.clientWidth / 2;

    let closestMatchIndex = 0;
    let shortestDistance = Number.POSITIVE_INFINITY;

    matchCardElements.forEach((matchCardElement, matchIndex) => {
      const matchCardBounds = matchCardElement.getBoundingClientRect();
      const matchCardCenter = matchCardBounds.left + matchCardBounds.width / 2;

      const distanceFromCenter = Math.abs(matchCardCenter - carouselCenter);

      if (distanceFromCenter < shortestDistance) {
        shortestDistance = distanceFromCenter;
        closestMatchIndex = matchIndex;
      }
    });

    setActiveMatchIndex((currentIndex) =>
      currentIndex === closestMatchIndex ? currentIndex : closestMatchIndex,
    );
  };

  const scrollToMatchCard = (matchIndex: number) => {
    const carouselElement = matchCarouselRef.current;

    if (!carouselElement) {
      return;
    }

    const matchCardElements = getMatchCardElements(carouselElement);
    const selectedMatchCard = matchCardElements[matchIndex];

    if (!selectedMatchCard) {
      return;
    }

    const selectedCardWidth = selectedMatchCard.getBoundingClientRect().width;

    const carouselWidth = carouselElement.getBoundingClientRect().width;

    const targetScrollPosition =
      selectedMatchCard.offsetLeft - (carouselWidth - selectedCardWidth) / 2;

    carouselElement.scrollTo({
      left: targetScrollPosition,
      behavior: "smooth",
    });

    setActiveMatchIndex(matchIndex);
  };

  const handleMatchCardSelection = (matchIndex: number, matchSlug: string) => {
    const isSelectedMatch = matchIndex === clampedActiveMatchIndex;

    if (isSelectedMatch) {
      router.push(`/matches/${matchSlug}`);
      return;
    }

    scrollToMatchCard(matchIndex);
  };

  const handleMatchCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    matchIndex: number,
    matchSlug: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleMatchCardSelection(matchIndex, matchSlug);
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
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600"
          >
            {error?.message || "Unable to load matches."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-2 pb-4 sm:pt-6 sm:pb-12 overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          `,
        }}
      />

      <div className="w-full relative">
        {matches.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 max-w-5xl mx-auto">
            No matches found.
          </div>
        ) : (
          <div className="relative max-w-[1600px] mx-auto">
            <div
              ref={matchCarouselRef}
              onScroll={handleCarouselScroll}
              className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-4 pb-2 sm:pt-6 sm:pb-3 md:pt-10 md:pb-4 scrollbar-none pl-[calc(50%-156px)] pr-[calc(50%-156px)] min-[375px]:pl-[calc(50%-175px)] min-[375px]:pr-[calc(50%-175px)] min-[450px]:pl-[calc(50%-190px)] min-[450px]:pr-[calc(50%-190px)] min-[550px]:pl-[calc(50%-205px)] min-[550px]:pr-[calc(50%-205px)] sm:pl-[calc(50%-230px)] sm:pr-[calc(50%-230px)] md:pl-[calc(50%-270px)] md:pr-[calc(50%-270px)] lg:pl-[calc(50%-310px)] lg:pr-[calc(50%-310px)] xl:pl-[calc(50%-350px)] xl:pr-[calc(50%-350px)] 2xl:pl-[calc(50%-384px)] 2xl:pr-[calc(50%-384px)]"
            >
              {matches.map((match, matchIndex) => {
                const isActiveMatch = matchIndex === clampedActiveMatchIndex;

                return (
                  <div
                    key={match.id}
                    role="button"
                    tabIndex={0}
                    aria-current={isActiveMatch ? "true" : undefined}
                    aria-label={`View ${match.title}`}
                    onClick={() =>
                      handleMatchCardSelection(matchIndex, match.slug)
                    }
                    onKeyDown={(event) =>
                      handleMatchCardKeyDown(event, matchIndex, match.slug)
                    }
                    className={`transition-all duration-500 ease-out snap-center cursor-pointer shrink-0 w-78 min-[375px]:w-87.5 min-[450px]:w-95 min-[550px]:w-102.5 sm:w-115 md:w-135 lg:w-155 xl:w-175 2xl:w-3xl rounded-2xl
                      ${
                        isActiveMatch
                          ? "scale-100 opacity-100 sm:scale-105 z-10 shadow-md"
                          : "scale-90 opacity-40 sm:scale-95 sm:opacity-50 z-0"
                      }
                    `}
                  >
                    <MatchCard
                      match={match}
                      onViewDetails={() =>
                        router.push(`/matches/${match.slug}`)
                      }
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-2 mt-2 sm:mt-4">
              {matches.map((match, matchIndex) => (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => scrollToMatchCard(matchIndex)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    matchIndex === clampedActiveMatchIndex
                      ? "w-8 bg-indigo-600"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to match ${matchIndex + 1}`}
                  aria-current={
                    matchIndex === clampedActiveMatchIndex ? "true" : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
