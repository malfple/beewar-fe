import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import './../components/forms/Form.css'

import {apiAuthRegister} from '../modules/api/auth'
import Button from '../components/forms/button/Button'

function Register() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    setLoading(true)
    apiAuthRegister(email, username, password).then(res => {
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
    <div className="FormContainer">
      <form className="Form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <h2>Create your new account</h2>
        <div>
          <input
            className="Form__InputBox"
            type="text"
            name="email"
            placeholder="Email"
            disabled={loading}
            onChange={e => setEmail(e.target.value)}
            required={true}
          />
          <div className="Form__Note">As this is still in testing phase, the email isn't even verified lmao. You can input any random string :D</div>
        </div>
        <div>
          <input
            className="Form__InputBox"
            type="text"
            name="username"
            placeholder="Username"
            disabled={loading}
            onChange={e => setUsername(e.target.value)}
            required={true}
          />
          <div className="Form__Note">Choose a unique username</div>
        </div>
        <div>
          <input
            className="Form__InputBox"
            type="password"
            name="password"
            placeholder="Password"
            disabled={loading}
            onChange={e => setPassword(e.target.value)}
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
