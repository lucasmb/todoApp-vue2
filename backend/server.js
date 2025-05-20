import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import connectDB from "./config/db.js";
import taskRoutes from "./routes.js";
import initializeTaskSockets from "./taskSockets.js";

// Initialize database connection
connectDB();

const app = express();

// Configure middleware
const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: "*", //CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

// Mount routes on /api
app.use("/api", taskRoutes);

// Create HTTP server
/** @type {HTTPServer} */
const httpServer = createServer(app);

// Configure Socket.IO
/** @type {IOServer} */
const io = new Server(httpServer, {
  cors: {
    origin: "*", //CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Initialize socketIo handlers
initializeTaskSockets(io);

/**
 * Basic health check endpoint
 * @route GET /health
 * @returns {string} - Status message
 */
app.get("/health", (req, res) => res.send("Todo App Backend API Running"));

// Server configuration
const PORT = process.env.PORT || 3000;

/**
 * Start Express server with SocketIo
 */
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
