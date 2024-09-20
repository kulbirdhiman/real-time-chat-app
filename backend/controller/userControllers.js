import expressAsyncHandler from "express-async-handler";
import createToken from "../utils/createToken.js";
import bcrypt from 'bcryptjs';
import User from '../model/User.js';

// Sign Up User
const signUp = expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user already exists
    const isExist = await User.findOne({ 
        $or: [{ email }, { username }]
    });

    if (isExist) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        // Hash password and create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        createToken(res, newUser._id);
        // Create token and return response
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Login User
const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User does not exist" });
    }

    try {
        // Compare the provided password with the stored hashed password
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Create token and return user information
        createToken(res, user._id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get All Users
const allUser = expressAsyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Logout User
const logout = expressAsyncHandler(async (req, res) => {
    try {
        res.cookie("jwt", "", {
            expires: new Date(0),
            httpOnly: true
        });

        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export { allUser, signUp, loginUser, logout };
