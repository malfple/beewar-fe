import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

import {apiAuthRegister} from '../modules/api/auth'

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
    <div>
      register
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="text" name="email" disabled={loading} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Username:
          <input type="text" name="username" disabled={loading} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" name="password" disabled={loading} onChange={e => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Register" disabled={loading} />
      </form>
    </div>
  )
}

export default Register
