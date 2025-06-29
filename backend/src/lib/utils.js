import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // ✅ TOUJOURS true (HTTPS obligatoire)
    sameSite: "None", // ✅ OBLIGATOIRE pour cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // ❌ NE PAS spécifier de domaine pour cross-origin
  });

  return token;
};