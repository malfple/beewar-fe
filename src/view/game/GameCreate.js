import React, {useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {apiGameCreate} from '../../modules/api/game'
import {UserTokenContext} from '../../context'
import './../../components/forms/Form.css'
import Button from '../../components/forms/button/Button'
import useInputChange from '../../components/forms/useInputChange'
import InputBox from '../../components/forms/InputBox'

function GameCreate() {
  const {map_id} = useParams()
  const userToken = useContext(UserTokenContext)
  const history = useHistory()

  const [input, handleInputChange] = useInputChange({
    name: '',
    password: '',
  })

  function createGame(e) {
    apiGameCreate(userToken.token, map_id, input.name, input.password).then(res => {
      if(res.data.err_msg === '') {
        alert(`create game with map id: ${map_id}, game id: ${res.data.game_id}`)
        history.push(`/game/${res.data.game_id}`)
      } else {
        alert(`Error: ${res.data.err_msg}`)
      }
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
          <InputBox
            label="Game name"
            type="text"
            name="name"
            onChange={handleInputChange}
            required={true}
          />
        </div>
        <div>
          <InputBox
            label="Game password"
            type="text"
            name="password"
            onChange={handleInputChange}
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
