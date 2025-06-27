import express from "express";

const router = express.Router();

// Routes ultra-simples pour tester
router.get("/test", (req, res) => {
  console.log("🧪 Route /test appelée");
  res.json({ message: "Auth route works!", timestamp: new Date() });
});

router.post("/signup", (req, res) => {
  console.log("📝 Route /signup appelée - body:", req.body);
  res.json({ 
    message: "Signup endpoint reached!", 
    body: req.body,
    timestamp: new Date()
  });
});

router.post("/login", (req, res) => {
  console.log("🔐 Route /login appelée - body:", req.body);
  res.json({ 
    message: "Login endpoint reached!", 
    body: req.body,
    timestamp: new Date()
  });
});

router.get("/check", (req, res) => {
  console.log("✔️ Route /check appelée");
  res.json({ 
    message: "Check endpoint reached!",
    timestamp: new Date()
  });
});

export default router;