import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import util from "util";


export const signup = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { nom, prenom, age, adresse, telephone, email, password,  } = req.body;

        if (!nom || !prenom || !age || !adresse || !telephone || !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if (telephone.length !== 8) {
            return res.status(400).json({ message: "Phone number must be 8 characters long" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            nom,
            prenom,
            age,
            adresse,
            telephone,
            email,
            password: hashedPassword,
            
        });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                nom: newUser.nom,
                prenom: newUser.prenom,
                age: newUser.age,
                adresse: newUser.adresse,
                telephone: newUser.telephone,
                email: newUser.email,
                
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid incredentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            age: user.age,
            adresse: user.adresse,
            telephone: user.telephone,
            email: user.email,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
} 

export const checkAuth = async (req, res) => {
    try {
        // Extract only serializable data from req
        const safeReq = {
          
            user: req.user || null, // Include user if it exists
        };

        // Debugging: Log request safely
        console.log("Safe Request Data:", util.inspect(safeReq, { depth: null }));

        res.status(200).json(safeReq);
    } catch (error) {
        console.error("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
