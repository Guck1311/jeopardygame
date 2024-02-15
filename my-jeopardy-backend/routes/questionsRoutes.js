const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Route to get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
    console.log("Got all questions")
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions", details: error });
  }
});

// Route to add a new question
router.post("/questions", async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: "Error creating question", details: error });
  }
});

// Route to get a specific question by ID
router.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Error fetching question", details: error });
  }
});

// Route to update a question by ID
router.put("/questions/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: "Error updating question", details: error });
  }
});

// Route to delete a question by ID
router.delete("/questions/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting question", details: error });
  }
});

module.exports = router;