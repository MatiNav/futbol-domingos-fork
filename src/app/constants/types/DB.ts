import { DBMatch } from "./Match";
import { DBMessage } from "./Message";
import { DBPlayer } from "./Player";
import { DBTournament } from "./Tournament";

export type CollectionMapping = {
  players: DBPlayer;
  matches: DBMatch;
  messages: DBMessage;
  tournaments: DBTournament;
};

export type CollectionName = keyof CollectionMapping;
