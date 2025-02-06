import { DBMatch } from "./Match";
import { DBMessage } from "./Message";
import { DBPlayer } from "./Player";

export type CollectionMapping = {
  players: DBPlayer;
  matches: DBMatch;
  messages: DBMessage;
};

export type CollectionName = keyof CollectionMapping;
