"use client";

import { useState } from "react";
import {
  SerializedMatch,
  UserProfileWithPlayerId,
} from "@/app/constants/types";
import { useTournament } from "@/app/contexts/TournamentContext";

type MatchOpinionsProps = {
  match: SerializedMatch;
  isLatestMatch: boolean;
  hasUserPlayedMatch: boolean;
  onOpinionSubmitted: () => void;
  user: UserProfileWithPlayerId | null;
};

export default function MatchOpinions({
  match,
  isLatestMatch,
  hasUserPlayedMatch,
  onOpinionSubmitted,
  user,
}: MatchOpinionsProps) {
  const { selectedTournament } = useTournament();
  const [opinion, setOpinion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingOpinionId, setEditingOpinionId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const hasUserSubmittedOpinion = match.opinions?.some(
    (opinion) => opinion.userId === user?.playerId.toString()
  );

  const handleSubmit = async () => {
    if (!selectedTournament?.finished) setError("El torneo ha finalizado");
    if (!user || !opinion.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/matches/${match.matchNumber}/opinion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: opinion.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit opinion");
      }

      setOpinion("");
      onOpinionSubmitted();
    } catch (error) {
      console.error(error);
      setError("Error submitting opinion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (opinionId: string) => {
    if (!user) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/matches/${match.matchNumber}/opinion/${opinionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedContent.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update opinion");
      }

      setEditingOpinionId(null);
      setEditedContent("");
      onOpinionSubmitted();
    } catch (error) {
      console.error(error);
      setError("Error updating opinion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (opinionId: string) => {
    if (
      !user ||
      !window.confirm("¿Estás seguro de que quieres eliminar esta opinión?")
    )
      return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/matches/${match.matchNumber}/opinion/${opinionId}?tournamentId=${match.tournamentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete opinion");
      }

      onOpinionSubmitted();
    } catch (error) {
      console.error(error);
      setError("Error deleting opinion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-[#1a472a] rounded-lg space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      <h3 className="text-xl font-semibold text-white">
        Opiniones del Partido
      </h3>

      {isLatestMatch &&
        hasUserPlayedMatch &&
        !hasUserSubmittedOpinion &&
        !editingOpinionId && (
          <div className="space-y-4">
            <textarea
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              placeholder="Comparte tu opinión sobre el partido..."
              className="w-full p-3 bg-[#2a573a] text-white rounded-lg resize-none"
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-red-400">{error}</span>
              <span
                className={`${
                  opinion.length > 900 ? "text-yellow-400" : "text-green-300"
                }`}
              >
                {opinion.length}/1000
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!opinion.trim() || isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar Opinión"}
            </button>
          </div>
        )}

      <div className="space-y-4">
        {match.opinions?.map((opinion) => (
          <div
            key={opinion._id.toString()}
            className="p-4 bg-[#2a573a] rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-medium">{opinion.userName}</span>
              <span className="text-green-300 text-sm">
                {new Date(opinion.createdAt).toLocaleDateString()}
              </span>
            </div>

            {editingOpinionId === opinion._id.toString() ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-3 bg-[#1a472a] text-white rounded-lg resize-none"
                  rows={4}
                  maxLength={1000}
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-red-400">{error}</span>
                  <span
                    className={`${
                      editedContent.length > 900
                        ? "text-yellow-400"
                        : "text-green-300"
                    }`}
                  >
                    {editedContent.length}/1000
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingOpinionId(null);
                      setEditedContent("");
                      setError("");
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleEdit(opinion._id.toString())}
                    disabled={!editedContent.trim() || isSubmitting}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-green-100">{opinion.content}</p>
                {user?.playerId === opinion.userId && (
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingOpinionId(opinion._id.toString());
                        setEditedContent(opinion.content);
                        setError("");
                      }}
                      className="text-green-300 hover:text-green-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(opinion._id.toString())}
                      className="text-red-300 hover:text-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
