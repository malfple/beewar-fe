import React, {useContext, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {apiGameCreate} from '../../modules/api/game'
import {UserTokenContext} from '../../context'

function GameCreate() {
  const {map_id} = useParams()
  const userToken = useContext(UserTokenContext)
  const history = useHistory()

  const [password, setPassword] = useState('')

  function createGame(e) {
    apiGameCreate(userToken.token, parseInt(map_id), password).then(res => {
      alert(`create game with map id: ${map_id}, game id: ${res.data.game_id}`)
      history.push(`/game/${res.data.game_id}`)
    })
    e.preventDefault()
  }

  return (
    <div>
      <h1>Create Game</h1>
      <form onSubmit={createGame}>
        <div>
          <label>
            map id: {map_id}
          </label>
        </div>
        <div>
          Password: <input type="text" name="password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <input type="submit" value="Create" />
        </div>
      </form>
    </div>
  )
}

export default GameCreate
