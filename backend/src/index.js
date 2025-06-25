import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cors from 'cors'

import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();



const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
  "https://chatgo-app-front.onrender.com"
];

// Add CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://chatgo-app-front.onrender.com'); // Or '*' for any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful 🎉",
    origin: req.headers.origin || "no origin header",
  });
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

server.listen(PORT, () => {
    console.log('server is running on port', PORT);
    connectDB();
});
