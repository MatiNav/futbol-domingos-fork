import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  // Create a new readable stream that listens to MongoDB changes.
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Optionally send an initial connection message.
      const initialData = {
        userName: "System",
        content: "Chat connection established",
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
      );

      // Connect to MongoDB and get the collection you want to watch.
      const client = await clientPromise;
      const db = client.db("futbol");
      // Replace "messages" with the name of your collection that holds chat updates.
      const collection = db.collection("messages");

      // Open a change stream on the collection.
      const changeStream = collection.watch();

      // Listen for change events.
      changeStream.on("change", (change) => {
        // Process only insert events (or any event type you need).
        if (change.operationType === "insert") {
          const fullDocument = change.fullDocument;
          const data = {
            userName: fullDocument.userName,
            content: fullDocument.content,
            timestamp: fullDocument.timestamp,
            likes: fullDocument.likes || 0,
            dislikes: fullDocument.dislikes || 0,
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        }
      });

      changeStream.on("error", (error) => {
        console.error("Error in MongoDB change stream", error);
        controller.error(error);
      });

      // Clean up by closing the change stream when the client disconnects.
      return () => {
        changeStream.close();
      };
    },
  });

  return new Response(stream, { headers });
}
