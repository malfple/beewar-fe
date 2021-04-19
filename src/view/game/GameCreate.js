import React, {useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {apiGameCreate} from '../../modules/api/game'
import {UserTokenContext} from '../../context'

function GameCreate() {
  const {map_id} = useParams()
  const userToken = useContext(UserTokenContext)
  const history = useHistory()

  function createGame() {
    apiGameCreate(userToken.token, map_id, '').then(res => {
      alert(`create game with map id: ${map_id}, game id: ${res.data.game_id}`)
      history.push(`/game/${res.data.game_id}`)
    })
  }

  return (
    <div>
      <h1>Create Game</h1>
      <div>
        map id: {map_id}
      </div>
      <div>
        <button onClick={createGame}>Create</button>
      </div>
    </div>
  )
}

export default GameCreate
