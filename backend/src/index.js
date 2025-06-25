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

// ✅ CONFIG CORS avec la lib `cors`
const FRONTEND_ORIGIN = "https://chatgo-app-front.onrender.com";

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🧠 Middleware de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// 🧪 Route de test
app.get("/cors-test", (req, res) => {
  res.json({ message: "✅ CORS test réussi", origin: req.headers.origin });
});

// 📦 Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 🏠 Route par défaut
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

// 🚀 Lancement
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});
