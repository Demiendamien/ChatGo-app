import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// 🔐 Configuration CORS sécurisée et simple pour le front déployé sur Render
const FRONTEND_URL = "https://chatgo-app-front.onrender.com";

// Middleware CORS manuel pour plus de contrôle
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Pour gérer les requêtes "OPTIONS preflight"
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Autres middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Route de test CORS
app.get("/cors-test", (req, res) => {
  res.json({
    message: "✅ CORS test successful",
    origin: req.headers.origin || "no origin"
  });
});

// Page d'accueil simple
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});
