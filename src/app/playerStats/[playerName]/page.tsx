"use client";

import Spinner from "@/app/components/spinner";
import {
  DEFAULT_PLAYER_IMAGE_1,
  TEAMS_IMAGES,
} from "@/app/constants/images/teams";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PlayerStats {
  player: {
    name: string;
    favoriteTeam: string;
    image: string;
  };
  tournaments: Array<{
    tournament: string;
    stats: {
      wins: number;
      draws: number;
      losses: number;
      goals: number;
      assists: number;
      points: number;
      percentage: number;
      position: number;
      mvp: number;
    };
  }>;
}

interface PlayerStatsResponse {
  playerProfile: PlayerStats;
  error?: string;
}

export default function PlayerStatsPage({
  params,
}: {
  params: { playerName: string };
}) {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/player/${params.playerName}`);
        const data: PlayerStatsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch player stats");
        }

        setPlayerStats(data.playerProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerStats();
  }, [params.playerName]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="container w-[90%] md:w-1/2 mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!playerStats) {
    return (
      <div className="container w-[90%] md:w-1/2 mx-auto px-4 py-8">
        <div className="text-center">No stats found for this player</div>
      </div>
    );
  }

  return (
    <div className="container w-[90%] md:w-1/2 mx-auto py-8 border-2 border-gray-300 rounded-lg px-8">
      <div className="flex justify-center mb-8">
        <Image
          src={playerStats?.player?.image || DEFAULT_PLAYER_IMAGE_1}
          alt={playerStats.player.name}
          className="w-24 h-24"
          width={96}
          height={96}
        />
      </div>
      <div className="text-center text-2xl font-bold mb-8">
        {playerStats.player.name}
        {playerStats?.player?.favoriteTeam && (
          <Image
            src={
              TEAMS_IMAGES[
                playerStats.player.favoriteTeam as keyof typeof TEAMS_IMAGES
              ]
            }
            alt={playerStats.player.favoriteTeam}
            width={24}
            height={24}
            className="inline-block w-8 h-8 ml-2"
          />
        )}
      </div>
      {playerStats.tournaments.map((tournamentStats, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {tournamentStats.tournament}
          </h2>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <table className="w-full bg-white dark:bg-gray-800">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Posición
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    #{tournamentStats.stats.position}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Partidos
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {tournamentStats.stats.wins +
                      tournamentStats.stats.draws +
                      tournamentStats.stats.losses}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Porcentaje de Victorias
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {tournamentStats.stats.percentage}%
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Registro
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {tournamentStats.stats.wins}
                    <span className="text-green-500 font-bold">V</span> -{" "}
                    {tournamentStats.stats.draws}
                    <span className="text-yellow-500 font-bold">E</span> -{" "}
                    {tournamentStats.stats.losses}
                    <span className="text-red-500 font-bold">D</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Goles
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {tournamentStats.stats.goals}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Asistencias
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {tournamentStats.stats.assists}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Puntos
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {tournamentStats.stats.points}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    Premios MVP
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {tournamentStats.stats.mvp}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
