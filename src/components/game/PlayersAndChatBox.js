import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import {CMD_CHAT, CMD_JOIN, GROUP_WEBSOCKET, GROUP_WEBSOCKET_LISTENERS} from '../../modules/communication/messageConstants'

import PlayerText from './PlayerText'

function PlayersAndChatBox(props) {
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState(['start of chat'])
  const [players, setPlayers] = useState(props.players)

  // send chat message to backend server
  function sendChat() {
    props.comms.triggerMsg({
      cmd: CMD_CHAT,
      data: msg,
    }, GROUP_WEBSOCKET)
  }

  useEffect(() => {
    // dummy object
    const dummy = {
      handleComms(msg) {
        if(msg.cmd === CMD_CHAT) {
          let username = ''
          for(const player of players) {
            if(player.user_id === msg.sender) {
              username = player.user.username
              break
            }
          }
          setMessages(prevMessages => [...prevMessages, `${username}: ${msg.data}`])
        } else if(msg.cmd === CMD_JOIN) {
          const player = msg.data.player
          setPlayers(prevPlayers => {
            const newPlayers = prevPlayers.slice()
            newPlayers[player.player_order-1] = player
            return newPlayers
          })
        }
      },
    }

    props.comms.registerSubscriber(dummy, [GROUP_WEBSOCKET_LISTENERS])

    return function cleanup() {
      props.comms.unregisterSubscriber(dummy, [GROUP_WEBSOCKET_LISTENERS])
    }
  }, [props.comms, players])

  function renderChat() {
    if(props.disableChat) {
      return null
    }

    return (
      <div>
        Chat:
        <input type="text" onChange={e => setMsg(e.target.value)} />
        <button onClick={sendChat}>send</button>
        <div>
          {messages.map((msg, i) => <div key={i}>{msg}</div>)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        Players:
        <div>
          {players.map((player, i) => <PlayerText key={i} comms={props.comms} gameID={props.gameID} gameUser={player} gameHasPassword={props.gameHasPassword} />)}
        </div>
      </div>
      {renderChat()}
    </div>
  )
}

PlayersAndChatBox.propTypes = {
  comms: PropTypes.object.isRequired,
  gameID: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
  gameHasPassword: PropTypes.bool.isRequired,
  disableChat: PropTypes.bool,
}

export default PlayersAndChatBox
