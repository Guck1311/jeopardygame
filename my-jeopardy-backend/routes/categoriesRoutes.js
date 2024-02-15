const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Route to get all categories
router.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
      console.log("Got all categories")
    } catch (error) {
      res.status(500).json({ error: 'Error fetching categories', details: error });
    }
  });

// Route to create a new category
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category', details: error });
  }
});

// Route to get a specific category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category', details: error });
  }
});

// Route to update a category by ID
router.put('/categories/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error updating category', details: error });
  }
});

// Route to delete a category by ID
router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category', details: error });
  }
});

module.exports = router;