// // import express from 'express';
// // import dotenv from 'dotenv';
// // import cookieParser from 'cookie-parser';
// // import cors from 'cors';
// // import path from 'path';

// // import authRoutes from './routes/auth.route.js';
// // import messageRoutes from './routes/message.route.js';

// // import { connectDB } from './lib/db.js';
// // import { app, server } from './lib/socket.js';

// // dotenv.config();

// // const PORT = process.env.PORT || 5001;
// // const __dirname = path.resolve();

// // // ✅ CONFIG CORS avec la lib `cors`
// // const FRONTEND_ORIGIN = "https://chatgo-app-front.onrender.com";

// // app.use(cors({
// //   // origin: FRONTEND_ORIGIN,
// //   origin : "http://localhost:5173",
// //   credentials: true,
// //   // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   // allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // // 🧠 Middleware de parsing
// // app.use(express.json({ limit: "10mb" }));
// // app.use(express.urlencoded({ limit: "10mb", extended: true }));
// // app.use(cookieParser());

// // // 🧪 Route de test
// // app.get("/cors-test", (req, res) => {
// //   res.json({ message: "✅ CORS test réussi", origin: req.headers.origin });
// // });

// // // 📦 Routes
// // app.use("/api/auth", authRoutes);
// // app.use("/api/messages", messageRoutes);

// // // 🏠 Route par défaut
// // app.get('/', (req, res) => {
// //   res.send('Backend is running ✅');
// // });

// // // 🚀 Lancement
// // server.listen(PORT, () => {
// //   console.log(`🚀 Server is running on port ${PORT}`);
// //   connectDB();
// // });




// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import path from 'path';

// import { connectDB } from './lib/db.js';
// import authRoutes from './routes/auth.route.js';
// import messageRoutes from './routes/message.route.js';
// import { app, server } from './lib/socket.js';

// dotenv.config();

// // PORT par défaut
// const PORT = process.env.PORT || 5001;
// const __dirname = path.resolve();

// // ========================
// // 🧩 Middlewares Globaux
// // ========================

// // Analyse JSON + cookies
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
// app.use(cookieParser());

// // 🔐 CORS : assure-toi que le frontend Render est bien là
// // app.use(cors({
// //   origin: [
// //     "http://localhost:5173", // Dev local
// //     "https://chatgo-app-front.onrender.com", // Front déployé
// //   ],
// //   credentials: true,
// // }));


// app.use(cors({
//   origin: process.env.CLIENT_URL, // important
//   credentials: true,
// }));


// // ========================
// // 📦 Routes API
// // ========================
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // ========================
// // 🏭 Production Frontend
// // ========================
// // if (process.env.NODE_ENV === 'production') {
// //   app.use(express.static(path.join(__dirname, "../frontend/dist")));

// //   app.get("*", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
// //   });
// // }

// // ========================
// // 🚀 Lancement Serveur
// // ========================
// server.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   connectDB(); // Connexion MongoDB
// });




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

// Configuration CORS avec les nouvelles URLs
const corsOptions = {
  origin: [
    "https://chat-go-app-41li.vercel.app",  // Frontend Vercel
    "https://ton-backend.onrender.com",     // Backend Render
    // Garde les anciennes au cas où
    "https://chatgo-app-front.onrender.com"
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

// Debug middleware - pour voir toutes les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

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

// Route de debug pour voir toutes les routes disponibles
app.get("/debug-routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  res.json({ routes });
});

server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  console.log('Allowed origins:', corsOptions.origin);
  connectDB();
});