"use client";

import { PlayerWithStats, SerializedMessage } from "../constants/types";
import BannerCarousel from "./BannerCarousel";
import Forum from "./Forum";
import { getBannerCarousel } from "../features/home/utils/banner";
import {
  AdminLink,
  MatchesLink,
  TableLink,
  MemesLink,
} from "../features/home/components/links";
import { useTournament } from "../contexts/TournamentContext";
import Spinner from "./spinner";

export default function HomePageContent({
  playersWithStats,
  pichichis,
  topPlayer,
  initialMessages,
}: {
  playersWithStats: PlayerWithStats[];
  pichichis: PlayerWithStats[];
  topPlayer: PlayerWithStats;
  initialMessages: SerializedMessage[];
}) {
  const { selectedTournamentData, isLoadingTournaments } = useTournament();
  const banners = getBannerCarousel(playersWithStats, pichichis, topPlayer);

  if (isLoadingTournaments) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-[#0B2818] px-4 py-2 sm:py-4">
      <div className="max-w-7xl mx-auto rounded-lg p-1">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-8">
            {selectedTournamentData?.tournament.name}
          </h1>

          {/* Banner Carousel */}
          <div className="w-full -mt-4 mb-12 flex justify-center">
            <BannerCarousel banners={banners} />
          </div>

          {/* Feature Cards */}
          {selectedTournamentData && (
            <div className="grid gap-4 max-w-md mx-auto">
              <TableLink />
              <MatchesLink />
              <AdminLink />
              <MemesLink />
            </div>
          )}
        </div>
      </div>
      <Forum initialMessages={initialMessages} />
    </div>
  );
}
