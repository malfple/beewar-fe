import React from 'react'
import PropTypes from 'prop-types'

import {PLAYER_COLOR_TINT} from '../../pixi/objects/unitConstants'
import {CMD_JOIN} from '../../modules/communication/messageConstants'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'

function PlayerText(props) {
  function joinGame() {
    // joins the game at current player_order / slot
    console.log(`join game pos ${props.gameUser.player_order}`)
    props.comms.triggerMsg({
      cmd: CMD_JOIN,
      data: {
        player_order: props.gameUser.player_order,
      },
    }, GROUP_WEBSOCKET)
  }

  const colorHex = PLAYER_COLOR_TINT[props.gameUser.player_order]
  const style = {
    backgroundColor: `#${colorHex.toString(16)}`,
  }

  let username = 'no player'
  let joinButton = <button onClick={joinGame}>Join</button>
  if(props.gameUser.user) {
    username = props.gameUser.user.username
    joinButton = null
  }

  return (
    <div style={style}>{username} {joinButton}</div>
  )
}

PlayerText.propTypes = {
  comms: PropTypes.object.isRequired,
  gameUser: PropTypes.object.isRequired,
}

export default PlayerText
