import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Configuration CORS simple et efficace
const corsOptions = {
  origin: [
    "https://chatgo-app-front.onrender.com",
    "https://chat-app-3.onrender.com"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

// CORS middleware - simple et propre
app.use(cors(corsOptions));

// Middleware de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Route de test
app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful 🎉",
    origin: req.headers.origin || "no origin header"
  });
});

server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  connectDB();
});