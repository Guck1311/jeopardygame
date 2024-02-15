const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    // category: {
    //   type: String,
    //   required: true,
    // },
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
  });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;