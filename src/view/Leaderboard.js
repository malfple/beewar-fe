import React, {useEffect, useState} from 'react'
import {apiUserList} from '../modules/api/user'
import NormalLoadingSpinner from '../components/loading/NormalLoadingSpinner'

function Leaderboard() {
  const [state, setState] = useState({
    loading: true,
    users: [],
  })

  useEffect(() => {
    apiUserList().then(res => {
      setState({
        loading: false,
        users: res.data.users,
      })
    })
  }, [])

  return (
    <div>
      <h1>Leaderboard</h1>
      {state.loading ? <NormalLoadingSpinner /> : null}
      {state.users.map((user, i) => <div key={i}>{user.username}</div>)}
    </div>
  )
}

export default Leaderboard
