import React, {useContext, useEffect, useState} from 'react'
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
import {axiosCustom} from '../api/api'

// App is the root router

function App(props) {
  const [state, setState] = useState({
    username: null, // null for first time loading
    token: '', // access token
  })

  useEffect(() => {
    refreshTheToken()
  }, [])

  function refreshTheToken() {
    // check if there is refresh token and if it's valid
    api.axiosCustom({
      method: 'POST',
      url: '/auth/token',
    }).then(res => {
      // refresh token is valid, and we get access token
      setState({
        username: jwt(res.data.token).sub,
        token: res.data.token,
      })
    }).catch(err => {
      // refresh token is invalid
      setState({
        username: '',
        token: '',
      })
    })
  }

  function onLogin(username, token) {
    console.log(`App login ${username}, token: ${token}`)
    setState({
      username: username,
      token: token,
    })
  }

  function onLogout() {
    console.log('Logout')
    setState({
      username: '',
      token: '',
    })
  }

  if(state.username === null) {
    return (
      <div />
    )
  }

  return (
    <div className="main">
      <UserTokenContext.Provider value={{
        username: state.username,
        token: state.token,
        refreshTheToken: refreshTheToken,
      }}>
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
      <ServerStats />
      <PingTest />
    </div>
  )
}

function ServerStats() {
  const userToken = useContext(UserTokenContext)

  const [state, setState] = useState({
    hub_count: 0,
    session_count: 0,
  })

  useEffect(() => {
    axiosCustom.get('/server_stats').then(res => {
      setState({
        hub_count: res.data.hub_count,
        session_count: res.data.session_count,
      })
    })
  }, [userToken.username])

  return (
    <div>
      <div>
        Active game hubs: {state.hub_count} hubs
      </div>
      <div>
        Logged-in users: {state.session_count} users
      </div>
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
