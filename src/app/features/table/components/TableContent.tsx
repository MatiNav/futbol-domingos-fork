"use client";

import Image from "next/image";
import { TEAMS_IMAGES } from "@/app/constants/images/teams";
import { PlayerWithStats } from "@/app/constants/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_PLAYER_IMAGE_1,
  DEFAULT_PLAYER_IMAGE_2,
} from "@/app/constants/images/teams";

export default function TableContent({
  pichichis,
  playersWithStats,
}: {
  pichichis: PlayerWithStats[];
  playersWithStats: PlayerWithStats[];
}) {
  const [profileImagesSignedUrls, setProfileImagesSignedUrls] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchProfileImagesSignedUrls = async () => {
      const response = await fetch("/api/players/images/all");
      const data = await response.json();
      setProfileImagesSignedUrls(data);
    };

    fetchProfileImagesSignedUrls();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B2818] p-4">
      <div className="max-w-7xl mx-auto bg-[#77777736] rounded-lg shadow-lg p-6 h-[calc(100vh-2rem)]">
        <div className="overflow-x-auto h-full">
          <div className="overflow-y-auto h-full">
            <table className="min-w-full relative">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#2b2b2b] text-white border-b border-gray-600">
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    Pos
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-left">
                    Jugador
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    Pts
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    MVP ⭐
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    GF
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    J
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    G
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    E
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    P
                  </th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-sm text-center">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {playersWithStats.map((player, index) => (
                  <tr
                    key={player._id}
                    className={`border-b border-gray-700 text-white ${
                      index % 2 === 0 ? "bg-[#3a3a3a]" : "bg-[#2d2d2d]"
                    } hover:bg-[#4a4a4a]`}
                  >
                    <td
                      className={`px-4 py-3 text-center ${
                        pichichis.some((p) => p._id === player._id)
                          ? "bg-yellow-500"
                          : index === 0
                          ? "bg-green-700"
                          : ""
                      }`}
                    >
                      {player.position}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-4 relative">
                          <Image
                            src={
                              // profileImagesSignedUrls[player.name] ||
                              player.image ||
                              TEAMS_IMAGES[
                                player.favoriteTeam as keyof typeof TEAMS_IMAGES
                              ] ||
                              (index % 2 === 0
                                ? DEFAULT_PLAYER_IMAGE_1
                                : DEFAULT_PLAYER_IMAGE_2)
                            }
                            alt={player.name}
                            width={40}
                            height={40}
                            className={`h-10 w-10 object-contain ${
                              // profileImagesSignedUrls[player.name] ||
                              player.image
                                ? "rounded-full"
                                : !player.image && player.favoriteTeam
                                ? ""
                                : "rounded-full"
                            }`}
                          />

                          {/* Team logo overlay - only shown when profile image exists */}
                          {
                            // (profileImagesSignedUrls[player.name] ||
                            player.image && player.favoriteTeam && (
                              <div className="absolute bottom-[-6px] right-[-6px] w-6 h-6 overflow-hidden">
                                <Image
                                  src={
                                    TEAMS_IMAGES[
                                      player.favoriteTeam as keyof typeof TEAMS_IMAGES
                                    ]
                                  }
                                  alt={`${player.favoriteTeam} logo`}
                                  width={20}
                                  height={20}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            )
                          }
                        </div>
                        <Link
                          href={`/playerStats/${player.name}`}
                          className="text-white"
                        >
                          {player.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center font-bold whitespace-nowrap">
                      {player.points}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <span className="ml-1">{player.mvp}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {player.goals}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {player.wins + player.draws + player.losses}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-green-400">
                      {player.wins}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-yellow-400">
                      {player.draws}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-red-400">
                      {player.losses}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {player.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
