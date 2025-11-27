"use client";

import { useState, useRef, useEffect } from "react";
import { PlayerWithStats } from "@/app/constants/types";

type PlayerAutocompleteProps = {
  players: PlayerWithStats[];
  selectedPlayerId?: string;
  onPlayerSelect: (playerId: string) => void;
  isPlayerAvailable: (playerId: string) => boolean;
  placeholder?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  optionBgColor?: string;
  userIsAdmin?: boolean;
  teamType?: string;
};

export default function PlayerAutocomplete({
  players,
  selectedPlayerId,
  onPlayerSelect,
  isPlayerAvailable,
  placeholder = "Buscar jugador...",
  className = "",
  bgColor = "bg-white",
  textColor = "text-gray-600",
  borderColor = "border-gray-300",
  optionBgColor = "#f9fafb",
  userIsAdmin = false,
  teamType = "",
}: PlayerAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Get the currently selected player
  const selectedPlayer = players.find(
    (p) => p._id.toString() === selectedPlayerId
  );

  // Filter players based on search term and availability
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isAvailable = isPlayerAvailable(player._id.toString());
    return matchesSearch && isAvailable;
  });

  // Reset highlighted index when filtered players change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredPlayers]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredPlayers.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredPlayers[highlightedIndex]) {
            handlePlayerSelect(filteredPlayers[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, highlightedIndex, filteredPlayers]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const handlePlayerSelect = (player: PlayerWithStats) => {
    onPlayerSelect(player._id.toString());
    setSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    // If input is cleared and we had a selected player, clear the selection
    if (value === "" && selectedPlayerId) {
      onPlayerSelect("");
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Capture the current target before the async operation
    const currentTarget = e.currentTarget;

    // Delay closing to allow clicking on options
    setTimeout(() => {
      if (currentTarget && !currentTarget.contains(document.activeElement)) {
        setIsOpen(false);
        // Reset search term if nothing was selected
        if (!selectedPlayer) {
          setSearchTerm("");
        }
      }
    }, 150);
  };

  // Display value: show selected player name or search term
  const displayValue =
    selectedPlayer && !isOpen ? selectedPlayer.name : searchTerm;

  return (
    <div
      className={`relative w-full flex items-center gap-2 ${className}`}
      onBlur={handleInputBlur}
    >
      {userIsAdmin &&
        selectedPlayer?.nivel !== null &&
        selectedPlayer?.nivel !== undefined && (
          <div
            className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
              teamType === "oscuras"
                ? "bg-red-600 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {selectedPlayer.nivel}
          </div>
        )}
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={selectedPlayer ? selectedPlayer.name : placeholder}
        className={`w-full px-2 py-1 ${bgColor} border ${borderColor} rounded ${textColor} cursor-text focus:outline-none focus:ring-1 focus:ring-blue-500`}
        autoComplete="off"
      />

      {isOpen && (
        <ul
          ref={listRef}
          className={`absolute z-50 w-full mt-1 max-h-40 overflow-y-auto border ${borderColor} rounded shadow-lg`}
          style={{ backgroundColor: optionBgColor }}
        >
          {filteredPlayers.length === 0 ? (
            <li className={`px-2 py-1 ${textColor} italic`}>
              {searchTerm
                ? "No se encontraron jugadores"
                : "Escribe para buscar jugadores"}
            </li>
          ) : (
            filteredPlayers.map((player, index) => (
              <li
                key={player._id.toString()}
                className={`px-2 py-1 cursor-pointer ${textColor} hover:bg-blue-100 ${
                  index === highlightedIndex ? "bg-blue-100" : ""
                } flex items-center gap-2`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur
                  handlePlayerSelect(player);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span>{player.name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
