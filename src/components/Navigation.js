import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import * as api from '../api/api'

function Navigation(props) {
  function logout() {
    api.axiosCustom({
      method: 'POST',
      url: '/auth/logout'
    }).then(() => {
      props.onLogout()
    })
  }

  let userButtons = (
    <div>
      <Link to="/login">Login</Link>
    </div>
  )

  if(props.loggedIn) {
    userButtons = (
      <div>
        <div>Token: {props.token}</div>
        <Link to={`/profile/${props.username}`}>Logged in user = {props.username}</Link>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      This is navigation bar. <Link to="/">Home</Link>
      {userButtons}
      <hr />
    </div>
  )
}

Navigation.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default Navigation
