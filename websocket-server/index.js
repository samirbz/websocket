// websocket-server/index.js
const WebSocket = require("ws");

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

server.on("connection", (socket) => {
  console.log("Client connected");

  // Send a message to the client upon connection
  socket.send("Welcome to the WebSocket server!");

  // Handle incoming messages from the client
  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all connected clients
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Server received: ${message}`);
      }
    });
  });

  // Handle client disconnect
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});
