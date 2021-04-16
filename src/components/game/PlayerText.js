import React from 'react'
import PropTypes from 'prop-types'

import {PLAYER_COLOR_TINT} from '../../pixi/objects/unitConstants'

function PlayerText(props) {
  const colorHex = PLAYER_COLOR_TINT[props.gameUser.player_order]
  const style = {
    backgroundColor: `#${colorHex.toString(16)}`,
  }

  let username = 'no player'
  if(props.gameUser.user) {
    username = props.gameUser.user.username
  }

  return (
    <div style={style}>{username}</div>
  )
}

PlayerText.propTypes = {
  gameUser: PropTypes.object.isRequired,
}

export default PlayerText
