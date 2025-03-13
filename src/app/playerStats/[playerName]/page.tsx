"use client";

import { useEffect, useState } from "react";

interface PlayerStats {
  name: string;
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
    return (
      <div className="container w-[90%] md:w-1/2 mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
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
    <div className="container w-[90%] md:w-1/2 mx-auto px-4 py-8">
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
                    {tournamentStats.stats.wins}V -{" "}
                    {tournamentStats.stats.draws}E -{" "}
                    {tournamentStats.stats.losses}D
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
