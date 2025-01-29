"use client";

import { useState } from "react";
import Link from "next/link";

import { IconContext } from "react-icons";
import { FaTable } from "react-icons/fa";
import { IoMdFootball } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import PasswordModal from "./components/PasswordModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800">
      {/* Hero Section */}
      <main className="p-6">
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
                <IconContext.Provider
                  value={{ color: "white", size: "1.4rem" }}
                >
                  <div className="bg-green-500 p-3 rounded-lg">
                    <FaTable />
                  </div>
                </IconContext.Provider>
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
                <IconContext.Provider
                  value={{ color: "white", size: "1.4rem" }}
                >
                  <div className="bg-green-500 p-3 rounded-lg">
                    <IoMdFootball />
                  </div>
                </IconContext.Provider>
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
                <IconContext.Provider
                  value={{ color: "white", size: "1.4rem" }}
                >
                  <div className="bg-green-500 p-3 rounded-lg">
                    <MdOutlineAdminPanelSettings />
                  </div>
                </IconContext.Provider>
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
      </main>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
