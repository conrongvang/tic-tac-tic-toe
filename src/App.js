import React from 'react';
import './App.css';
import Board from './components/Board';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      css: "square",
    };
  }
  shouldComponentUpdate() {
    return true
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || this.calculateWinner(squares) || this.calculateDraw(squares)) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({      
      history: history.concat([{squares: squares,}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    }, () => {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      console.log("xxxx", this.calculateWinner(squares))
      if (this.calculateWinner(squares)) {
        this.setState({
          css: "square-win"
        })
      }
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  reset() {
    const history = [{squares: Array(9).fill(null),}];
    const stepNumber = 0;
    this.setState({
      history: history,
      xIsNext: this.state.xIsNext ? true : !this.state.xIsNext,
      stepNumber: stepNumber,
    });
  }
  calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 7],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // const css = "square-win";
        // this.setState({
        //   css: css,
        // });
        return squares[a];
      }
    }
    return null;
  }
  calculateDraw(squares) {
    let count = 0;
    let draw = true;
    squares.forEach((square, index) => {
      if (square !== null)  count++;
    });
    if (count === 9)  return draw;
    return null;
  }
  status(squares) {
    const winner = this.calculateWinner(squares);
    let status = "";
    if (winner)
      status = "Winner: " + winner;
    else if (this.calculateDraw(squares))
      status = "Draw";
    else
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    return status;
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const status = this.status(current.squares);
    // const {hightlight} = this.calculateWinner(current.squares);
    return (
      <div className="game">
        <div className="game-board">
          <Board square={this.state.css} squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <button onClick={() => this.reset()}>Reset</button>
          <ol>
            {
              history.map((step, move) => {
                const desc = move ? ("Go to move #" + move) : "Go to start game";
                return (
                  <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                  </li>
                );
              })
            }
          </ol>
        </div>
      </div>
    );
  }
}

export default App;
