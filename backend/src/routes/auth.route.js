// import express from "express";

// const router = express.Router();

// // Routes ultra-simples pour tester
// router.get("/test", (req, res) => {
//   console.log("🧪 Route /test appelée");
//   res.json({ message: "Auth route works!", timestamp: new Date() });
// });

// router.post("/signup", (req, res) => {
//   console.log("📝 Route /signup appelée - body:", req.body);
//   res.json({ 
//     message: "Signup endpoint reached!", 
//     body: req.body,
//     timestamp: new Date()
//   });
// });

// router.post("/login", (req, res) => {
//   console.log("🔐 Route /login appelée - body:", req.body);
//   res.json({ 
//     message: "Login endpoint reached!", 
//     body: req.body,
//     timestamp: new Date()
//   });
// });

// router.get("/check", (req, res) => {
//   console.log("✔️ Route /check appelée");
//   res.json({ 
//     message: "Check endpoint reached!",
//     timestamp: new Date()
//   });
// });

// export default router;



import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

// Routes publiques
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Routes protégées (nécessitent un token JWT)
router.get("/check", protectRoute, checkAuth);
router.put("/update-profile", protectRoute, updateProfile);

export default router;
