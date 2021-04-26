import React, {useEffect, useState} from 'react'
import {apiUserList} from '../modules/api/user'

function Leaderboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    apiUserList().then(res => {
      setUsers(res.data.users)
    })
  }, [])

  return (
    <div>
      <h1>Leaderboard</h1>
      {users.map((user, i) => <div key={i}>{user.username}, {user.email}</div>)}
    </div>
  )
}

export default Leaderboard
