const express = require("express");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const app = express();
const router = require("./routes/recipesRouter");
const apiAuthRouter = require("./routes/authRouter");
const { test } = require("./DB/config/config");
const { sequelize } = require("./DB/models/index.js");
// Morgan middleware for logging
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/auth", apiAuthRouter);
app.use("/api", router);



// Function to test DB connection

async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

app.get("/", async (req, res) => {
  const [result, meta] = await sequelize.query("SELECT * FROM recipes");

  res.send("Welcome to the Recipes API");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await testDBConnection();
});

// Error Handling Middleware (always in the END)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});
