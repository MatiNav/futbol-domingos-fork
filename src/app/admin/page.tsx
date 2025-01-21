'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Masterchef') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Acceso Administrativo
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
                  placeholder="Ingresa la contraseña"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid gap-4 max-w-md mx-auto">
        <Link
          href="/admin/agregar-jugador"
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-gray-50 transition-all bg-white"
        >
          <div className="text-xl font-semibold text-gray-800">Agregar Jugador</div>
        </Link>
        <Link
          href="/admin/armar-equipos"
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-gray-50 transition-all bg-white"
        >
          <div className="text-xl font-semibold text-gray-800">Armar Equipos</div>
        </Link>
        <Link
          href="/admin/editar-equipos"
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-gray-50 transition-all bg-white"
        >
          <div className="text-xl font-semibold text-gray-800">Editar Equipos</div>
        </Link>
      </div>
    </div>
  );
} 