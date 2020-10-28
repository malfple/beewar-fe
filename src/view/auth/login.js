import React from 'react'
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
      username: this.state.username,
    }).then(res => {
      console.log(res.status)
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
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default Login
