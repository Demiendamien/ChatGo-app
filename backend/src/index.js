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

const allowedOrigins = [
  "https://chat-go-app-41li.vercel.app", // ton frontend Vercel
  "https://chat-go-app-41li-abimkryek-kanga-kouadio-demiens-projects.vercel.app/", // ton frontend Vercel (autre domaine)
  "http://localhost:5173"                // dev local (facultatif)
];

const corsOptions = {
  origin: function (origin, callback) {
    // autorise les requêtes sans origin (par ex: curl/postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

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

app.use((req, res, next) => {
  console.log("🛰️ Requête venant de :", req.headers.origin);
  next();
});
// Middleware pour servir les fichiers statiques (si besoin)

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Route de test ultra-simple
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Backend is running!",
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Route de test
app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful 🎉",
    origin: req.headers.origin || "no origin header"
  });
});

server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  console.log('Allowed origins:', corsOptions.origin);
  
  // Debug des variables d'environnement
  console.log('Environment check:');
  console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  
  connectDB();
});