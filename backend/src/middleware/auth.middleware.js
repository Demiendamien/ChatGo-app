// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";


// export const protectRoute = async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt

//         if (!token) {
//             return res.status(401).json({message : "Unauthorized - No Token Provider"});           
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET)

//         if (!decoded) {
//             return res.status(401).json({ message : "Unauthorized - No Token Provider"});
//         }
        

//         const user = await User.findById(decoded.userId).select("-password");

//         if (!user) {
//             return res.status(404).json({ message : "User not found"});
//         }

//         req.user = user 

//         next()

//     } catch (error) {
//         console.log("Error in protectRoute middleware", error.message);
//         res.status(500).json({message : "Internal server error"});

        
//     }
// }




import jwt from "jsonwebtoken"; // ✅ CORRIGÉ : "jsaonwebtoken" → "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Non autorisé : token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ AJOUTÉ : Vérification si le token est valide
    if (!decoded) {
      return res.status(401).json({ message: "Non autorisé : token invalide" });
    }

    const user = await User.findById(decoded.id).select("-password");
    
    // ✅ AJOUTÉ : Vérification si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    
    req.user = user;

    next();
  } catch (error) {
    console.log("Erreur protectRoute :", error.message);
    res.status(401).json({ message: "Non autorisé : token invalide" });
  }
};
