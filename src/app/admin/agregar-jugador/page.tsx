'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AgregarJugador() {
  const [playerName, setPlayerName] = useState('');
  const [playerImage, setPlayerImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add player logic here
    console.log('Player added:', { playerName, playerImage });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Agregar Jugador
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
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
            />
          </div>
          <div>
            <label htmlFor="playerImage" className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen
            </label>
            <input
              type="url"
              id="playerImage"
              value={playerImage}
              onChange={(e) => setPlayerImage(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
          >
            Agregar Jugador
          </button>
        </form>
      </div>
    </div>
  );
} 