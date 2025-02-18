"use client";

import Link from "next/link";
import {
  PlayerWithStats,
  SerializedMessage,
  UserProfileWithPlayerId,
} from "../constants/types";
import BannerCarousel from "./BannerCarousel";
import { RANDOM_IMAGES } from "../constants/images/teams";
import Forum from "./Forum";
import { isAdmin } from "../features/auth/utils/roles";

export default function HomePageContent({
  playersWithStats,
  pichichis,
  topPlayer,
  initialMessages,
  user,
}: {
  playersWithStats: PlayerWithStats[];
  pichichis: PlayerWithStats[];
  topPlayer: PlayerWithStats;
  initialMessages: SerializedMessage[];
  user: UserProfileWithPlayerId | null;
}) {
  const banners = getBannerCarousel(playersWithStats, pichichis, topPlayer);

  return (
    <div className="min-h-screen bg-[#0B2818] px-4 py-2 sm:py-4">
      <div className="max-w-7xl mx-auto rounded-lg p-1">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-8">
            Torneo Clausura 2025
          </h1>

          {/* Banner Carousel */}
          <div className="w-full -mt-4 mb-12">
            <BannerCarousel banners={banners} />
          </div>

          {/* Feature Cards */}
          <div className="grid gap-4 max-w-md mx-auto">
            <Link
              href="/table"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-500 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">
                    Tabla de Posiciones
                  </h2>
                  <p className="text-green-100 text-sm">
                    Ver estadísticas de jugadores
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/matches"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-500 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5M8 8v8m-4-5v5m0-5h18"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">Partidos</h2>
                  <p className="text-green-100 text-sm">Consultar resultados</p>
                </div>
              </div>
            </Link>

            {isAdmin(user) && (
              <Link
                href="/admin"
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-white">
                      Administración
                    </h2>
                    <p className="text-green-100 text-sm">
                      Gestionar jugadores
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Forum initialMessages={initialMessages} user={user} />
    </div>
  );
}

const getBannerCarousel = (
  players: PlayerWithStats[],
  pichichis: PlayerWithStats[],
  topPlayer: PlayerWithStats
) => {
  const ferPlayer = players.find((player) => player.name === "Fer");
  if (!ferPlayer) {
    throw new Error("Fer player not found");
  }
  const lastTournamentWinner = {
    title: "Campeón del 2024",
    player: ferPlayer,
    gradientFrom: "from-blue-900",
    gradientTo: "to-blue-600",
    image: RANDOM_IMAGES.ferCampeon,
    showGoals: false,
  };

  return [
    lastTournamentWinner,
    {
      title: "El Mejor Jugador",
      subtitle: "Liderando la tabla de posiciones",
      player: topPlayer,
      gradientFrom: "from-blue-900",
      gradientTo: "to-blue-600",
      showGoals: false,
    },
    ...(pichichis.length > 0
      ? [
          {
            title: "El Pichichi",
            player: pichichis[0],
            gradientFrom: "from-green-900",
            gradientTo: "to-green-600",
            showGoals: true,
          },
        ]
      : []),
  ];
};
