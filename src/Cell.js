import './App.css';

/**
 * clicked
 * bomb
 * flagged
 * handleClick
 */
function Cell(props) {

  function handleClick(e) {
    if (!props.isClickable) {
      console.log("Game is over, reset to start a new game");
      return;
    }
    props.handleClick(e);
  }

  function renderCell() {
    let clicked = props.clicked;
    let bomb = props.bomb;
    let flagged = props.flagged;
    let neighborBombCount = props.neighborBombCount;

    //console.log("clicked: " + clicked + ", bomb: " + bomb + ", flagged: " + flagged);
    if (clicked) {
      if (bomb) {
        return (
          <div className="cell exploded"></div>
        );
      } else {
        return (
          <div className="cell clicked">{neighborBombCount}</div>
        );
      }
    }

    if (flagged) {
      return (
        <div className="cell flagged" onContextMenu={handleClick}></div>
      );
    }

    return (
      <div className="cell plain" onClick={handleClick} onContextMenu={handleClick}></div>
    );
  }

  return renderCell();
}

export default Cell;