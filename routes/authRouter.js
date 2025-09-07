//authRouter.js
const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controller/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

//GET
router.get("/auth/profile", authenticateToken, getUserProfile);

//POST
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);


module.exports = router;
