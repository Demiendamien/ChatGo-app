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

// Allowlist des origines autorisées
const allowedOrigins = [
  "https://chatgo-app-front.onrender.com",
  // "http://localhost:5173" // à activer si tu testes en local
];

// Middleware CORS
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Received request from origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Préflight global

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Routes de test
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful 🎉",
    origin: req.headers.origin || "no origin header",
  });
});

// Fallback frontend en prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Middleware CORS fallback pour toutes les réponses (headers en cas d'erreur)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// Middleware gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Caught error:", err.message);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy rejected this request" });
  }
  res.status(500).json({ error: "Something went wrong" });
});

server.listen(PORT, () => {
  console.log("✅ Server is running on port", PORT);
  connectDB();
});
