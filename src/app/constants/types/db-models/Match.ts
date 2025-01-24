import { ObjectId } from "mongodb";

export type DBMatch = {
  _id: ObjectId;
  matchNumber: number;
  oscuras: {
    players: MatchPlayer[];
    team: "oscuras";
  };
  claras: {
    players: MatchPlayer[];
    team: "claras";
  };
  winner?: MatchResult;
  date: string;
};

export type MatchPlayer = {
  _id: ObjectId; // Player id
  goals: number;
};

export type MatchResult = "oscuras" | "claras" | "draw";
