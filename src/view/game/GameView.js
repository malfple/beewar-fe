import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import {UserTokenContext} from '../../context'
import GameApp from '../../components/pixiapp/GameApp'
import {CMD_END_TURN, CMD_ERROR, CMD_GAME_DATA} from '../../modules/communication/messageConstants'
import GameComms from '../../modules/communication/GameComms'
import WebsocketWrapper from '../../modules/communication/WebsocketWrapper'
import {GROUP_WEBSOCKET, GROUP_WEBSOCKET_LISTENERS} from '../../modules/communication/groupConstants'
import ChatBox from '../../components/game/ChatBox'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'

function GameView() {
  const {id} = useParams()
  const userToken = useContext(UserTokenContext)
  const [gameData, setGameData] = useState(null)
  /** @type {React.MutableRefObject<WebsocketWrapper>} */
  const ws = useRef(null)
  /** @type {React.MutableRefObject<GameComms>} */
  const comms = useRef(null)

  useEffect(() => {
    // dummy object
    const dummy = {
      handleComms(msg) {
        if(msg.cmd === CMD_GAME_DATA) {
          console.log('game data', msg.data)
          setGameData(msg.data)
        } else if(msg.cmd === CMD_ERROR) {
          alert(msg.data)
        }
      },
    }

    // check token
    userToken.checkTokenAndRefresh().then(() => {
      comms.current = new GameComms()

      comms.current.registerSubscriber(dummy, [GROUP_WEBSOCKET_LISTENERS])

      ws.current = new WebsocketWrapper(id, userToken.token, comms.current)
    }).catch(() => {
      // do nothing
    })

    return function cleanup() {
      if(ws.current) {
        ws.current.close()
      }

      comms.current.unregisterSubscriber(dummy, [GROUP_WEBSOCKET_LISTENERS])
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
        <NormalLoadingSpinner />
      </div>
    )
  }

  return (
    <div className="map-game-view">
      <div className="map-game-view__column-left">
        <ChatBox comms={comms.current} gameID={gameData.game.id} players={gameData.players} gameHasPassword={gameData.game.password !== ''} />
        <button onClick={endTurn}>end turn</button> <br />
      </div>
      <div className="map-game-view__column-right">
        <GameApp gameData={gameData} comms={comms.current} />
      </div>
    </div>
  )
}

export default GameView
