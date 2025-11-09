"use client";

import { createContext, useEffect, useReducer } from "react";
import { useContext } from "react";
import { MatchTeam, SerializedMatch } from "@/app/constants/types";
import { useMatchWithStats } from "@/app/contexts/MatchWithStatsContext";
import draftMatchReducer from "../reducers/draftMatchReducer";

type DraftMatchContextType = {
  draftMatch: SerializedMatch | null;
  updatePlayer: (team: MatchTeam, index: number, playerId: string) => void;
  removeLastPlayer: () => void;
  addNewPlayer: () => void;
  updateGoals: (team: MatchTeam, index: number, goals: number) => void;
  movePlayer: (team: MatchTeam, fromIndex: number, toIndex: number) => void;
  isPlayerAvailable: (
    playerId: string,
    team: "oscuras" | "claras",
    currentIndex: number
  ) => boolean;
  error: string | null;
  success: string | null;
};

const DraftMatchContext = createContext<DraftMatchContextType>({
  draftMatch: null,
  updatePlayer: () => {},
  removeLastPlayer: () => {},
  addNewPlayer: () => {},
  updateGoals: () => {},
  movePlayer: () => {},
  isPlayerAvailable: () => false,
  error: null,
  success: null,
});

export default function DraftMatchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { match } = useMatchWithStats();
  const [state, dispatch] = useReducer(draftMatchReducer, {
    draftMatch: null,
    error: null,
    success: null,
  });

  useEffect(() => {
    if (match) {
      dispatch({ type: "INITIALIZE_MATCH", payload: { match } });
    }
  }, [match]);

  const updatePlayer = (team: MatchTeam, index: number, playerId: string) => {
    dispatch({ type: "UPDATE_PLAYER", payload: { team, index, playerId } });
  };

  const updateGoals = (team: MatchTeam, index: number, goals: number) => {
    dispatch({ type: "UPDATE_PLAYER_GOALS", payload: { team, index, goals } });
  };

  const removeLastPlayer = () => {
    dispatch({ type: "REMOVE_LAST_PLAYER" });
  };

  const addNewPlayer = () => {
    dispatch({ type: "ADD_NEW_PLAYER" });
  };

  const movePlayer = (team: MatchTeam, fromIndex: number, toIndex: number) => {
    dispatch({ type: "MOVE_PLAYER", payload: { team, fromIndex, toIndex } });
  };

  const isPlayerAvailable = (
    playerId: string,
    team: "oscuras" | "claras",
    currentIndex: number
  ) => {
    if (!state.draftMatch) return false;

    const isInOscuras = state.draftMatch.oscuras.players.some(
      (p, i) =>
        p._id === playerId && i !== (team === "oscuras" ? currentIndex : -1)
    );
    const isInClaras = state.draftMatch.claras.players.some(
      (p, i) =>
        p._id === playerId && i !== (team === "claras" ? currentIndex : -1)
    );

    return !isInOscuras && !isInClaras;
  };

  return (
    <DraftMatchContext.Provider
      value={{
        draftMatch: state.draftMatch,
        updatePlayer,
        removeLastPlayer,
        addNewPlayer,
        updateGoals,
        movePlayer,
        isPlayerAvailable,
        error: state.error,
        success: state.success,
      }}
    >
      {children}
    </DraftMatchContext.Provider>
  );
}

function useDraftMatch() {
  const context = useContext(DraftMatchContext);
  if (!context) {
    throw new Error("useDraftMatch must be used within a DraftMatchProvider");
  }
  return context;
}

export { useDraftMatch };
