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

// Définir les origines autorisées (ajoute localhost pour dev si besoin)
const allowedOrigins = [
  "https://chatgo-app-front.onrender.com",
  "https://chatgo-app-3.onrender.com",
  //"http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS check - origin:", origin);
    // Permet les requêtes sans origine (Postman, curl, etc.) ET les origines autorisées
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

// Place CORS AVANT toutes les routes
app.use(cors(corsOptions));
//app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful 🎉",
    origin: req.headers.origin || "no origin header",
  });
});

server.listen(PORT, () => {
  console.log('server is running on port', PORT);
  connectDB();
});
