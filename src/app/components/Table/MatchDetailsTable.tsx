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
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center">
              Goles
            </th>
            <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center bg-red-300">
              Oscuras
            </th>
            <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center bg-blue-300">
              Claras
            </th>
            <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center">
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
            <tr key={index} className="border-t">
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
