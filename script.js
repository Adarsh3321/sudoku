document.addEventListener('DOMContentLoaded', function() {
    const sudokuBoard = document.getElementById('sudoku-board');
    const restartButton = document.getElementById('restart-button');
    const timerDisplay = document.getElementById('timer');
    const numberBox = document.getElementById('number-box');
    const difficultySelect = document.getElementById('difficulty-select'); // Difficulty dropdown
  
    let timer;
    let timeElapsed = 0;
    let timerRunning = false;
    let selectedCell = null; // Store selected cell
    let selectedNumber = null; // Store selected number
    let filledCells = 0; // Track filled cells
    let difficulty = 'medium'; // Default difficulty
  
    // Function to generate random solvable Sudoku puzzle
    const generateSudoku = () => {
      const board = Array.from({ length: 9 }, () => Array(9).fill(0));
      solveSudoku(board);
      removeNumbers(board);  // Remove numbers based on difficulty
      return board;
    };
  
    // Function to solve the Sudoku (backtracking)
    const solveSudoku = (board) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            shuffleArray(numbers); // Shuffle to avoid pattern
  
            for (const num of numbers) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
  
                if (solveSudoku(board)) {
                  return true;
                }
  
                board[row][col] = 0; // Reset if no solution
              }
            }
            return false; // No valid number found
          }
        }
      }
      return true; // Solved
    };
  
    // Function to check if placing a number is valid
    const isValid = (board, row, col, num) => {
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
      }
  
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
  
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (board[i][j] === num) return false;
        }
      }
      return true;
    };
  
    // Function to shuffle an array (used for randomizing numbers)
    const shuffleArray = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
      }
    };
  
    // Function to remove numbers based on selected difficulty
    const removeNumbers = (board) => {
      let attempts = 0;
  
      // Adjust the difficulty level (number of cells to remove)
      switch (difficulty) {
        case 'easy':
          attempts = 40; // Easy - Remove fewer numbers
          break;
        case 'medium':
          attempts = 50; // Medium - Moderate removal
          break;
        case 'hard':
          attempts = 60; // Hard - Remove more numbers
          break;
      }
  
      let count = 0;
  
      // Remove random cells from the board
      while (count < attempts) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
  
        if (board[row][col] !== 0) {
          board[row][col] = 0;
          count++;
        }
      }
    };
  
    // Start timer
    const startTimer = () => {
      if (!timerRunning) {
        timerRunning = true;
        timer = setInterval(() => {
          timeElapsed++;
          timerDisplay.textContent = `Time: ${timeElapsed}s`;
        }, 1000);
      }
    };
  
    // Reset game (board + timer)
    const resetGame = () => {
      clearInterval(timer);
      timerRunning = false;
      timeElapsed = 0;
      filledCells = 0;
      selectedNumber = null; // Deselect the number or 'X'
      timerDisplay.textContent = `Time: 0s`;
      renderBoard();
      // Remove selected number from number pad
      const prevSelectedButton = document.querySelector('.number-button.selected');
      if (prevSelectedButton) {
        prevSelectedButton.classList.remove('selected');
      }
    };
  
    // Render Sudoku board
    const renderBoard = () => {
      const sudokuGrid = generateSudoku(); // Generate grid each time
  
      sudokuBoard.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
          let cell = document.createElement('td');
          if (sudokuGrid[i][j] !== 0) {
            cell.textContent = sudokuGrid[i][j];
            cell.classList.add('filled');
          } else {
            cell.addEventListener('click', function() {
              if (selectedNumber !== null && selectedNumber !== 'X') {
                // Fill cell with selected number
                cell.textContent = selectedNumber;
                cell.classList.add('filled');
                filledCells++;
  
                // Check if all cells are filled
                if (filledCells === 81) {
                  showWinnerPrompt();
                }
  
                startTimer(); // Start timer on first move
              } else if (selectedNumber === 'X' && selectedCell) {
                // Clear the selected cell if 'X' is selected
                cell.textContent = ''; // Clear the selected cell
                cell.classList.remove('filled'); // Remove filled class
                filledCells--; // Decrease filled cell count
                selectedNumber = null; // Deselect number
                // Remove any selection from the number pad
                const prevSelectedButton = document.querySelector('.number-button.selected');
                if (prevSelectedButton) {
                  prevSelectedButton.classList.remove('selected');
                }
              } else {
                // Highlight the selected cell
                if (selectedCell) {
                  selectedCell.classList.remove('selected');
                }
                selectedCell = cell;
                cell.classList.add('selected');
              }
            });
          }
          row.appendChild(cell);
        }
        sudokuBoard.appendChild(row);
      }
    };
  
    // Create number buttons for 1-9 and 'X' to clear
    const createNumberButtons = () => {
      for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('number-button');
        button.addEventListener('click', function() {
          // Deselect previously selected number
          const prevSelectedButton = document.querySelector('.number-button.selected');
          if (prevSelectedButton) {
            prevSelectedButton.classList.remove('selected');
          }
  
          // Select the new number
          button.classList.add('selected');
          selectedNumber = i;
        });
        numberBox.appendChild(button);
      }
  
      // Add 'X' button to clear selected cell
      const clearButton = document.createElement('button');
      clearButton.textContent = 'X';
      clearButton.classList.add('number-button');
      clearButton.addEventListener('click', function() {
        // Deselect any previously selected number or 'X'
        const prevSelectedButton = document.querySelector('.number-button.selected');
        if (prevSelectedButton) {
          prevSelectedButton.classList.remove('selected');
        }
  
        // Select the 'X' button
        clearButton.classList.add('selected');
        selectedNumber = 'X'; // Set selectedNumber to 'X' to clear cells
      });
      numberBox.appendChild(clearButton);
    };
  
    // Show winner prompt
    const showWinnerPrompt = () => {
      alert(`Congratulations! You completed the puzzle in ${timeElapsed} seconds.`);
    };
  
    // Restart button click event
    restartButton.addEventListener('click', resetGame);
  
    // Difficulty change event
    difficultySelect.addEventListener('change', function() {
      difficulty = difficultySelect.value; // Update difficulty based on selection
      resetGame(); // Reset the game when difficulty changes
    });
  
    // Initialize game
    createNumberButtons();
    renderBoard();
  });
  