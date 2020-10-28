import React from 'react'
import PropTypes from 'prop-types'

import {APIRequestForm} from '../../api/api'

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
    APIRequestForm('/auth/login', 'POST', {
      username: this.state.username
    }).then(res => {
      this.props.onLogin(res.data.token)
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
