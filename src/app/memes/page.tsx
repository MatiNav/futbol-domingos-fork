"use client";

import { useState, useEffect } from "react";
import { useTournament } from "@/app/contexts/TournamentContext";
import {
  TEAMS_IMAGES,
  BACKGROUND_IMAGES,
  RANDOM_IMAGES,
  MEMES,
} from "@/app/constants/images/teams";

function toCamelCaseKey(name?: string) {
  if (!name) return "";
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((w, i) =>
      i === 0
        ? w.charAt(0).toLowerCase() + w.slice(1)
        : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join("");
}

export default function MemesPage() {
  const { selectedTournamentData, isLoadingTournaments } = useTournament();

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveImage(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (isLoadingTournaments) return <div className="p-8">Cargando...</div>;

  const key = toCamelCaseKey(selectedTournamentData?.tournament.name);

  // show images from MEMES variable
  const images = Array.isArray(MEMES) ? MEMES : [];

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-2xl font-semibold mb-4">Memes</h1>
          <p>No image found for the selected tournament.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Memes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="rounded overflow-hidden bg-white/5 p-2 cursor-pointer"
              onClick={() => setActiveImage(src)}
            >
              <img
                src={src}
                alt={`meme-${idx}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>

        {activeImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setActiveImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="max-w-[90%] max-h-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage}
                alt="active-meme"
                className="w-full h-auto max-h-[90vh] object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
