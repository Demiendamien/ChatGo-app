import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" }); // renvoie une erreur 400 : mauvaise requête
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" }); // si email existe

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPassword,
      fullName,
    });

    if (newUser) {
      generateToken(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" }); // renvoie une erreur 400 : mauvaise requête
    }
  } catch (error) {
    console.log("Error in signup", error.message); // affiche le message d'erreur
    res.status(500).json({ message: "Internal server error" }); // renvoie une erreur 500
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profil pic is required" });
    }

    const uploaderReponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploaderReponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateUser);

  } catch (error) {
    console.log("error in uptade profile:" , error);
    res.status(500).json({message : "Internal server error"});
  }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal server Error"});
    }
}
