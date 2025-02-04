import { ObjectId } from "mongodb";

export type DBPlayer = {
  _id: ObjectId; // unique id for the player
  name: string;
  image: string;
  favoriteTeam: string;
  email: string;
  role?: "admin" | "user";
};

export type PlayerWithStats = {
  _id: string;
  name: string;
  image: string;
  favoriteTeam: string;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  points: number;
  percentage: number;
  position: number;
  mvp: number;
};
