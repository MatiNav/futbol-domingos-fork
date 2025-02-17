import { ObjectId } from "mongodb";
import { TEAMS_IMAGES } from "@/app/constants/images/teams";

export type DBMessage = {
  _id: ObjectId;
  userId: string;
  userName: string;
  content: string;
  teamLogo?: keyof typeof TEAMS_IMAGES;
  timestamp: Date;
  likes: number;
  dislikes: number;
};

export type SerializedMessage = Omit<
  DBMessage,
  "_id" | "likes" | "dislikes"
> & {
  _id: string;
  likes: string;
  dislikes: string;
};
