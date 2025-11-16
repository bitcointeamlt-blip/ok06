import express from "express";
import { createServer } from "http";
import { Server, matchMaker } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { GameRoom } from "./rooms/GameRoom";
import cors from "cors";

const app = express();

// CRITICAL: CORS middleware for ALL routes FIRST - before anything else
// This MUST be the first middleware to ensure CORS headers are set for ALL requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers for ALL requests
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
  
  // Handle preflight OPTIONS requests immediately - BEFORE Colyseus processes them
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
});

// CRITICAL: Explicit /matchmake route handler as backup
// This ensures /matchmake routes get CORS headers even if Colyseus bypasses Express
app.use('/matchmake', (req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers again (backup)
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

// CORS package middleware as additional backup
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

// CRITICAL: Start Colyseus server using gameServer.listen()
// This is the official Colyseus way when using WebSocketTransport({ server })
// gameServer.listen() will call transport.listen(), which calls server.listen()
// Error handling is done through gameServer.listen() promise
gameServer.listen(PORT, '0.0.0.0')
  .then(() => {
    console.log(`✅ Colyseus server is running on port ${PORT}`);
    console.log(`✅ Server listening on 0.0.0.0:${PORT}`);
    console.log(`✅ HTTP server is ready`);
    console.log(`✅ WebSocket transport is ready`);
  })
  .catch((err: any) => {
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
      console.error('❌ Failed to start Colyseus server:', err);
      process.exit(1);
    }
  });
