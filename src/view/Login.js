import React from 'react'
import PropTypes from 'prop-types'

import * as api from '../api/api'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(e) {
    const value = e.target.value
    const name = e.target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit(e) {
    const username = this.state.username
    api.requestLogin(username).then(res => {
      this.props.onLogin(username, res.data.token)
    })
    e.preventDefault()
  }

  render() {
    return (
      <div>
        login
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" onChange={this.handleInputChange} />
          </label>
          <input type="submit" value="Login" />
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default Login
