import React, {useContext, useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

import {UserTokenContext} from '../../context'
import GameApp from '../../components/pixiapp/GameApp'
import {CMD_ERROR, CMD_GAME_DATA, GROUP_WEBSOCKET_LISTENERS} from '../../modules/communication/messageConstants'
import GameComms from '../../modules/communication/GameComms'
import WebsocketWrapper from '../../modules/communication/WebsocketWrapper'
import PlayersAndChatBox from '../../components/game/PlayersAndChatBox'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'
import CampaignHints from '../../components/game/CampaignHints'

/**
 * This component is very similar to GameView
 * Any changes there should apply here too
 */
function CampaignGameView(props) {
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

      ws.current = new WebsocketWrapper(props.gameID, userToken.token, comms.current)
    }).catch(() => {
      // do nothing
    })

    return function cleanup() {
      if(ws.current) {
        ws.current.close()
      }

      comms.current.unregisterSubscriber(dummy, [GROUP_WEBSOCKET_LISTENERS])
    }
  }, [props.gameID, userToken])

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
        <GameApp gameData={gameData} comms={comms.current} />
      </div>
      <div className="map-game-view__column-right">
        <h1>Current Campaign</h1>
        <h2>
          {gameData.game.name}
        </h2>
        <PlayersAndChatBox
          comms={comms.current}
          gameID={gameData.game.id}
          players={gameData.players}
          gameHasPassword={gameData.game.password !== ''}
          disableChat={true}
        />
        <CampaignHints campaignLevel={props.campaignLevel} />
        <div className="map-game-view__column-right__footer">
          <Link to="/campaign/list">
            >>> go to campaign list
          </Link>
        </div>
      </div>
    </div>
  )
}

CampaignGameView.propTypes = {
  gameID: PropTypes.number.isRequired,
  campaignLevel: PropTypes.number.isRequired,
}

export default CampaignGameView
