import { ObjectId } from "mongodb";

export type Team = {
  players: MatchPlayer[];
  team: "oscuras" | "claras";
};

export type DBMatch = {
  _id: ObjectId;
  matchNumber: number;
  oscuras: Team;
  claras: Team;
  winner?: MatchResult;
  date: string;
};

export type MatchPlayer = {
  _id: ObjectId; // Player id
  goals: number;
};

export type MatchResult = "oscuras" | "claras" | "draw";
