import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {PLAYER_COLOR_TINT} from '../../pixi/objects/unitConstants'
import {CMD_JOIN} from '../../modules/communication/messageConstants'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'
import {apiGameBeebotJoin} from '../../modules/api/game'
import {UserTokenContext} from '../../context'
import UserLabel from '../userlabel/UserLabel'

function PlayerText(props) {
  const userToken = useContext(UserTokenContext)

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

  // join game, but for beebot
  function beebotJoinGame() {
    console.log(`beebot join game pos ${props.gameUser.player_order}`)

    let password = ''
    if(props.gameHasPassword) {
      password = prompt('Input this game\'s password')
      if(password == null) {
        return
      }
    }

    apiGameBeebotJoin(userToken.token, props.gameID, props.gameUser.player_order, password).then(res => {
      if(res.data.err_msg !== '') {
        alert(`beebot join game error = ${res.data.err_msg}`)
      }
    })
  }

  const colorHex = PLAYER_COLOR_TINT[props.gameUser.player_order]
  const style = {
    backgroundColor: `#${colorHex.toString(16)}`,
  }

  let userLabel = 'no player'
  let joinButton = <button onClick={joinGame}>Join</button>
  let beebotJoinButton = <button onClick={beebotJoinGame}>Invite Beebot</button>
  if(props.gameUser.user) {
    userLabel = <UserLabel user={props.gameUser.user} />
    joinButton = null
    beebotJoinButton = null
  }

  return (
    <div style={style}>{userLabel} {joinButton} {beebotJoinButton}</div>
  )
}

PlayerText.propTypes = {
  comms: PropTypes.object.isRequired,
  gameID: PropTypes.number.isRequired,
  gameUser: PropTypes.object.isRequired,
  gameHasPassword: PropTypes.bool.isRequired,
}

export default PlayerText
