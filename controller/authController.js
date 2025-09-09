const jwt = require("jsonwebtoken");
const { login, register } = require("../models/authModel.js");

async function loginUser(req, res,next) {
  console.log("Login attempt for user:", req.body.email);

  const user = await login(req.body.email, req.body.password);

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  });
}

async function registerUser(req, res,next) {
  const user = await register(
    req.body.email,
    req.body.password,
    req.body.username,
    req.body.firstName,
    req.body.lastName
  );
 

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Registration failed" });
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  });
}
function getUserProfile(req, res) {
  const user = req.user; 
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}

module.exports = { loginUser, registerUser, getUserProfile };
