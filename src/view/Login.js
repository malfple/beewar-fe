import React, {useState} from 'react'
import PropTypes from 'prop-types'

import {apiAuthLogin} from '../modules/api/auth'

function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    apiAuthLogin(username, password).then(res => {
      props.onLogin(res.data.token)
    }).catch(err => {
      alert('error login. check your username and password again')
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
