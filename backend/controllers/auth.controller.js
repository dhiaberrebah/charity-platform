import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import util from "util"

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const signup = async (req, res) => {
  try {
    console.log("Received request body:", req.body)

    const { nom, prenom, age, adresse, telephone, email, password } = req.body

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
    const newUser = new User({
      nom,
      prenom,
      age,
      adresse,
      telephone,
      email,
      password: hashedPassword,
    })
    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        age: newUser.age,
        adresse: newUser.adresse,
        telephone: newUser.telephone,
        email: newUser.email,
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
    const safeReq = {
      user: req.user || null,
    }
    console.log("Safe Request Data:", util.inspect(safeReq, { depth: null }))
    res.status(200).json(safeReq)
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { nom, prenom, age, adresse, telephone, email } = req.body

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

    // Handle email update separately
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } })
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" })
      }
      user.email = email
    }

    await user.save()

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        age: user.age,
        adresse: user.adresse,
        telephone: user.telephone,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error in updateProfile controller:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

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

