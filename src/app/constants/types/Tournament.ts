import { ObjectId } from "mongodb";
import { DBMatch } from "./Match";

export type Tournament = {
  _id: ObjectId;
  name: string;
  info: string;
  matches: DBMatch[];
};
