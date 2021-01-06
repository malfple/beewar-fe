import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import {UserTokenContext} from '../../context'
import GameApp from '../../components/pixiapp/GameApp'
import {CMD_END_TURN, CMD_GAME_DATA} from '../../modules/communication/messageConstants'
import GameComms from '../../modules/communication/GameComms'
import WebsocketWrapper from '../../modules/communication/WebsocketWrapper'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'
import ChatBox from '../../components/ChatBox'

function GameView() {
  const {id} = useParams()
  const userToken = useContext(UserTokenContext)
  const [gameData, setGameData] = useState(null)
  /** @type {React.MutableRefObject<WebsocketWrapper>} */
  const ws = useRef(null)
  /** @type {React.MutableRefObject<GameComms>} */
  const comms = useRef(null)

  useEffect(() => {
    comms.current = new GameComms()

    ws.current = new WebsocketWrapper(id, userToken.token, comms.current)

    ws.current.addOnMessageListener(msg => {
      if(msg.cmd === CMD_GAME_DATA) {
        setGameData(msg.data)
      }
    })

    return function cleanup() {
      ws.current.close()
    }
  }, [id, userToken])

  function endTurn() {
    comms.current.triggerMsg({
      cmd: CMD_END_TURN,
    }, GROUP_WEBSOCKET)
  }

  if(!gameData) {
    return (
      <div>
        Game Loading...
      </div>
    )
  }

  return (
    <div>
      <ChatBox comms={comms.current} />
      <button onClick={endTurn}>end turn</button> <br />
      <GameApp gameData={gameData} comms={comms.current} />
    </div>
  )
}

export default GameView
