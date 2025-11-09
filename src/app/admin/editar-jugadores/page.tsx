"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SerializedPlayer } from "@/app/constants/types/Player";
import {
  TEAMS_IMAGES,
  DEFAULT_PLAYER_IMAGE_1,
  DEFAULT_PLAYER_IMAGE_2,
} from "@/app/constants/images/teams";

export default function EditarJugadoresPage() {
  const [players, setPlayers] = useState<SerializedPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<SerializedPlayer | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    favoriteTeam: "",
    image: "",
    role: "user" as "admin" | "user",
  });

  // Filtered players based on search
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Helper function to get player image with fallbacks
  const getPlayerImageSrc = (player: SerializedPlayer, index: number = 0) => {
    return (
      player.image ||
      (player.favoriteTeam
        ? TEAMS_IMAGES[player.favoriteTeam as keyof typeof TEAMS_IMAGES]
        : null) ||
      (index % 2 === 0 ? DEFAULT_PLAYER_IMAGE_1 : DEFAULT_PLAYER_IMAGE_2)
    );
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      const data = await response.json();

      if (response.ok && data.players && Array.isArray(data.players)) {
        setPlayers(data.players);
      } else {
        console.error("Error in API response:", data);
        setMessage(data.error || "Error al cargar los jugadores");
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setMessage("Error al cargar los jugadores");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelect = (player: SerializedPlayer) => {
    // Clear form data first
    setFormData({
      name: "",
      email: "",
      favoriteTeam: "",
      image: "",
      role: "user",
    });

    setSelectedPlayer(player);

    // Then populate with new player data
    setFormData({
      name: player.name || "",
      email: player.email || "",
      favoriteTeam: player.favoriteTeam || "",
      image: player.image || "",
      role: player.role || "user",
    });
    setMessage("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/players/${selectedPlayer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Jugador actualizado exitosamente");
        await fetchPlayers(); // Refresh the players list

        // Update the selected player data
        const updatedPlayer = { ...selectedPlayer, ...formData };
        setSelectedPlayer(updatedPlayer);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al actualizar el jugador");
      }
    } catch (error) {
      console.error("Error updating player:", error);
      setMessage("Error al actualizar el jugador");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B2818] flex items-center justify-center">
        <div className="text-white text-xl">Cargando jugadores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B2818] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white italic">
            Editar Jugadores
          </h1>
          <Link
            href="/admin"
            className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all"
          >
            ← Volver al Admin
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Players List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Seleccionar Jugador
            </h2>

            {/* Search Filter */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar jugador por nombre..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="text-green-100 text-sm mb-4">
              {searchFilter ? (
                <>
                  {filteredPlayers.length} de {players.length} jugadores
                  {searchFilter && ` (filtrado por "${searchFilter}")`}
                </>
              ) : (
                <>
                  Total: {Array.isArray(players) ? players.length : 0} jugadores
                </>
              )}
              {loading && " (Cargando...)"}
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[28rem]">
              {Array.isArray(filteredPlayers) && filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <button
                    key={player._id}
                    onClick={() => handlePlayerSelect(player)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedPlayer?._id === player._id
                        ? "bg-green-500/30 border border-green-500"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={getPlayerImageSrc(player, index)}
                        alt={player.name}
                        className={`w-10 h-10 object-contain ${
                          player.image ? "rounded-full" : "rounded-lg"
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            index % 2 === 0
                              ? DEFAULT_PLAYER_IMAGE_1
                              : DEFAULT_PLAYER_IMAGE_2;
                        }}
                      />
                      <div>
                        <div className="text-white font-medium">
                          {player.name}
                        </div>
                        <div className="text-green-100 text-sm">
                          {player.email || "Sin email"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-green-100 text-center py-8">
                  {loading
                    ? "Cargando jugadores..."
                    : searchFilter
                    ? `No se encontraron jugadores que coincidan con "${searchFilter}"`
                    : `No hay jugadores disponibles (${players.length} jugadores cargados)`}
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Editar Información
            </h2>

            {!selectedPlayer ? (
              <div className="text-green-100 text-center py-8">
                Selecciona un jugador para editar su información
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Equipo Favorito
                  </label>
                  <select
                    name="favoriteTeam"
                    value={formData.favoriteTeam}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="" className="bg-gray-800">
                      Seleccionar equipo
                    </option>
                    {Object.entries(TEAMS_IMAGES).map(([key]) => (
                      <option key={key} value={key} className="bg-gray-800">
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

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    URL de Imagen (opcional)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Dejar vacío para usar imagen del equipo"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="user" className="bg-gray-800">
                      Usuario
                    </option>
                    <option value="admin" className="bg-gray-800">
                      Administrador
                    </option>
                  </select>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Vista previa
                  </label>
                  <img
                    src={
                      formData.image ||
                      (formData.favoriteTeam
                        ? TEAMS_IMAGES[
                            formData.favoriteTeam as keyof typeof TEAMS_IMAGES
                          ]
                        : null) ||
                      DEFAULT_PLAYER_IMAGE_1
                    }
                    alt="Vista previa"
                    className={`w-20 h-20 object-contain ${
                      formData.image ? "rounded-full" : "rounded-lg"
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        DEFAULT_PLAYER_IMAGE_1;
                    }}
                  />
                  <div className="text-green-100 text-xs mt-1">
                    {formData.image
                      ? "Imagen personalizada"
                      : formData.favoriteTeam &&
                        TEAMS_IMAGES[
                          formData.favoriteTeam as keyof typeof TEAMS_IMAGES
                        ]
                      ? "Imagen del equipo favorito"
                      : "Imagen por defecto"}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  {saving ? "Guardando..." : "Actualizar Jugador"}
                </button>
              </form>
            )}

            {message && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  message.includes("exitosamente")
                    ? "bg-green-500/20 text-green-200"
                    : "bg-red-500/20 text-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
