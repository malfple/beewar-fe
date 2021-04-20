import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import {UserTokenContext} from '../../context'
import GameApp from '../../components/pixiapp/GameApp'
import {CMD_END_TURN, CMD_ERROR, CMD_GAME_DATA} from '../../modules/communication/messageConstants'
import GameComms from '../../modules/communication/GameComms'
import WebsocketWrapper from '../../modules/communication/WebsocketWrapper'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'
import ChatBox from '../../components/game/ChatBox'

function GameView() {
  const {id} = useParams()
  const userToken = useContext(UserTokenContext)
  const [gameData, setGameData] = useState(null)
  /** @type {React.MutableRefObject<WebsocketWrapper>} */
  const ws = useRef(null)
  /** @type {React.MutableRefObject<GameComms>} */
  const comms = useRef(null)

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      comms.current = new GameComms()

      ws.current = new WebsocketWrapper(id, userToken.token, comms.current)

      ws.current.addOnMessageListener(msg => {
        if(msg.cmd === CMD_GAME_DATA) {
          console.log('game data', msg.data)
          setGameData(msg.data)
        } else if(msg.cmd === CMD_ERROR) {
          alert(msg.data)
        }
      })
    }).catch(() => {
      // do nothing
    })

    return function cleanup() {
      if(ws.current) {
        ws.current.close()
      }
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
      <ChatBox comms={comms.current} players={gameData.players} />
      <button onClick={endTurn}>end turn</button> <br />
      <GameApp gameData={gameData} comms={comms.current} />
    </div>
  )
}

export default GameView
