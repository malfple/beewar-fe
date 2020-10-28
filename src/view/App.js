import React, {Component} from 'react'
import { Route, Switch } from 'react-router-dom'
import logo from '../logo.svg'
import './App.css'

import Login from './auth/Login'
import {APIRequest} from '../api/api'
import Navigation from '../components/Navigation'

// App is the root router

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: ''
    }

    this.onLogin = this.onLogin.bind(this)
  }

  onLogin(token) {
    console.log('App login ' + token)
    this.setState({
      token: token
    })
  }

  render() {
    return (
      <div className="main">
        <Navigation loggedIn={this.state.token !== ''} username={this.state.token} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" render={(props) => (<Login {...props} onLogin={this.onLogin} />)} />
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
