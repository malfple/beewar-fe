import React from 'react'
import PropTypes from 'prop-types'

import {PLAYER_COLOR_TINT} from '../../pixi/objects/unitConstants'
import {CMD_JOIN} from '../../modules/communication/messageConstants'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'

function PlayerText(props) {
  function joinGame() {
    // joins the game at current player_order / slot
    console.log(`join game pos ${props.gameUser.player_order}`)

    let password = ''
    if(props.gameHasPassword) {
      password = prompt('Input this game\'s password')
      if(password == null) {
        return
      }
    }

    props.comms.triggerMsg({
      cmd: CMD_JOIN,
      data: {
        player_order: props.gameUser.player_order,
        password: password,
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
  gameHasPassword: PropTypes.bool.isRequired,
}

export default PlayerText
