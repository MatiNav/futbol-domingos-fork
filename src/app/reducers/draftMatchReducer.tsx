"use client";

import { MatchTeam, SerializedMatch } from "@/app/constants/types";
type DraftMatchAction =
  | { type: "INITIALIZE_MATCH"; payload: { match: SerializedMatch } }
  | {
      type: "UPDATE_PLAYER";
      payload: { team: MatchTeam; index: number; playerId: string };
    }
  | {
      type: "UPDATE_PLAYER_GOALS";
      payload: { team: MatchTeam; index: number; goals: number };
    }
  | { type: "REMOVE_LAST_PLAYER" }
  | { type: "ADD_NEW_PLAYER" }
  | {
      type: "MOVE_PLAYER";
      payload: { team: MatchTeam; fromIndex: number; toIndex: number };
    };

type DraftMatchState = {
  draftMatch: SerializedMatch | null;
  error: string | null;
  success: string | null;
};

export default function draftMatchReducer(
  state: DraftMatchState,
  action: DraftMatchAction
) {
  const { draftMatch } = state;

  switch (action.type) {
    case "INITIALIZE_MATCH": {
      return {
        ...state,
        draftMatch: action.payload.match,
      };
    }
    case "UPDATE_PLAYER": {
      const { team, index, playerId } = action.payload;

      if (!draftMatch) return { ...state };

      const newDraftMatch = {
        ...draftMatch,
        [team]: {
          ...draftMatch[team],
          players: draftMatch[team].players.map((player, i) =>
            i === index && !!playerId
              ? {
                  _id: action.payload.playerId,
                  goals: 0,
                }
              : player
          ),
        },
      };
      return {
        ...state,
        draftMatch: newDraftMatch,
        error: null,
        success: null,
      };
    }
    case "UPDATE_PLAYER_GOALS": {
      const { team, index, goals } = action.payload;

      if (!draftMatch) return { ...state };
      const newDraftMatch = {
        ...draftMatch,
        [team]: {
          ...draftMatch[team],
          players: draftMatch[team].players.map((player, i) =>
            i === index ? { ...player, goals } : player
          ),
        },
      };
      return {
        ...state,
        draftMatch: newDraftMatch,
        error: null,
        success: null,
      };
    }
    case "REMOVE_LAST_PLAYER": {
      if (!draftMatch) return { ...state };
      const newDraftMatch = {
        ...draftMatch,
        oscuras: {
          ...draftMatch.oscuras,
          players: draftMatch.oscuras.players.slice(0, -1),
        },
        claras: {
          ...draftMatch.claras,
          players: draftMatch.claras.players.slice(0, -1),
        },
      };

      return {
        ...state,
        draftMatch: newDraftMatch,
        error: null,
        success: "Jugadores eliminados correctamente",
      };
    }
    case "ADD_NEW_PLAYER": {
      if (!draftMatch) return { ...state };
      const newDraftMatch = {
        ...draftMatch,
        oscuras: {
          ...draftMatch.oscuras,
          players: [...draftMatch.oscuras.players, { _id: "", goals: 0 }],
        },
        claras: {
          ...draftMatch.claras,
          players: [...draftMatch.claras.players, { _id: "", goals: 0 }],
        },
      };

      return {
        ...state,
        draftMatch: newDraftMatch,
        error: null,
        success: "Jugadores agregados correctamente",
      };
    }
    case "MOVE_PLAYER": {
      const { team, fromIndex, toIndex } = action.payload;

      if (!draftMatch) return { ...state };

      const players = [...draftMatch[team].players];
      const [movedPlayer] = players.splice(fromIndex, 1);
      players.splice(toIndex, 0, movedPlayer);

      const newDraftMatch = {
        ...draftMatch,
        [team]: {
          ...draftMatch[team],
          players,
        },
      };

      return {
        ...state,
        draftMatch: newDraftMatch,
        error: null,
        success: null,
      };
    }
    default: {
      return state;
    }
  }
}
