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

// ✅ MISE À JOUR : nouvelle URL backend
const allowedOrigins = [
  "https://chatgo-app-front.onrender.com",  // Frontend
  "https://chat-app-3.onrender.com",        // Backend (URL mise à jour !)
  //"http://localhost:5173"                 // Dev local si besoin
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS check - origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Pour les anciens navigateurs
};

// ✅ CORS en premier - AVANT tout le reste
app.use(cors(corsOptions));

// ✅ Gestion explicite des preflight OPTIONS pour toutes les routes
app.options('*', cors(corsOptions));

// ✅ Middleware de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// ✅ Routes API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Route de test CORS
app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful 🎉",
    origin: req.headers.origin || "no origin header",
    method: req.method,
    headers: req.headers
  });
});

// ✅ Route de test pour preflight
app.options("/api/*", (req, res) => {
  console.log("Preflight request received for:", req.originalUrl);
  res.status(200).end();
});

server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  console.log('Allowed origins:', allowedOrigins);
  connectDB();
});