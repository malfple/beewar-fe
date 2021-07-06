import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {apiUserGetManyByID} from '../../modules/api/user'
import './UserLabel.css'

/**
 * UserLabel is a label text for user
 *
 * Display:
 *
 * If 'userID' is provided, will call api to get user data
 *
 * If `user` is provided, will display normally
 *
 * otherwise, show loading
 */
function UserLabel(props) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    if(props.userID) {
      apiUserGetManyByID([props.userID]).then(res => {
        const users = res.data.users
        if(users.length >= 1) {
          setUser(users[0])
        }
      })
    }
  }, [props.userID])

  if(props.userID) {
    if(user) {
      return (
        <span className="user-label">{user.username}</span>
      )
    }

    return (
      <span className="user-label">User {props.userID}...</span>
    )
  }

  if(props.user) {
    return (
      <span className="user-label">{props.user.username}</span>
    )
  }

  return (
    <span className="user-label">Loading...</span>
  )
}

UserLabel.propTypes = {
  userID: PropTypes.number,
  user: PropTypes.object,
}

UserLabel.defaultProps = {
  userID: null,
  user: null,
}

export default UserLabel
