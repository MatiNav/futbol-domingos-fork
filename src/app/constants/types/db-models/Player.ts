import { ObjectId } from "mongodb";

export type DBPlayer = {
  _id: ObjectId; // unique id for the player
  name: string;
  image: string;
};
