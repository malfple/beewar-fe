import React, {Component} from 'react'
import { Route, Switch } from 'react-router-dom'
import logo from '../logo.svg'
import './App.css'

import Login from './Login'
import {APIRequest} from '../api/api'
import Navigation from '../components/Navigation'
import Profile from './Profile'

// App is the root router

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      token: ''
    }

    this.onLogin = this.onLogin.bind(this)
  }

  onLogin(username, token) {
    console.log('App login ' + username + ', token: ' + token)
    this.setState({
      username: username,
      token: token
    })
  }

  render() {
    return (
      <div className="main">
        <Navigation loggedIn={this.state.username !== ''} username={this.state.username} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" render={(props) => (<Login {...props} onLogin={this.onLogin} />)} />
          <Route exact path="/profile" render={(props) => (<Profile {...props} username={this.state.username} />)} />
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
  )
}

class PingTest extends React.Component {
  handlePing(e) {
    e.preventDefault()
    console.log('ping!')
    APIRequest(
      '',
      'GET',
      null
    ).then(() => {
      console.log('pong!')
    }).catch(err => {
      console.log('be server ded!')
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

export default App
