const OpenAI = require('openai');

// This class will handle crossword layout generation
class CrosswordLayout {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(' '));
    this.clues = [];
  }

  canPlaceWord(word, row, col, direction) {
    const wordLength = word.length;

    if (direction === 'across') {
      if (col + wordLength > this.gridSize) return false;
      for (let i = 0; i < wordLength; i++) {
        if (this.grid[row][col + i] !== ' ' && this.grid[row][col + i] !== word[i]) {
          return false;
        }
      }
    } else if (direction === 'down') {
      if (row + wordLength > this.gridSize) return false;
      for (let i = 0; i < wordLength; i++) {
        if (this.grid[row + i][col] !== ' ' && this.grid[row + i][col] !== word[i]) {
          return false;
        }
      }
    }

    return true;
  }

  placeWord(word, row, col, direction) {
    const wordLength = word.length;
    if (direction === 'across') {
      for (let i = 0; i < wordLength; i++) {
        this.grid[row][col + i] = word[i];
      }
    } else if (direction === 'down') {
      for (let i = 0; i < wordLength; i++) {
        this.grid[row + i][col] = word[i];
      }
    }
  }

  generate(words) {
    const directions = ['across', 'down'];
    let clueNumber = 1;

    words.forEach(({ word, definition, direction, row, col }) => {
      if (this.canPlaceWord(word, row, col, direction)) {
        this.placeWord(word, row, col, direction);
        this.clues.push({
          number: clueNumber++,
          word,
          definition,
          direction,
          row,
          col,
        });
      } else {
        console.warn(`Failed to place word: ${word}`);
      }
    });
  }

  getLayout() {
    return this.grid;
  }

  getClues() {
    return this.clues;
  }
}

// Function to generate the crossword puzzle using OpenAI
async function generateCrosswordUsingOpenAI() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // The OpenAI API request to generate words for the crossword puzzle
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // or any model you'd like to use
      messages: [
        {
          role: 'system',
          content: `You are generating a crossword puzzle for a grid size between 4x4 and 8x8. The words should be selected so they can fit together both across and down, like in a traditional crossword. Provide exactly the number of words that fit this size puzzle, along with their definitions. Return the words with grid positions and directions in the following format: { "words": [{ "word": "TEST", "definition": "An assessment.", "direction": "across", "row": 0, "col": 0 }, { "word": "TIME", "definition": "A measurable period.", "direction": "down", "row": 0, "col": 2 }]}. Do not add any additional explanation outside this format.`,
        },
      ],
      max_tokens: 500,
    });

    const puzzleData = JSON.parse(response.choices[0].message.content); // Parse the response from OpenAI
    const words = puzzleData.words;

    // Generate the crossword puzzle layout
    const gridSize = Math.floor(Math.random() * (8 - 4 + 1)) + 4; // Random size between 4x4 and 8x8
    const crossword = new CrosswordLayout(gridSize);

    crossword.generate(words);

    return {
      layout: crossword.getLayout(),
      solution: crossword.getLayout(),
      clues: crossword.getClues(),
    };
  } catch (error) {
    console.error('Error generating crossword puzzle with OpenAI:', error.response ? error.response.data : error.message);
    return null;
  }
}

module.exports = {
  generateCrosswordUsingOpenAI,
};
