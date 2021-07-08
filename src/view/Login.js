import React, {useState} from 'react'
import PropTypes from 'prop-types'
import './../components/forms/Form.css'

import {apiAuthLogin} from '../modules/api/auth'
import Button from '../components/forms/button/Button'
import useInputChange from '../components/forms/useInputChange'
import InputBox from '../components/forms/InputBox'

function Login(props) {
  const [input, handleInputChange] = useInputChange({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    setLoading(true)
    apiAuthLogin(input.username, input.password).then(res => {
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
          <InputBox
            label="Username"
            type="text"
            name="username"
            disabled={loading}
            onChange={handleInputChange}
            required={true}
          />
        </div>
        <div>
          <InputBox
            label="Password"
            type="password"
            name="password"
            disabled={loading}
            onChange={handleInputChange}
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
