import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

import * as api from '../api/api'

function Profile() {
  let [user, setUser] = useState(null)
  let {username} = useParams()

  useEffect(() => {
    api.requestProfile(username).then(res => {
      console.log(res.data)
      if(res.data.user) {
        setUser({
          username: res.data.user.username,
          email: res.data.user.email
        })
      }
    })
  }, [username])

  if(!user) {
    return (
      <div>
        User does not exist.
      </div>
    )
  }

  return (
    <div>
      <div>
        Username: {user.username}
      </div>
      <div>
        Email: {user.email}
      </div>
    </div>
  )
}

export default Profile
