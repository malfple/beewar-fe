import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

class Navigation extends React.Component {
  renderButtons() {
    if(this.props.loggedIn) {
      return (
        <div>
          <Link to="/profile">Logged in user = {this.props.username}</Link>
        </div>
      )
    }

    return (
      <div>
        <Link to="/login">Login</Link>
      </div>
    )
  }

  render() {
    return (
      <div>
        This is navigation bar. <Link to="/">Home</Link>
        {this.renderButtons()}
        <hr />
      </div>
    )
  }
}

Navigation.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired
}

export default Navigation
