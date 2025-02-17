import { SerializedMessage } from "@/app/constants/types";
import { DBMessage } from "@/app/constants/types";
import { getCollection } from "./db";

export async function getMessages() {
  const messagesCollection = await getCollection("messages");

  // Fetch the last 50 messages (sorted by timestamp ascending).
  const messages = await messagesCollection
    .find({})
    .sort({ timestamp: 1 })
    .limit(50)
    .toArray();

  return serializeMessages(messages).reverse();
}

function serializeMessages(messages: DBMessage[]): SerializedMessage[] {
  return messages.map((message) => ({
    ...message,
    _id: message._id.toString(),
    likes: message.likes.toString(),
    dislikes: message.dislikes.toString(),
  }));
}
