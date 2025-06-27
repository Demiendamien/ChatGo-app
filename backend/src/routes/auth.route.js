import express from "express";

const router = express.Router();

// Test si les imports fonctionnent
console.log("🔄 Chargement des routes auth...");

try {
  // Import avec gestion d'erreur
  const authController = await import("../controllers/auth.controller.js");
  const authMiddleware = await import("../middleware/auth.middleware.js");
  
  console.log("✅ Controllers importés:", Object.keys(authController));
  console.log("✅ Middleware importé:", Object.keys(authMiddleware));

  const {
    checkAuth,
    login,
    logout,
    signup,
    updateProfile,
  } = authController;
  
  const { protectRoute } = authMiddleware;

  // Routes avec logs
  router.post("/signup", (req, res, next) => {
    console.log("📝 Route /signup appelée");
    signup(req, res, next);
  });

  router.post("/login", (req, res, next) => {
    console.log("🔐 Route /login appelée");
    login(req, res, next);
  });

  router.post("/logout", (req, res, next) => {
    console.log("👋 Route /logout appelée");
    logout(req, res, next);
  });

  router.put("/update-profile", protectRoute, (req, res, next) => {
    console.log("👤 Route /update-profile appelée");
    updateProfile(req, res, next);
  });

  router.get("/check", protectRoute, (req, res, next) => {
    console.log("✔️ Route /check appelée");
    checkAuth(req, res, next);
  });

  console.log("✅ Routes auth configurées avec succès");

} catch (error) {
  console.error("❌ Erreur lors du chargement des routes auth:", error);
  
  // Routes de fallback pour debug
  router.get("/check", (req, res) => {
    res.status(500).json({ error: "Controller non chargé", details: error.message });
  });
  
  router.post("/signup", (req, res) => {
    res.status(500).json({ error: "Controller non chargé", details: error.message });
  });
}

export default router;