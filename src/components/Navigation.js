import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {UserTokenContext} from '../context'
import {apiAuthLogout} from '../modules/api/auth'

function Navigation(props) {
  const userToken = useContext(UserTokenContext)
  console.log('re-render navigation bar ', userToken)

  function logout() {
    apiAuthLogout().then(() => {
      props.onLogout()
    })
  }

  let userButtons = (
    <div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
    </div>
  )

  if(userToken.username !== '') { // logged-in
    userButtons = (
      <div>
        <div>
          <Link to={`/profile/${userToken.username}`}>Logged in user = {userToken.username}</Link>
        </div>
        <div>
          <Link to="/game/my_games">My Games</Link>
        </div>
        <div>
          <Link to="/game/list">Open Games</Link>
        </div>
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      This is navigation bar.
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/map/list">Maps</Link>
      </div>
      {userButtons}
      <div>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
      <div>
        <Link to="/about">About</Link>
      </div>
      <div>
        <Link to="/how2play">How to Play</Link>
      </div>
      <hr />
    </div>
  )
}

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default Navigation
