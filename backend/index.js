import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectedDb from "./db/connectDb.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Listen for the "joinChat" event to join a specific chat room
  socket.on("joinChat", (chatId) => {
    console.log(`User joined chat with ID: ${chatId}`);
    socket.join(chatId); // Join the user to a specific chat room
  });

  // Listen for the "sendMessage" event from the client
  socket.on("sendMessage", (message) => {
    console.log("Received message from client:", message);

    // Emit the message to all clients in the chat room
    io.to(message.chatId).emit("messageReceived", message);
  });

  // Handle the user disconnecting from the socket
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
connectedDb();

// Define your routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);

// Start the server
const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
