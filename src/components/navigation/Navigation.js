import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {UserTokenContext} from '../../context'
import {apiAuthLogout} from '../../modules/api/auth'
import './Navigation.css'
import Nav from './Nav'
import logo from './logo.png'

function Navigation(props) {
  const userToken = useContext(UserTokenContext)
  console.log('re-render navigation bar ', userToken)

  function logout() {
    apiAuthLogout().then(() => {
      props.onLogout()
    })
  }

  const userLoggedIn = userToken.username !== ''

  return (
    <header>
      <div className="navbar">
        <Nav show={true}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </Nav>
        <div className="navbar__navs">
          <Nav show={!userLoggedIn}><Link to="/login">Login</Link></Nav>
          <Nav show={!userLoggedIn}><Link to="/register">Register</Link></Nav>
          <Nav show={userLoggedIn}><Link to={`/profile/${userToken.username}`}>{userToken.username} (My Profile)</Link></Nav>
          <Nav show={userLoggedIn}><div onClick={logout}>Logout</div></Nav>
        </div>
      </div>
      <div className="navbar">
        <div className="navbar__navs--centered">
          <Nav show={true}><Link to="/map/list">Maps</Link></Nav>
          <Nav show={userLoggedIn}><Link to="/game/list">Open Games</Link></Nav>
          <Nav show={userLoggedIn}><Link to="/game/my_games">My Games</Link></Nav>
          <Nav show={true}><Link to="/leaderboard">Leaderboard</Link></Nav>
          <Nav show={true}><Link to="/about">About</Link></Nav>
          <Nav show={true}><Link to="/how2play">How to Play</Link></Nav>
        </div>
      </div>
    </header>
  )
}

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default Navigation
