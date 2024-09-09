const cron = require('node-cron');
const { generateDailyPuzzle } = require('./server'); // Make sure the import path is correct

// Schedule a task to run at midnight every day to generate a new puzzle
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily puzzle generation task...');
  try {
    await generateDailyPuzzle();
    console.log('Daily puzzle generated successfully.');
  } catch (error) {
    console.error('Error during daily puzzle generation:', error.message);
  }
});


// messages: [{ role: 'system', content: 'You are generating a crossword puzzle for a grid size between 4x4 and 8x8. The words should be selected so they can fit together both across and down, like in a traditional crossword. Provide exactly the number of words that fit this size puzzle, along with their definitions. Return the words with grid positions and directions in the following format: { "words": [{ "word": "TEST", "definition": "An assessment.", "direction": "across", "row": 0, "col": 0 },{ "word": "TIME", "definition": "A measurable period.", "direction": "down", "row": 0, "col": 2 }]} Do not add any additional explanation outside this format.' }],