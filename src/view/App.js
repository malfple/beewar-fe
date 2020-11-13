import React, {useEffect, useState} from 'react'
import { Route, Switch } from 'react-router-dom'
import logo from '../logo.svg'
import './App.css'

import jwt from 'jwt-decode'

import RouteWithoutLogin from '../components/route/RouteWithoutLogin'
import Login from './Login'
import * as api from '../api/api'
import Navigation from '../components/Navigation'
import Profile from './Profile'
import Map from './map/Map'

// App is the root router

function App(props) {
  let [state, setState] = useState({
    username: '',
    token: '' // access token
  })

  useEffect(() => {
    // check if there is refresh token and if it's valid
    api.axiosCustom({
      method: 'POST',
      url: '/auth/token'
    }).then(res => {
      // refresh token is valid, and we get access token
      setState({
        username: jwt(res.data.token).sub,
        token: res.data.token
      })
    }).catch(err => {
      // refresh token is invalid
    })
  }, [])

  function onLogin(username, token) {
    console.log('App login ' + username + ', token: ' + token)
    setState({
      username: username,
      token: token
    })
  }

  function onLogout() {
    console.log('Logout')
    setState({
      username: '',
      token: ''
    })
  }

  return (
    <div className="main">
      <Navigation loggedIn={state.username !== ''} username={state.username} token={state.token} onLogout={onLogout} />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <RouteWithoutLogin path="/login" isLoggedIn={state.username !== ''}>
          <Login onLogin={onLogin} />
        </RouteWithoutLogin>
        <Route path="/profile/:username">
          <Profile />
        </Route>
        <Route path="/map">
          <Map />
        </Route>
      </Switch>
    </div>
  )
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

function PingTest() {
  function handlePing(e) {
    e.preventDefault()
    console.log('ping!')
    api.axiosCustom.get('/').then(() => {
      console.log('pong!')
    }).catch(err => {
      console.log('be server ded!')
    })
  }

  return (
    <button onClick={handlePing}>
      ping the server
    </button>
  )
}

export default App
