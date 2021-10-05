import React, {useEffect, useState} from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import './MapGameView.css'

import jwt from 'jwt-decode'

import {apiAuthToken} from '../modules/api/auth'
import {UserTokenContext} from '../context'

import RouteWithoutLogin from '../components/route/RouteWithoutLogin'
import RouteWithLogin from '../components/route/RouteWithLogin'
import Login from './Login'
import Navigation from '../components/navigation/Navigation'
import Profile from './Profile'
import Map from './map/Map'
import Game from './game/Game'
import NotFound from './NotFound'
import Register from './Register'
import About from './About'
import How2Play from './How2Play'
import Leaderboard from './Leaderboard'
import Wiki from './Wiki'
import Changelog from './Changelog'
import Home from './Home'
import Campaign from './campaign/Campaign'

// App is the root router

function App(props) {
  const [state, setState] = useState({
    username: null, // null for first time loading
    userID: 0,
    token: '', // access token
  })

  useEffect(() => {
    checkTokenAndRefresh().catch(() => {
      // do nothing
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function checkTokenAndRefresh() {
    return new Promise((resolutionFunc, rejectionFunc) => {
      // only start request if token is '' or already expired
      if(state.token !== '' && Date.now() + 10 < jwt(state.token).exp * 1000) {
        resolutionFunc()
        return
      }
      rejectionFunc()
      // check if there is refresh token and if it's valid
      apiAuthToken().then(res => {
        // refresh token is valid, and we get access token
        const tokenDecoded = jwt(res.data.token)
        setState({
          username: tokenDecoded.sub,
          userID: tokenDecoded.user_id,
          token: res.data.token,
        })
      }).catch(err => {
        // refresh token is invalid
        setState({
          username: '',
          userID: 0,
          token: '',
        })
      })
    })
  }

  function onLogin(token) {
    const tokenDecoded = jwt(token)
    console.log(`App login ${tokenDecoded.sub}, user_id ${tokenDecoded.user_id} token: ${token}`)
    setState({
      username: tokenDecoded.sub,
      userID: tokenDecoded.user_id,
      token: token,
    })
  }

  function onLogout() {
    console.log('Logout')
    setState({
      username: '',
      userID: 0,
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
        userID: state.userID,
        token: state.token,
        checkTokenAndRefresh: checkTokenAndRefresh,
      }}>
        <Navigation onLogout={onLogout} />
        <div className="main__content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <RouteWithoutLogin path="/login">
              <Login onLogin={onLogin} />
            </RouteWithoutLogin>
            <RouteWithoutLogin path="/register">
              <Register />
            </RouteWithoutLogin>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/leaderboard">
              <Leaderboard />
            </Route>
            <Route path="/map">
              <Map />
            </Route>
            <RouteWithLogin path="/game">
              <Game />
            </RouteWithLogin>
            <RouteWithLogin path="/campaign">
              <Campaign />
            </RouteWithLogin>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/changelog">
              <Changelog />
            </Route>
            <Route path="/how2play">
              <How2Play />
            </Route>
            <Route path="/wiki">
              <Wiki />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </UserTokenContext.Provider>
    </div>
  )
}

export default App
