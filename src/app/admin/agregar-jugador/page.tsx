"use client";
import { useState } from "react";

export default function AgregarJugador() {
  const [playerName, setPlayerName] = useState("");
  const [playerImage, setPlayerImage] = useState("");
  const [playerFavoriteTeam, setPlayerFavoriteTeam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName,
          playerFavoriteTeam,
          playerImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating player");
      }

      setMessage("Jugador agregado exitosamente");
      setPlayerName("");
      setPlayerImage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error creating player"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Agregar Jugador
        </h2>
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="playerName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Jugador
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              placeholder="Ingresa el nombre del jugador"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="playerFavoriteTeam"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Equipo Favorito
            </label>
            <input
              type="text"
              id="playerFavoriteTeam"
              value={playerFavoriteTeam}
              onChange={(e) => setPlayerFavoriteTeam(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              placeholder="Club de futbol"
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="playerImage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL de la Imagen
            </label>
            <input
              type="url"
              id="playerImage"
              value={playerImage}
              onChange={(e) => setPlayerImage(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              placeholder="https://ejemplo.com/imagen.jpg"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Agregando..." : "Agregar Jugador"}
          </button>
        </form>
      </div>
    </div>
  );
}
