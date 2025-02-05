import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import pusher from "@/lib/pusher";
import { getAuthenticatedUser } from "@/app/utils/server/users";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export const GET = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("futbol");
    const messagesCollection = db.collection("messages");

    // Fetch the last 50 messages (sorted by timestamp ascending).
    const messages = await messagesCollection
      .find({})
      .sort({ timestamp: 1 })
      .limit(50)
      .toArray();

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Error fetching messages" },
      { status: 500 }
    );
  }
};

export const POST = withApiAuthRequired(async function POST(
  request: NextRequest
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("futbol");
    const messagesCollection = db.collection("messages");

    const message = {
      userId: user.playerId,
      userName: user.displayName,
      content: content.trim(),
      teamLogo: user.favoriteTeam,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
    };

    await messagesCollection.insertOne(message);

    // Trigger a Pusher event on the "messages-channel" with the event "new-message"
    await pusher.trigger("messages-channel", "new-message", message);

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Error sending message" },
      { status: 500 }
    );
  }
});
