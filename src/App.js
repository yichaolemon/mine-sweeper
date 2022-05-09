import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Cell from './Cell';

/**
 * grid: 2D array, each cell is {clicked: bool, bomb: bool, flagged: bool}
 * dimension: (integer, integer)
 * bomb probability: integer
 */
function App(props) {
  const [rows, cols] = props.dimension;
  const initGrid = getNewEmptyGrid();
  const [grid, setGrid] = useState(initGrid);
  const [numClicks, setClicks] = useState(0);

  let isLost = false;
  let numExpanded = 0;
  let numFlags = 0;
  let numGoodCells = 0;
  grid.forEach((row) => row.forEach(({clicked, bomb, flagged}) => {
    if (clicked && bomb) {
      isLost = true;
    }
    if (clicked) {
      numExpanded++;
    }
    if (flagged) {
      numFlags++;
    }
    if (!bomb) {
      numGoodCells++;
    }
  }));
  const isWon = numExpanded === numGoodCells;

  function deepCopyGrid() {
    return grid.map((row) => row.map(({ clicked, bomb, flagged}) => ({clicked: clicked, bomb: bomb, flagged: flagged})));
  }

  function getNewEmptyGrid() {
    let newGrid = [];
    for (let i=0; i < rows; i++) {
      let row = new Array(cols);
      for (let j=0; j < cols; j++) {
        row[j] = {
          clicked: false,
          bomb: Math.random() <= props.bombProbability,
          flagged: false,
        };
      }
      newGrid.push(row);
    }
    return newGrid;
  }

  function getNeighbors(i, j) {
    let neighbors = [[i+1,j], [i-1,j], [i,j+1], [i,j-1], 
      [i+1,j+1], [i-1,j-1], [i+1,j-1], [i-1,j+1]];
    return neighbors.filter(([neigh_i, neigh_j]) => (neigh_i >= 0 && neigh_i < rows && neigh_j >= 0 && neigh_j < cols));
  }

  function countNeighborBombs(grid, i, j) {
    let cnt = 0;
    for (let [neigh_i, neigh_j] of getNeighbors(i, j)) {
      cnt += (grid[neigh_i][neigh_j].bomb ? 1 : 0);
    }
    return cnt;
  }

  function clickAtIndex(copyGrid, i, j) {
    if (copyGrid[i][j].clicked) {
      return;
    }
    copyGrid[i][j].clicked = true;
    if (countNeighborBombs(copyGrid, i, j) === 0 && !copyGrid[i][j].bomb) {
      for (let [neigh_i, neigh_j] of getNeighbors(i, j)) {
        clickAtIndex(copyGrid, neigh_i, neigh_j);
      }
    }
  }

  function handleCellClick(e, i, j) {
    let copyGrid = deepCopyGrid();

    if (e.type === "click") {
      clickAtIndex(copyGrid, i, j);
      setClicks(numClicks+1);
    } else {
      if (copyGrid[i][j].flagged) {
        copyGrid[i][j].flagged = false;
      } else {
        copyGrid[i][j].flagged = true;
      }
    }

    setGrid(copyGrid);
    e.preventDefault();
  }

  function handleGameReset() {
    let newGrid = getNewEmptyGrid();
    setGrid(newGrid);
    setClicks(0);
  }

  function renderRow(row, i) {
    let cells = row.map(({ clicked, bomb, flagged }, j) => 
      <Cell
        key={i*cols+j}
        clicked={clicked}
        bomb={bomb}
        flagged={flagged}
        neighborBombCount={countNeighborBombs(grid, i, j)}
        handleClick={(e) => handleCellClick(e, i, j)}
        isClickable={!isLost && !isWon}
      />);
    return (
      <div key={i} className="row">
        {cells}
      </div>
    );
  }

  function renderGrid() {
    return grid.map(renderRow);
  }

  function renderGameData() {
    return (
      <div className="game-data">
        <p>Clicks: {numClicks}</p>
        <p>Expanded: {numExpanded}</p>
        <p>Flags: {numFlags}</p>
      </div>
    );
  }

  function renderEndState(won) {
    let msg = (won ? "YOU WON!" : "YOU LOST! BOOM") + " Click 'reset' to start a new game!";
    return (
      <p className="game-end-message">{msg}</p>
    );
  }
  
  return (
    <div className="App">
      {renderGameData()}
      <button onClick={(() => handleGameReset())}>reset</button>
      {isWon ? renderEndState(true) : null}
      {isLost ? renderEndState(false) : null}
      <div className={isLost || isWon ? "finished-grid" : "grid"}>
        {renderGrid()}
      </div>
    </div>
  );
}

export default App;
