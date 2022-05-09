import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Cell from './Cell';

/**
 * grid: 2D array, each cell is {clicked: bool, bomb: bool, flagged: bool}
 * dimension: (integer, integer)
 * num_bombs: integer
 */
function App(props) {
  const [rows, cols] = props.dimension;
  const bombProbability = props.numBombs / (rows * cols);
  let initGrid = [];
  for (let i=0; i < rows; i++) {
    let row = new Array(cols);
    for (let j=0; j < cols; j++) {
      row[j] = {
        clicked: false,
        bomb: Math.random() <= bombProbability,
        flagged: false,
      };
    }
    initGrid.push(row);
  }

  const [grid, setGrid] = useState(initGrid);
  const [numClicks, setClicks] = useState(0);
  const [numFlags, setFlags] = useState(0);
  const [numExpanded, setExpanded] = useState(0);

  function deepCopyGrid() {
    return grid.map((row) => row.map(({ clicked, bomb, flagged}) => ({clicked: clicked, bomb: bomb, flagged: flagged})));
  }

  function countNeighborBombs(i, j) {
    let neighbors = [[i+1,j], [i-1,j], [i,j+1], [i,j-1], 
      [i+1,j+1], [i-1,j-1], [i+1,j-1], [i-1,j+1]];
    let cnt = 0;
    for (let c=0; c<8; c++) {
      let [neigh_i, neigh_j] = neighbors[c];
      if (neigh_i >= 0 && neigh_i < rows && neigh_j >= 0 && neigh_j < cols) {
        cnt += (grid[neigh_i][neigh_j].bomb ? 1 : 0);
      }
    }
    return cnt;
  }

  function handleCellClick(e, i, j) {
    let copyGrid = deepCopyGrid();

    if (e.type === "click") {
      copyGrid[i][j].clicked = true;
      setClicks(numClicks+1);
      setExpanded(numExpanded+1);
    } else {
      if (copyGrid[i][j].flagged) {
        copyGrid[i][j].flagged = false;
        setFlags(numFlags-1);
      } else {
        copyGrid[i][j].flagged = true;
        setFlags(numFlags+1);
      }
    }

    setGrid(copyGrid);
    e.preventDefault();
  }

  function renderRow(row, i) {
    let cells = row.map(({ clicked, bomb, flagged }, j) => 
      <Cell
        key={i*cols+j}
        clicked={clicked}
        bomb={bomb}
        flagged={flagged}
        neighborBombCount={countNeighborBombs(i, j)}
        handleClick={(e) => handleCellClick(e, i, j)}
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
  
  return (
    <div className="App">
      {renderGameData()}
      {renderGrid()}
    </div>
  );
}

export default App;
