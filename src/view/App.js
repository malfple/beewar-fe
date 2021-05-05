import React, {useContext, useEffect, useState} from 'react'
import { Route, Switch } from 'react-router-dom'
import logo from '../logo.svg'
import './App.css'

import jwt from 'jwt-decode'

import {apiPing, apiServerStats} from '../modules/api/api'
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
import Wiki from './wiki/Wiki'
import NormalLoadingSpinner from '../components/loading/NormalLoadingSpinner'

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
          <Route path="/about">
            <About />
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
      </UserTokenContext.Provider>
    </div>
  )
}

function Home() {
  return (
    <div className="App">
      <h1>BeeWar</h1>
      <h2>
        Check the navigation bar haha
      </h2>
      <ServerStats />
      <PingTest />
      <ReactHome show={false} />
    </div>
  )
}

function ServerStats() {
  const userToken = useContext(UserTokenContext)

  const [state, setState] = useState({
    hub_count: 0,
    session_count: 0,
    server_start_time: 0,
    cnt: -1, // to trigger re-render
  })

  useEffect(() => {
    let intervalClock = null

    apiServerStats().then(res => {
      setState({
        hub_count: res.data.hub_count,
        session_count: res.data.session_count,
        server_start_time: res.data.server_start_time,
        cnt: 0,
      })

      intervalClock = setInterval(() => {
        setState(prevState => ({
            hub_count: prevState.hub_count,
            session_count: prevState.session_count,
            server_start_time: prevState.server_start_time,
            cnt: prevState.cnt + 1,
          }))
      }, 1000)
    })

    return function cleanup() {
      if(intervalClock) {
        clearInterval(intervalClock)
      }
    }
  }, [userToken.username])

  if(state.cnt === -1) {
    // server dead
    return (
      <NormalLoadingSpinner />
    )
  }

  let epoch = Math.floor(Date.now() / 1000) - state.server_start_time
  const seconds = epoch % 60
  epoch = Math.floor(epoch / 60)
  const minutes = epoch % 60
  epoch = Math.floor(epoch / 60)
  const hours = epoch

  return (
    <div>
      <div>
        Active game hubs: {state.hub_count} hubs
      </div>
      <div>
        Logged-in users: {state.session_count} users
      </div>
      <div>
        Time since start: {hours} hour(s), {minutes} minute(s), {seconds} second(s)
      </div>
    </div>
  )
}

function PingTest() {
  const [pings, setPings] = useState('')
  const [counter, setCounter] = useState(0)

  function handlePing(e) {
    e.preventDefault()
    console.log(`ping! to BE: ${process.env.REACT_APP_BE_SERVER_URL}`)
    setCounter(prevCounter => prevCounter + 1)
    apiPing().then(() => {
      console.log('pong!')
      setPings(prevPings => `${prevPings} pong!`)
    }).catch(err => {
      console.log('be server ded!')
    })
  }

  return (
    <div>
      <button onClick={handlePing}>
        {counter < 10 ? 'ping the server' : 'ping the server, but dont spam pls'}
      </button>
      <div>
        {pings}
      </div>
    </div>
  )
}

// the included react home page. no longer used
function ReactHome(props) {
  if(!props.show) {
    return null
  }

  return (
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
  )
}

export default App
