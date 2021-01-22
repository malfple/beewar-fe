import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'

function GameCard(props) {
  const history = useHistory()

  console.log(props.game)

  function toGame() {
    history.push(`/game/${props.game.game_id}`)
  }

  return (
    <div className="game-card" onClick={toGame}>
      Game {props.game.game_id}
    </div>
  )
}

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
}

export default GameCard
