import { ObjectId } from "mongodb";

export type Team = {
  players: MatchPlayer[];
  team: MatchTeam;
};

export type DBMatch = {
  _id: ObjectId;
  matchNumber: number;
  oscuras: Team;
  claras: Team;
  winner?: MatchResult;
  date: Date;
  playerOfTheMatchVotes?: MatchVote[];
};

export type MatchPlayer = {
  _id: ObjectId; // Player id
  goals: number;
};

export type MatchResult = "oscuras" | "claras" | "draw";

export type MatchTeam = "oscuras" | "claras";

export type MatchVote = {
  userId: string;
  playerVotedFor: ObjectId;
  userName: string;
};
