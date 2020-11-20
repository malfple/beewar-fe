import React, {useEffect, useState} from 'react'
import { Route, Switch } from 'react-router-dom'
import logo from '../logo.svg'
import './App.css'

import jwt from 'jwt-decode'

import * as api from '../api/api'
import {UserTokenContext} from '../context'

import RouteWithoutLogin from '../components/route/RouteWithoutLogin'
import RouteWithLogin from '../components/route/RouteWithLogin'
import Login from './Login'
import Navigation from '../components/Navigation'
import Profile from './Profile'
import Map from './map/Map'
import Game from './game/Game'
import NotFound from './NotFound'

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
      <UserTokenContext.Provider value={state} >
        <Navigation onLogout={onLogout} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <RouteWithoutLogin path="/login">
            <Login onLogin={onLogin} />
          </RouteWithoutLogin>
          <Route path="/profile/:username">
            <Profile />
          </Route>
          <Route path="/map">
            <Map />
          </Route>
          <RouteWithLogin path="/game">
            <Game />
          </RouteWithLogin>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </UserTokenContext.Provider>
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
