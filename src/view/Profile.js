import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import * as api from '../api/api'

function Profile(props) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.requestProfile(props.username).then(res => {
      console.log(res.data)
      if(res.data.user) {
        setUser({
          username: res.data.user.username,
          email: res.data.user.email
        })
      }
    })
  }, [props.username])

  if(!user) {
    return (
      <div>
        Loading...
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

Profile.propTypes = {
  username: PropTypes.string.isRequired
}

export default Profile
