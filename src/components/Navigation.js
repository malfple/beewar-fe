import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

function Navigation(props) {
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
  username: PropTypes.string.isRequired
}

export default Navigation
