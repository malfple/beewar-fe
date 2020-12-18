import React, {useState} from 'react'
import PropTypes from 'prop-types'

import * as api from '../modules/api/api'

function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    api.requestLogin(username, password).then(res => {
      props.onLogin(res.data.token)
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
