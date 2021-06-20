import React, {useContext, useEffect, useState} from 'react'
import {UserTokenContext} from '../context'
import {apiPing, apiServerStats} from '../modules/api/api'
import NormalLoadingSpinner from '../components/loading/NormalLoadingSpinner'
import logo from '../logo.svg'
import './Home.css'
import {Link} from 'react-router-dom'
import Button from '../components/forms/button/Button'

function Home() {
  const userToken = useContext(UserTokenContext)

  if(userToken.username !== '') { // logged in
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

  return (
    <div className="Home">
      <div className="Home__Content">
        <h1>Welcome to BeeWar!</h1>
        <h2>BeeWar is a tactical turn-based strategy game.</h2>
        <div>
          <Button theme="fill">
            <Link to="/register">Register</Link>
          </Button>
        </div>
        <div>
          <Button theme="hollow">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
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

export default Home
