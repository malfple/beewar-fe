import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import './../components/forms/Form.css'

import {apiAuthRegister} from '../modules/api/auth'
import Button from '../components/forms/button/Button'
import useInputChange from '../components/forms/useInputChange'
import InputBox from '../components/forms/InputBox'

function Register() {
  const history = useHistory()
  const [input, handleInputChange] = useInputChange({
    email: '',
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    setLoading(true)
    apiAuthRegister(input.email, input.username, input.password).then(res => {
      setLoading(false)
      const errMsg = res.data.err_msg
      if(errMsg === '') {
        alert('register successful, you can login now')
        history.replace('/login')
      } else {
        alert(errMsg)
      }
    })
    e.preventDefault()
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <h2>Create your new account</h2>
        <div>
          <InputBox
            label="Email"
            type="text"
            name="email"
            disabled={loading}
            onChange={handleInputChange}
            required={true}
          />
          <div className="form__note">As this is still in testing phase, the email isn't even verified lmao. You can input any random string :D</div>
        </div>
        <div>
          <InputBox
            label="Username"
            type="text"
            name="username"
            disabled={loading}
            onChange={handleInputChange}
            required={true}
          />
          <div className="form__note">Choose a unique username</div>
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
        <Button theme="fill">
          <input type="submit" value="Register" disabled={loading} />
        </Button>
      </form>
    </div>
  )
}

export default Register
