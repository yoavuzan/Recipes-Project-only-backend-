//authRouter.js
const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controller/authController");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

//GET
router.get("/profile", authenticate, getUserProfile);

//POST
router.post("/register", registerUser);
router.post("/login", loginUser);


module.exports = router;
