import React, {useState} from 'react'
import PropTypes from 'prop-types'

import * as api from '../api/api'

function Login(props) {
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')

  function handleSubmit(e) {
    const localUsername = username
    api.requestLogin(localUsername, password).then(res => {
      props.onLogin(localUsername, res.data.token)
    })
    e.preventDefault()
  }

  return (
    <div>
      login
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Login" />
      </form>
    </div>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default Login
