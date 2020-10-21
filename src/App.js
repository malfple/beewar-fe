import React from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <PingTest />
    </div>
  );
}

class PingTest extends React.Component {
  handlePing(e) {
    e.preventDefault()
    console.log("ping!")
    axios({
      method: "GET",
      url: "http://localhost:3001",
    }).then(() => {
      console.log("pong!")
    }).catch(err => {
      console.log("be server ded!")
    })
  }

  render() {
    return (
      <button onClick={this.handlePing.bind(this)}>
        ping the server
      </button>
    )
  }
}

export default App;
