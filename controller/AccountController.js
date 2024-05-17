// AccountController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Account from "../models/account.js";

dotenv.config();

const jwtSecret =
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkR1b25nUXVvY1Z1IiwiZXhwIjoxNzE1OTY0MzIyLCJpYXQiOjE3MTU5NjQzMjJ9.Dd_IxvPcArJvkLwBQPsZ8FObfnnTUJiET8WpPeeRT7w";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Account.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      jwtSecret
    );

    res.json("Welcome");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { username, password, name } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await Account.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = await Account.create({
      username,
      password: hashedPassword,
      name,
    });

    // Generate JWT token
    const token = jwt.sign(
      { username: newUser.username, id: newUser._id },
      jwtSecret
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log(error);
  }
};
