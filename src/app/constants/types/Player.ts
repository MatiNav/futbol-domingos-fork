import { ObjectId } from "mongodb";

export type DBPlayer = {
  _id: ObjectId; // unique id for the player
  name: string;
  image: string;
  favoriteTeam: string;
  email: string;
  role?: "admin" | "user";
};

export type SerializedPlayer = Omit<DBPlayer, "_id"> & {
  _id: string;
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
  assists: number;
  points: number;
  percentage: number;
  position: number;
  mvp: number;
};
