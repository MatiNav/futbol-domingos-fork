import { DBMatch, MatchTeam } from "@/app/constants/types/db-models/Match";
import { DBPlayer } from "@/app/constants/types/db-models/Player";
import { ObjectId } from "mongodb";
import TeamColumn from "../TeamColumn";

type MatchDetailsTableProps = {
  match: DBMatch;
  playersMap: { [key: string]: DBPlayer };
  isEditable?: boolean;
  onUpdatePlayerGoals?: (team: MatchTeam, index: number, goals: number) => void;
  onUpdatePlayer?: (team: MatchTeam, index: number, playerId: ObjectId) => void;
  players?: DBPlayer[];
  isPlayerAvailable?: (
    playerId: ObjectId,
    team: MatchTeam,
    currentIndex: number
  ) => boolean;
};

export default function MatchDetailsTable({
  match,
  playersMap,
  isEditable = false,
  onUpdatePlayerGoals,
  onUpdatePlayer,
  players = [],
  isPlayerAvailable,
}: MatchDetailsTableProps) {
  return (
    <div className="overflow-x-auto mt-6 mb-6">
      <table className="min-w-full bg-[#1a472a]">
        <thead>
          <tr>
            <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/4 text-center border-r border-green-700">
              Goles
            </th>
            <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/4 text-center bg-[#8B0000] border-r border-green-700">
              Oscuras
            </th>
            <th className="px-4 py-2 text-gray-700 font-bold uppercase tracking-wider text-sm w-1/4 text-center bg-[#93C5FD] border-r border-green-700">
              Claras
            </th>
            <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/4 text-center">
              Goles
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({
            length: Math.max(
              match.oscuras.players.length,
              match.claras.players.length
            ),
          }).map((_, index) => (
            <tr key={index} className="border-t border-green-700">
              <TeamColumn
                team="oscuras"
                index={index}
                match={match}
                playersMap={playersMap}
                isEditable={isEditable}
                onUpdatePlayerGoals={onUpdatePlayerGoals}
                onUpdatePlayer={onUpdatePlayer}
                players={players}
                isPlayerAvailable={isPlayerAvailable}
              />
              <TeamColumn
                team="claras"
                index={index}
                match={match}
                playersMap={playersMap}
                isEditable={isEditable}
                onUpdatePlayerGoals={onUpdatePlayerGoals}
                onUpdatePlayer={onUpdatePlayer}
                players={players}
                isPlayerAvailable={isPlayerAvailable}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
