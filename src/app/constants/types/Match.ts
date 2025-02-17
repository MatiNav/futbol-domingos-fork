import { ObjectId } from "mongodb";

export type Team = {
  players: MatchPlayer[];
  team: MatchTeam;
};

export type SerializedTeam = Omit<Team, "players"> & {
  players: SerializedMatchPlayer[];
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
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type MatchPlayer = {
  _id: ObjectId; // Player id
  goals: number;
  assists?: number;
};

export type SerializedMatchPlayer = Omit<MatchPlayer, "_id"> & {
  _id: string;
};

export type SerializedMatch = Omit<DBMatch, "_id" | "oscuras" | "claras"> & {
  _id: string;
  oscuras: SerializedTeam;
  claras: SerializedTeam;
};

export enum MatchResult {
  OSCURAS = "oscuras",
  CLARAS = "claras",
  DRAW = "draw",
}

export type MatchTeam = "oscuras" | "claras";

export type MatchVote = {
  userId: string;
  playerVotedFor: string;
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
