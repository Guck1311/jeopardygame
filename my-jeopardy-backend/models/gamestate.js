const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Template", "Unsaved", "Unfinished", "Completed"],
    default: "Template",
  },
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Template", "Unsaved", "Unfinished", "Completed"],
    default: "Template",
  },
  questions: [questionSchema], // Subdocument array of questions
});

const gameStateSchema = new mongoose.Schema({
  gameId: String,
  game: [categorySchema], // Array of categories containing questions
  status: Boolean,
});

const GameState = mongoose.model("GameState", gameStateSchema);

module.exports = GameState;
