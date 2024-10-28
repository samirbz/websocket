"use client";

import { useEffect, useState } from "react";

const WebSocketClient: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    // Handle WebSocket connection open event
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    };

    // Handle incoming messages from the server
    socket.onmessage = (event) => {
      setReceivedMessages((prev) => [...prev, event.data]);
    };

    // Handle WebSocket close event
    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    };

    // Handle WebSocket error event
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    // Clean up WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(message);
      setMessage("");
    };
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-semibold">WebSocket Client Example</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="border rounded p-2 w-full"
        disabled={!isConnected}
      />
      <button
        onClick={sendMessage}
        className={`p-2 rounded w-full ${isConnected ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-600 cursor-not-allowed"}`}
        disabled={!isConnected}
      >
        {isConnected ? "Send Message" : "Connecting..."}
      </button>
      <h2 className="text-lg font-semibold mt-4">Messages:</h2>
      <ul className="space-y-1">
        {receivedMessages.map((msg, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketClient;