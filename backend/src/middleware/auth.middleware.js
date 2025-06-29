import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 🔍 DEBUG: Vérifier les cookies reçus
    console.log("🍪 Cookies reçus:", req.cookies);
    
    const token = req.cookies.jwt;

    if (!token) {
      console.log("❌ Aucun token trouvé dans les cookies");
      return res.status(401).json({ message: "Non autorisé : token manquant" });
    }

    console.log("✅ Token trouvé:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé:", decoded);

    if (!decoded) {
      return res.status(401).json({ message: "Non autorisé : token invalide" });
    }

    const user = await User.findById(decoded.id).select("-password");
    console.log("✅ Utilisateur trouvé:", user ? user.email : "Aucun");
    
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