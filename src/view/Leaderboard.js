import React, {useEffect, useState} from 'react'
import {apiUserList} from '../modules/api/user'
import NormalLoadingSpinner from '../components/loading/NormalLoadingSpinner'
import UserLabel from '../components/userlabel/UserLabel'

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
      {state.users.map((user, i) => <div><UserLabel key={i} user={user} /></div>)}
    </div>
  )
}

export default Leaderboard
