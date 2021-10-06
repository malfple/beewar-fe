import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

import {apiUserGetByUsername} from '../modules/api/user'

function Profile() {
  const [user, setUser] = useState(null)
  const {username} = useParams()

  useEffect(() => {
    apiUserGetByUsername(username).then(res => {
      console.log(res.data)
      if(res.data.user) {
        setUser({
          username: res.data.user.username,
          email: res.data.user.email,
          highest_campaign: res.data.user.highest_campaign,
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
      <div>
        Highest campaign level reached: {user.highest_campaign}
      </div>
    </div>
  )
}

export default Profile
