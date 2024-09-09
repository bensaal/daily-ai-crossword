require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { generateCrosswordUsingOpenAI } = require('./crosswordGenerator');
const Puzzle = require('./models/Puzzle');

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to generate the daily puzzle
async function generateDailyPuzzle() {
  try {
    console.log(`Generating puzzle for ${new Date().toISOString().split('T')[0]}`);

    const puzzleLayout = await generateCrosswordUsingOpenAI();
    if (!puzzleLayout) throw new Error("Failed to generate crossword.");

    const puzzle = new Puzzle({
      date: new Date(),
      layout: puzzleLayout.layout,
      solution: puzzleLayout.solution,
      clues: puzzleLayout.clues,
    });

    await puzzle.save();
    console.log('Daily puzzle generated and saved.');

    // Output the generated puzzle for validation
    console.log('Generated Puzzle Layout:', puzzleLayout.layout);
    console.log('Generated Puzzle Clues:', puzzleLayout.clues);
  } catch (error) {
    console.error('Error generating puzzle:', error.message);
  }
}

// API to get today’s puzzle
app.get('/api/puzzle/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const puzzle = await Puzzle.findOne({ date: today });
  if (puzzle) {
    res.json(puzzle);
  } else {
    res.status(404).json({ message: 'Puzzle not found' });
  }
});


// API to submit puzzle answers
app.post('/api/puzzle/submit', async (req, res) => {
  const { answers } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const puzzle = await Puzzle.findOne({ date: today });
  if (puzzle) {
    const isComplete = checkAnswers(answers, puzzle.solution);
    res.json({ isComplete });
  } else {
    res.status(404).json({ message: 'Puzzle not found' });
  }
});

function checkAnswers(userAnswers, solution) {
  return JSON.stringify(userAnswers) === JSON.stringify(solution);
}

// Start server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  generateDailyPuzzle(); // Generate the daily puzzle when the server starts
});
