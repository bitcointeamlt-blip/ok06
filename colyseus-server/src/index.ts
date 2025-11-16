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

// Register room with error handling
try {
  gameServer.define("pvp_room", GameRoom);
  console.log('✅ GameRoom "pvp_room" registered successfully');
} catch (error: any) {
  console.error('❌ Failed to register GameRoom:', error);
  console.error('Error name:', error?.name);
  console.error('Error message:', error?.message);
  console.error('Error stack:', error?.stack);
  // Don't exit - let server start and log the error
}

// Get PORT from environment - Colyseus Cloud sets this automatically
// CRITICAL: Colyseus Cloud nustato PORT per environment variable
// NEGALIME keisti porto, nes Colyseus Cloud routing neveiks!
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 2567;

// Error handling - CRITICAL: Log errors but don't exit immediately
// This allows PM2 to handle restarts properly
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  console.error('💡 Process will exit in 10 seconds to allow PM2 to handle restart...');
  
  // Give PM2 time to detect the error and restart
  setTimeout(() => {
    console.error('💡 Exiting due to uncaught exception...');
    process.exit(1);
  }, 10000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  console.error('Promise:', promise);
  console.error('💡 Process will exit in 10 seconds to allow PM2 to handle restart...');
  
  // Give PM2 time to detect the error and restart
  setTimeout(() => {
    console.error('💡 Exiting due to unhandled rejection...');
    process.exit(1);
  }, 10000);
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
    console.log(`✅ Health endpoint available at http://0.0.0.0:${PORT}/health`);
    console.log(`✅ Matchmaking endpoint available at http://0.0.0.0:${PORT}/matchmake`);
    
    // Keep process alive - don't exit
    // Server should run indefinitely
  })
  .catch((err: any) => {
    console.error('❌ CRITICAL ERROR during server start:');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
      console.error('💡 This usually means PM2 is trying to start multiple instances');
      console.error('💡 Waiting 5 seconds before exit to allow PM2 cleanup...');
      console.error('💡 PM2 will restart with delay configured in ecosystem.config.js');
      console.error('💡 CRITICAL: Cannot change port - Colyseus Cloud expects server on PORT!');
      setTimeout(() => {
        console.error('💡 Exiting due to EADDRINUSE...');
        process.exit(1);
      }, 5000);
    } else {
      console.error('❌ Failed to start Colyseus server:', err);
      console.error('💡 Exiting due to startup error...');
      process.exit(1);
    }
  });
