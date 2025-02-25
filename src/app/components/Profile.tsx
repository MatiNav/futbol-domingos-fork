"use client";

import { useState } from "react";
import { TeamOption } from "../constants/types/Common";
import { UserProfileWithPlayerId } from "../constants/types";
import Image from "next/image";
import { TEAMS_IMAGES } from "../constants/images/teams";
import UploadProfileImgButton from "../features/profile/components/UploadProfileImgButton";

export default function ProfileContent({
  user,
}: {
  user: UserProfileWithPlayerId;
}) {
  const [favoriteTeam, setFavoriteTeam] = useState<TeamOption | "">(
    user.favoriteTeam || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteTeam,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setMessage("Perfil actualizado correctamente!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error actualizando perfil"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2818] p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-8"> Perfil </h1>

        <div className="flex items-center mb-8">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "Profile"}
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
              {user.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-400 mb-2 cursor-not-allowed"
            >
              Nombre
            </label>
            <div className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 cursor-not-allowed select-none">
              {user.displayName}
            </div>
          </div>

          <div>
            <label
              htmlFor="favoriteTeam"
              className="block text-sm font-medium text-white mb-2"
            >
              Equipo favorito
            </label>
            <select
              id="favoriteTeam"
              value={favoriteTeam}
              onChange={(e) => setFavoriteTeam(e.target.value as TeamOption)}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="" className="bg-[#0B2818] text-white">
                Select a team
              </option>
              {Object.entries(TEAMS_IMAGES).map(([key]) => (
                <option
                  key={key}
                  value={key}
                  className="bg-[#0B2818] text-white"
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .charAt(0)
                    .toUpperCase() +
                    key
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .slice(1)}
                </option>
              ))}
            </select>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("Error") ? "bg-red-500/50" : "bg-green-500/50"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {isUpdating ? "Actualizando..." : "Actualizar Perfil"}
          </button>
        </form>
        {user.role === "admin" && <UploadProfileImgButton />}
      </div>
    </div>
  );
}
