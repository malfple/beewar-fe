import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import logo from '../logo.svg';
import './App.css';

import Login from './auth/login'
import {APIRequest} from '../api/api'

// App is the root router

class App extends Component {
  render() {
    return (
      <div className="main">
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route exact path={"/login"} component={Login} />
        </Switch>
      </div>
    )
  }
}

function Home() {
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
    APIRequest(
      '',
      'GET',
      null
    ).then(() => {
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