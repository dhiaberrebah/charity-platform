import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import util from "util"
import { createNotification } from "./notification.controller.js"
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getUsers = async (req, res) => {
  try {
    // Log the user making the request to debug
    console.log("User requesting getUsers:", req.user)

    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error("Error in getUsers:", error)
    res.status(500).json({ message: error.message })
  }
}

export const signup = async (req, res) => {
  try {
    console.log("Received request body:", req.body)

    const { nom, prenom, age, adresse, telephone, email, password, role } = req.body
    const isAdmin = req.body.isAdmin || role === "admin" || false

    if (!nom || !prenom || !age || !adresse || !telephone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }
    if (telephone.length !== 8) {
      return res.status(400).json({ message: "Phone number must be 8 characters long" })
    }
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Determine role based on isAdmin or role field
    const userRole = role || (isAdmin ? "admin" : "user")

    const newUser = new User({
      nom,
      prenom,
      age,
      adresse,
      telephone,
      email,
      password: hashedPassword,
      isAdmin,
      role: userRole,
    })

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()

      // Create notification for new user
      await createNotification("user", `New user registered: ${prenom} ${nom}`, {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      })

      res.status(201).json({
        _id: newUser._id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        age: newUser.age,
        adresse: newUser.adresse,
        telephone: newUser.telephone,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        role: newUser.role,
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.log("Error in signup controller", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      age: user.age,
      adresse: user.adresse,
      telephone: user.telephone,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
    })
  } catch (error) {
    console.log("Error in login controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "User logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const checkAuth = async (req, res) => {
  try {
    // Extract only serializable data from req
    const safeReq = {
      user: req.user || null, // Include user if it exists
    }

    // Debugging: Log request safely
    console.log("Safe Request Data:", util.inspect(safeReq, { depth: null }))

    res.status(200).json(safeReq)
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { nom, prenom, age, adresse, telephone, email, role } = req.body
    const userId = req.params.id

    // Log the user making the request to debug
    console.log("User updating:", req.user)

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user fields
    if (nom) user.nom = nom
    if (prenom) user.prenom = prenom
    if (age) user.age = age
    if (adresse) user.adresse = adresse
    if (telephone) user.telephone = telephone

    // Handle role update
    if (role) {
      user.role = role
      // isAdmin will be synced in the pre-save hook
    } else if (req.body.isAdmin !== undefined) {
      user.isAdmin = req.body.isAdmin
      // role will be synced in the pre-save hook
    }

    // Handle email update separately
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } })
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" })
      }
      user.email = email
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      nom: updatedUser.nom,
      prenom: updatedUser.prenom,
      age: updatedUser.age,
      adresse: updatedUser.adresse,
      telephone: updatedUser.telephone,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.role,
    })
  } catch (error) {
    console.error("Error in updateUser controller:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

    // Log the user making the request to debug
    console.log("User deleting:", req.user)

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Delete the user
    await User.findByIdAndDelete(userId)

    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error in deleteUser controller:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const uploadDocuments = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const urls = [];
    
    // Handle front document
    if (req.files.frontDocument) {
      const frontUrl = await uploadToCloudinary(req.files.frontDocument[0]);
      urls.push(frontUrl);
    }

    // Handle back document
    if (req.files.backDocument) {
      const backUrl = await uploadToCloudinary(req.files.backDocument[0]);
      urls.push(backUrl);
    }

    // Update user with document URLs
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'documents.front': urls[0] || null,
          'documents.back': urls[1] || null,
          'verificationStatus': 'pending'
        }
      },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Documents uploaded successfully',
      documents: {
        front: urls[0] || null,
        back: urls[1] || null
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error uploading documents' 
    });
  }
};

export const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('verificationStatus documents');
    res.json({
      status: user.verificationStatus,
      documents: user.documents
    });
  } catch (error) {
    console.error('Error fetching verification status:', error);
    res.status(500).json({ message: error.message });
  }
};

