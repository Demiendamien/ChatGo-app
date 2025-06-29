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

const corsOptions = {
  origin: (origin, callback) => {
    // En développement, autoriser toutes les origines
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // En production, vérifier la liste
    const allowedOrigins = [
      'http://localhost:5173',
      'https://chat-go-app-41li.vercel.app',
      "https://chat-go-app-41li-git-main-kanga-kouadio-demiens-projects.vercel.app",
      "https://chat-go-app-41li-abimkryek-kanga-kouadio-demiens-projects.vercel.app",
      "https://chatgo-app-3.onrender.com"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Origine refusée par CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Debug logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} — Origin: ${req.headers.origin}`);
  next();
});

// API routes
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);

// Simple health check
app.get('/', (req, res) =>
  res.json({ message: '🚀 Backend is running!', port: PORT })
);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
      