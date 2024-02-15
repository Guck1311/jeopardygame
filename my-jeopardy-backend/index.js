const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const questionsRoutes = require("./routes/questionsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const gamestateRoutes = require("./routes/gamestateRoutes");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware to parse JSON request bodies
app.use(express.json());

// Use routes
app.use("/api", questionsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", gamestateRoutes);

// Database connection setup
const mongoURL = process.env.MONGOURL; // Hidden API
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });

// Serve static files from the Vite/Svelte build output directory (dist)
app.use(express.static(path.join(__dirname, "../my-jeopardy-game/dist")));

// Catch-all route to serve the Svelte app's HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-jeopardy-game/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
