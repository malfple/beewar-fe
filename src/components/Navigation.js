import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import * as api from '../modules/api/api'
import {UserTokenContext} from '../context'

function Navigation(props) {
  const userToken = useContext(UserTokenContext)
  console.log('re-render navigation bar ', userToken)

  function logout() {
    api.axiosCustom({
      method: 'POST',
      url: '/api/auth/logout',
    }).then(() => {
      props.onLogout()
    })
  }

  let userButtons = (
    <div>
      <Link to="/login">Login</Link>
    </div>
  )

  if(userToken.username !== '') { // logged-in
    userButtons = (
      <div>
        <div>
          <Link to={`/profile/${userToken.username}`}>Logged in user = {userToken.username}</Link>
        </div>
        <div>
          My Games
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
      <hr />
    </div>
  )
}

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default Navigation
