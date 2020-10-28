import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

class Navigation extends React.Component {
  renderButtons() {
    if(this.props.loggedIn) {
      return (
        <div>
          Logged in user = {this.props.username}
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
