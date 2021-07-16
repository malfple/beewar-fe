import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'
import {GAME_STATUS_PICKING, GAME_STATUS_TEXT} from '../../pixi/objects/gameConstants'
import Preview from './Preview'

function GameCard(props) {
  const history = useHistory()

  console.log(props.game, props.gameUser)

  function toGame() {
    history.push(`/game/${props.game.id}`)
  }

  return (
    <div className="card" onClick={toGame}>
      <Preview map={props.game} />
      <div className="card__content">
        <div>
          Game {props.game.id}
        </div>
        <div>
          Name: {props.game.name}
        </div>
        <div>
          Players: {props.game.player_count}
        </div>
        <div>
          Game status: {GAME_STATUS_TEXT[props.game.status]}
        </div>
        {props.game.status === GAME_STATUS_PICKING ?
          <div>
            Using password: {props.game.password.length > 0 ? 'Yes' : 'No'}
          </div>
          : null}
      </div>
    </div>
  )
}

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
  gameUser: PropTypes.object,
}

export default GameCard
