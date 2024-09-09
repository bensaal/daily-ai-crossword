const mongoose = require('mongoose');

const PuzzleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  grid: { type: Array, required: true },
  clues: { type: Object, required: true },
  solution: { type: Array, required: true }
});

module.exports = mongoose.model('Puzzle', PuzzleSchema);
