"use client";

import { useState } from "react";
import Link from "next/link";

import PasswordModal from "./components/PasswordModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B2818] p-4">
      <div className="max-w-7xl mx-auto rounded-lg p-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Torneo de Fútbol
          </h1>
          <p className="text-green-100 text-lg mb-8">Clausura 2025</p>

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

            <button
              onClick={() => setIsModalOpen(true)}
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
                  <p className="text-green-100 text-sm">Gestionar jugadores</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
