import { ObjectId } from "mongodb";
import { TEAMS_IMAGES } from "../images/teams";

export type Message = {
  _id: ObjectId;
  userId: string;
  userName: string;
  content: string;
  teamLogo?: keyof typeof TEAMS_IMAGES;
  timestamp: Date;
  likes: number;
  dislikes: number;
};
