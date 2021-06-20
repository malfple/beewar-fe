import React, {useContext, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {apiGameCreate} from '../../modules/api/game'
import {UserTokenContext} from '../../context'
import './../../components/forms/Form.css'
import Button from '../../components/forms/button/Button'

function GameCreate() {
  const {map_id} = useParams()
  const userToken = useContext(UserTokenContext)
  const history = useHistory()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  function createGame(e) {
    apiGameCreate(userToken.token, map_id, name, password).then(res => {
      alert(`create game with map id: ${map_id}, game id: ${res.data.game_id}`)
      history.push(`/game/${res.data.game_id}`)
    })
    e.preventDefault()
  }

  return (
    <div>
      <form className="form" onSubmit={createGame}>
        <h1>Create a new game</h1>
        <div className="form__note">
          map id: {map_id}
        </div>
        <div>
          <input
            className="form__input-box"
            type="text"
            name="name"
            placeholder="Game name"
            onChange={e => setName(e.target.value)}
            required={true}
          />
        </div>
        <div>
          <input
            className="form__input-box"
            type="text"
            name="password"
            placeholder="Game password"
            onChange={e => setPassword(e.target.value)}
          />
          <div className="form__note">Leave empty for a password-less game</div>
        </div>
        <Button theme="fill">
          <input type="submit" value="Create" />
        </Button>
      </form>
    </div>
  )
}

export default GameCreate
