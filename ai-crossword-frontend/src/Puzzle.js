import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Puzzle = () => {
  const [puzzle, setPuzzle] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    axios.get('/api/puzzle/today')
      .then(response => {
        setPuzzle(response.data);
      })
      .catch(error => {
        console.error('Error fetching the puzzle:', error);
      });
  }, []);
  

  const handleChange = (row, col, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [`${row}-${col}`]: value.toUpperCase()
    }));
  };

  const handleSubmit = () => {
    axios.post('/api/puzzle/submit', { answers: userAnswers })
      .then(response => {
        alert(response.data.isComplete ? 'Puzzle complete!' : 'Some answers are incorrect.');
      })
      .catch(error => {
        console.error('Error submitting the puzzle:', error);
      });
  };

  if (!puzzle) return <div>Loading...</div>;

  return (
    <div>
      <h1>Today's Crossword Puzzle</h1>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${puzzle.layout.length}, 1fr)`, gap: '5px' }}>
        {puzzle.layout.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              style={{ width: '30px', height: '30px', textAlign: 'center' }}
              value={userAnswers[`${rowIndex}-${colIndex}`] || ''}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              maxLength={1}
            />
          ))
        )}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      <div>
        <h2>Clues</h2>
        <ul>
          {puzzle.clues.map(clue => (
            <li key={clue.number}>
              <strong>{clue.number} ({clue.direction}):</strong> {clue.definition}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Puzzle;
