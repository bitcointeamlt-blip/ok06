import express from "express";
import { createServer } from "http";
import { Server, matchMaker } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { GameRoom } from "./rooms/GameRoom";
import cors from "cors";

const app = express();

// CRITICAL: Handle /matchmake routes FIRST - before Colyseus server creation
// This ensures CORS headers are set BEFORE Colyseus processes the request
app.use('/matchmake', (req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  
  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
});

// CRITICAL: CORS middleware for all other routes
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Create HTTP server with Express app
const server = createServer(app);

// Create Colyseus server with WebSocketTransport
// Pass the HTTP server to WebSocketTransport
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: server,
  }),
});

// CRITICAL: Override Colyseus matchmaking CORS headers
matchMaker.controller.getCorsHeaders = function(req: any) {
  const origin = req.headers.origin;
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
};

// Register room
gameServer.define("pvp_room", GameRoom);

// Get PORT from environment - Colyseus Cloud sets this automatically
// CRITICAL: Colyseus Cloud nustato PORT per environment variable
// NEGALIME keisti porto, nes Colyseus Cloud routing neveiks!
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 2567;

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// CRITICAL: Error handler for EADDRINUSE
// Jei portas užimtas - exit ir leisti PM2 restart'inti su delay
// NEGALIME keisti porto, nes Colyseus Cloud tikisi, kad serveris veiks ant PORT!
server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('💡 This usually means PM2 is trying to start multiple instances');
    console.error('💡 Waiting 5 seconds before exit to allow PM2 cleanup...');
    console.error('💡 PM2 will restart with delay configured in ecosystem.config.js');
    console.error('💡 CRITICAL: Cannot change port - Colyseus Cloud expects server on PORT!');
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Start HTTP server - Colyseus will handle WebSocket connections automatically
// CRITICAL: Must use PORT from environment - Colyseus Cloud routing depends on it!
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Server listening on 0.0.0.0:${PORT}`);
});
