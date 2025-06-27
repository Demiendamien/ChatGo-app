import jwt from "jsonwebtoken";



// export const generateToken = (userId, res) => {
    
//     const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
    
//     res.cookie("jwt", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== "development", 
//         sameSite: "strict",
//         maxAge: 7 *24 * 60 * 60 * 1000,
//     });

//     return token;
// }; 


// export function generateToken(userId, res) {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

//   const isProduction = process.env.NODE_ENV === "production";

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "None" : "Lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
// }



import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "3d", // 3 jours
  });

  res.cookie("jwt", token, {
    httpOnly: true,                         // ⚠️ important : empêche accès JS
    secure: process.env.NODE_ENV === "production", // true si prod
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 jours
  });
};
