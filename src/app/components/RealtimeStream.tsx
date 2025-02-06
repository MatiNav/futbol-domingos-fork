"use client";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DBMessage } from "@/app/constants/types/Message";
import Image from "next/image";
import Pusher from "pusher-js";
import { TEAMS_IMAGES } from "../constants/images/teams";

export default function RealtimeStream() {
  const { user } = useUser();
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch initial messages via API
    async function fetchMessages() {
      try {
        const response = await fetch("/api/messages");
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();

    // Initialize Pusher and subscribe to channel
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    const channel = pusher.subscribe("messages-channel");

    channel.bind("new-message", (newMessageData: DBMessage) => {
      setMessages((prev) => [newMessageData, ...prev]);
    });

    setConnectionStatus("Conectado");

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const handleSubmit = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#1B472C] min-h-screen p-4">
      <div className="text-sm text-white mb-4 flex items-center">
        {connectionStatus}
        {connectionStatus === "Conectado" && (
          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2 mb-4 items-center">
        {user && (
          <>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 p-3 rounded-md bg-[#e6e7eb] text-gray-800 placeholder-gray-500 text-lg focus:outline-none"
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#6B8E4E] hover:bg-[#587940] text-white rounded-md text-lg font-bold uppercase tracking-wide shadow-lg"
            >
              Enviar
            </button>
          </>
        )}
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white">No hay mensajes</div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="bg-[#e6e7eb] rounded-md p-4">
              <div className="flex items-start gap-3">
                {message.teamLogo && (
                  <div className="w-12 h-12 relative">
                    <Image
                      src={TEAMS_IMAGES[message.teamLogo]}
                      alt={`${message.userName}'s team logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-black">
                      {message.userName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-black">{message.content}</p>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <button className="text-green-600">👍</button>
                      <span>{message.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="text-red-600">👎</button>
                      <span>{message.dislikes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
