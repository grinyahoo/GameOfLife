import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 100,
      interval: {},
      rows: 30,
      cols: 30,
      generation: 0,
      grid: Array(30).fill(Array(30).fill(false))
    };
  }

  arrayDeepCopy = arr => {
    return JSON.parse(JSON.stringify(arr));
  };

  selectBox = (row, col) => {
    let newGrid = this.arrayDeepCopy(this.state.grid);
    newGrid[row][col] = !newGrid[row][col];
    this.setState({ grid: newGrid });
  };

  playRandom = () => {
    let newGrid = Array(this.state.rows).fill(
      Array(this.state.cols).fill(false)
    );
    newGrid = newGrid.map(row => {
      return row.map(col => {
        return Math.random() - 0.5 > 0;
      });
    });
    this.setState({ grid: newGrid });
  };

  checkGameOver = async (g1, g2) => {
    if (JSON.stringify(g1) == JSON.stringify(g2)) {
      this.stopGame();
    }
  };

  nextGen = () => {
    const { grid, generation } = this.state;
    let newGrid = this.arrayDeepCopy(grid);
    for (let i = 0; i < this.state.rows; i++)
      for (let j = 0; j < this.state.cols; j++) {
        newGrid[i][j] = this.liveOrDie(i, j);
      }

    this.checkGameOver(grid, newGrid);
    this.setState({ grid: newGrid, generation: generation + 1 });
  };

  liveOrDie = (row, col) => {
    const { grid } = this.state;
    let context = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) continue;
        try {
          context.push(grid[row + i][col + j]);
        } catch (error) {}
      }
    }

    switch (context.filter(box => box === true).length) {
      case 2:
        return grid[row][col] === true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  clear = () => {
    let newGrid = this.arrayDeepCopy(this.state.grid);
    newGrid = newGrid.map(row => {
      return row.map(col => {
        return false;
      });
    });
    this.setState({ grid: newGrid, generation: 0 });
  };

  stopGame = () => {
    clearInterval(this.state.interval);
  };

  startGame = () => {
    this.setState({ interval: setInterval(this.nextGen, this.state.speed) });
  };

  handleChange = event => {
    this.stopGame();
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.playRandom();
  }

  render() {
    return (
      <div className="d-flex flex-column h-100 justify-content-center align-content-center">
        <div className="position-absolute my-auto" style={{ left: 0 }}>
          <ul className="list-group">
            <li className="list-group-item">
              <h2 className="text-dark">Game of Life</h2>
            </li>
            <li className="list-group-item">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{ width: 100 }}>
                    Speed (ms)
                  </span>
                </div>
                <input
                  id="speed"
                  type="number"
                  name="speed"
                  className="form-control"
                  value={this.state.speed}
                  onChange={this.handleChange}
                  style={{ width: 80 }}
                  step="10"
                />
              </div>
            </li>
            <li className="list-group-item">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{ width: 100 }}>
                    Rows
                  </span>
                </div>
                <input
                  id="rows"
                  type="number"
                  name="rows"
                  className="form-control"
                  value={this.state.rows}
                  onChange={this.handleChange}
                  style={{ width: 80 }}
                  disabled
                />
              </div>
            </li>
            <li className="list-group-item">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{ width: 100 }}>
                    Columns
                  </span>
                </div>
                <input
                  id="cols"
                  type="number"
                  name="cols"
                  className="form-control"
                  value={this.state.cols}
                  onChange={this.handleChange}
                  style={{ width: 80 }}
                  disabled
                />
              </div>
            </li>
            <li className="list-group-item">
              <div className="text-muted px-1">
                Generation{" "}
                <div className="float-right text-right">
                  {this.state.generation}
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <button
                className="btn btn-success cursor-pointer w-100"
                onClick={this.startGame}
              >
                Play
              </button>
            </li>
            <li className="list-group-item">
              <button
                className="btn btn-danger cursor-pointer w-100"
                onClick={this.stopGame}
              >
                Stop
              </button>
            </li>
            <li className="list-group-item">
              <button
                className="btn btn-secondary cursor-pointer w-100"
                onClick={this.playRandom}
              >
                Random
              </button>
            </li>
            <li className="list-group-item">
              <button
                className="btn btn-secondary cursor-pointer w-100"
                onClick={this.clear}
              >
                Clear
              </button>
            </li>
          </ul>
        </div>
        <div className="d-flex justify-content-center">
          <Grid
            cols={this.state.cols}
            grid={this.state.grid}
            rows={this.state.rows}
            selectBox={this.selectBox}
          />
        </div>
      </div>
    );
  }
}

class Box extends React.Component {
  render() {
    const defaultClass = " d-flex box";
    const statusClass = this.props.status ? " on " : " off ";
    return (
      <div
        className={defaultClass + statusClass + this.props.boxClass}
        onClick={this.props.selectBox.bind(
          this,
          this.props.row,
          this.props.col
        )}
      />
    );
  }
}

class Grid extends React.Component {
  render() {
    const renderGrid = this.props.grid.map((row, i) => {
      const gridRow = row.map((col, j) => {
        return (
          <Box
            key={i + "_" + j}
            row={i}
            col={j}
            status={col}
            selectBox={this.props.selectBox.bind(this)}
          />
        );
      });
      return <div className="d-flex flex-row flew-wrap">{gridRow}</div>;
    });

    return <div className="d-flex flex-column shadow">{renderGrid}</div>;
  }
}
