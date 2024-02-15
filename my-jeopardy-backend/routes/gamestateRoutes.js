const express = require("express");
const router = express.Router();
const GameState = require("../models/gamestate");
const gameTemplate = require("./gameTemplate");

// Express route to create a new game state with a custom ID
router.post("/create-game/:gameId", async (req, res) => {
  const gameId = req.params.gameId;

  // Check if gameId already exists in the database
  let gameState = await GameState.findOne({ gameId });

  if (gameState) {
    return res.status(409).json({ error: "Game ID already exists" });
  }

  // Create a new game state with the provided gameId and empty arrays for game categories and questions
  gameState = new GameState({ gameId, game: gameTemplate, status: false });

  try {
    await gameState.save(); // Save the game state in the database
    res.status(201).json(gameState);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating game state", details: error });
  }
});

// Express route to get a game state by ID
router.get("/game-state/:gameId", async (req, res) => {
  const gameId = req.params.gameId;

  try {
    const gameState = await GameState.findOne({ gameId });
    if (!gameState) {
      return res.status(404).json({ error: "Game state not found" });
    }
    res.json(gameState);
  } catch (error) {
    console.error("Error fetching game state:", error); // Log the error details
    res
      .status(500)
      .json({ error: "Error fetching game state", details: error });
  }
});

// Example route for hosting a game
router.post("/host-game/:gameId", (req, res) => {
  const gameId = req.params.gameId;
  // Logic to host a game using the provided gameId
  // Update game state or join players, etc.
  // Respond with success or failure messages
});

// Express route for updating game state
router.put("/update-game/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  const updatedState = req.body.game; // Update game state sent from the client
  const updatedStatus = req.body.status;
  try {
    // Find and update the game state in the database using gameId
    await GameState.findOneAndUpdate({ gameId }, { game: updatedState });
    await GameState.findOneAndUpdate({ gameId }, { status: updatedStatus });

    res.status(200).json({ message: "Game state updated successfully" });
  } catch (error) {
    console.error("Error updating game state:", error);
    res
      .status(500)
      .json({ error: "Error updating game state", details: error });
  }
});

module.exports = router;
