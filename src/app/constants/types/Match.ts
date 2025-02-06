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
  opinions?: MatchOpinion[];
};

export type MatchPlayer = {
  _id: ObjectId; // Player id
  goals: number;
  assists?: number;
};

export enum MatchResult {
  OSCURAS = "oscuras",
  CLARAS = "claras",
  DRAW = "draw",
}

export type MatchTeam = "oscuras" | "claras";

export type MatchVote = {
  userId: string;
  playerVotedFor: ObjectId;
  userName: string;
};

export type MatchOpinion = {
  _id: ObjectId;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
};
