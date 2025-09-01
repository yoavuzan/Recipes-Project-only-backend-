const express = require("express");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const app = express();
const router = require("./routes/routeAPI");

// Morgan middleware for logging
app.use(morgan("dev"));

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error Handling Middleware (always in the END)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});
