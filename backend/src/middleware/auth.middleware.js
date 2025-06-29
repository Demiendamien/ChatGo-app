import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 🔍 DEBUG: Afficher tous les headers et cookies
    console.log("🔍 Headers reçus:", req.headers);
    console.log("🍪 Cookies reçus:", req.cookies);
    console.log("🌐 Origin:", req.headers.origin);
    console.log("🔒 Cookie header brut:", req.headers.cookie);
    
    const token = req.cookies.jwt;

    if (!token) {
      console.log("❌ AUCUN TOKEN dans req.cookies.jwt");
      return res.status(401).json({ message: "Non autorisé : token manquant" });
    }

    console.log("✅ Token trouvé:", token.substring(0, 30) + "...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé:", { id: decoded.id, exp: new Date(decoded.exp * 1000) });

    if (!decoded) {
      return res.status(401).json({ message: "Non autorisé : token invalide" });
    }

    const user = await User.findById(decoded.id).select("-password");
    console.log("✅ Utilisateur trouvé:", user ? user.email : "AUCUN UTILISATEUR");
    
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log("❌ Erreur protectRoute :", error.message);
    res.status(401).json({ message: "Non autorisé : token invalide" });
  }
};