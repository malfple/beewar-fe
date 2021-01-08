import React from 'react'
import PropTypes from 'prop-types'

import {PLAYER_COLOR_TINT} from '../pixi/objects/unitConstants'

function PlayerText(props) {
  const colorHex = PLAYER_COLOR_TINT[props.gameUser.player_order]
  const style = {
    backgroundColor: `#${colorHex.toString(16)}`,
  }

  return (
    <div style={style}>{props.gameUser.user.username}</div>
  )
}

PlayerText.propTypes = {
  gameUser: PropTypes.object.isRequired,
}

export default PlayerText
