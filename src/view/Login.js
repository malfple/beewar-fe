import React, {useState} from 'react'
import PropTypes from 'prop-types'

import {apiAuthLogin} from '../modules/api/auth'

function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    setLoading(true)
    apiAuthLogin(username, password).then(res => {
      setLoading(false)
      props.onLogin(res.data.token)
    }).catch(err => {
      setLoading(false)
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
          <input type="text" name="username" disabled={loading} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" name="password" disabled={loading} onChange={e => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Login" disabled={loading} />
      </form>
    </div>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default Login
