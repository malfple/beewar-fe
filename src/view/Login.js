import React, {useState} from 'react'
import PropTypes from 'prop-types'
import './../components/forms/Form.css'

import {apiAuthLogin} from '../modules/api/auth'
import Button from '../components/forms/button/Button'

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
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Log in to BeeWar</h1>
        <div>
          <input
            className="form__input-box"
            type="text"
            name="username"
            placeholder="Username"
            disabled={loading}
            onChange={e => setUsername(e.target.value)}
            required={true}
          />
        </div>
        <div>
          <input
            className="form__input-box"
            type="password"
            name="password"
            placeholder="Password"
            disabled={loading}
            onChange={e => setPassword(e.target.value)}
            required={true}
          />
        </div>
        <div>
          <Button theme="fill">
            <input type="submit" value="Login" disabled={loading} />
          </Button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default Login
