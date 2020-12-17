import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import {UserTokenContext} from '../../context'
import GameApp from '../../components/pixiapp/GameApp'
import {CMD_CHAT, CMD_END_TURN, CMD_GAME_DATA} from '../../modules/communication/messageConstants'
import GameComms from '../../modules/communication/GameComms'
import WebsocketWrapper from '../../modules/communication/WebsocketWrapper'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'

function GameView() {
  const {id} = useParams()
  const userToken = useContext(UserTokenContext)
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState(['start of chat'])
  const [gameData, setGameData] = useState(null)
  const ws = useRef(null)
  const comms = useRef(null)

  useEffect(() => {
    comms.current = new GameComms()

    ws.current = new WebsocketWrapper(id, userToken.token, comms.current)

    ws.current.addOnMessageListener(msg => {
      if(msg.cmd === CMD_CHAT) {
        setMessages(prevMessages => [...prevMessages, `${msg.sender}: ${msg.data}`])
      } else if(msg.cmd === CMD_GAME_DATA) {
        setGameData(msg.data)
      }
    })

    return function cleanup() {
      ws.current.close()
    }
  }, [id, userToken])

  // sends message to backend server
  function sendMsg(cmd, data) {
    console.log('send message', cmd, data)
    comms.current.triggerMsg({
      cmd: cmd,
      data: data,
    }, GROUP_WEBSOCKET)
  }

  function endTurn() {
    comms.current.triggerMsg({
      cmd: CMD_END_TURN,
    }, GROUP_WEBSOCKET)
  }

  return (
    <div>
      <button onClick={endTurn}>end turn</button> <br />
      <input type="text" onChange={e => setMsg(e.target.value)} />
      <button onClick={() => sendMsg(CMD_CHAT, msg)}>send</button>
      <div>
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      {gameData ? <GameApp map={gameData.game} comms={comms.current} /> : null}
    </div>
  )
}

export default GameView
