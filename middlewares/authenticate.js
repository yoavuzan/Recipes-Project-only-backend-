const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  //const token = req.cookies.token

  if (!token) {
    throw { status: 401, message: "No token provided" };
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decodedUser);
    req.user = decodedUser; // Add user info to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw { status: 401, message: "Token expired" };
    }
    throw { status: 401, message: "Invalid token" };
  }
};

module.exports = { authenticate };