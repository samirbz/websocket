import { NextApiRequest } from "next";
import { WebSocketServer } from "ws";
import { Server } from "http";

let wsServer: WebSocketServer | null = null;

export async function GET(req: NextApiRequest, res: any) {
  if (!res.socket.server.ws) {
    console.log("Initializing WebSocket server...");
    
    wsServer = new WebSocketServer({ noServer: true });

    // Attach WebSocket server to the upgrade event
    res.socket.server.on("upgrade", (request, socket, head) => {
      wsServer?.handleUpgrade(request, socket, head, (ws) => {
        wsServer?.emit("connection", ws, request);
      });
    });

    wsServer.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("message", (message: string) => {
        console.log("Received message:", message);

        // Broadcast to all connected clients
        wsServer?.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(`Server received: ${message}`);
          }
        });
      });

      socket.on("close", () => {
        console.log("Client disconnected");
      });
    });

    res.socket.server.ws = wsServer;
  }

  res.end();
}