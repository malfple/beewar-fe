import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'

function GameCard(props) {
  const history = useHistory()

  console.log(props.game)
  let game_id = props.game.game_id
  if(!game_id) {
    game_id = props.game.id
  }

  function toGame() {
    history.push(`/game/${game_id}`)
  }

  return (
    <div className="card" onClick={toGame}>
      Game {game_id}
    </div>
  )
}

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
}

export default GameCard
