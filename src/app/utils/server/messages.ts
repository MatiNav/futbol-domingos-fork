import { getCollection } from "./db";

export async function getMessages() {
  const messagesCollection = await getCollection("messages");

  // Fetch the last 50 messages (sorted by timestamp ascending).
  const messages = await messagesCollection
    .find({})
    .sort({ timestamp: 1 })
    .limit(50)
    .toArray();

  return messages.reverse();
}
