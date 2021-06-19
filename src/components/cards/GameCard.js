import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'

function GameCard(props) {
  const history = useHistory()

  console.log(props.game, props.gameUser)

  function toGame() {
    history.push(`/game/${props.game.id}`)
  }

  return (
    <div className="card" onClick={toGame}>
      Game {props.game.id}
    </div>
  )
}

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
  gameUser: PropTypes.object,
}

export default GameCard
