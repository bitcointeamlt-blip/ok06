import express from "express";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { GameRoom } from "./rooms/GameRoom";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Create HTTP server
const server = createServer(app);

// Create Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: server,
  }),
});

// Register room
gameServer.define("pvp_room", GameRoom);

// Get PORT from environment (Colyseus Cloud sets this)
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 2567;

// Start server
gameServer.listen(PORT)
  .then(() => {
    console.log(`✅ Colyseus server is running on port ${PORT}`);
  })
  .catch((err: any) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
