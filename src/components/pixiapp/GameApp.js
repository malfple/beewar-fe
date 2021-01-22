import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import Map from '../../pixi/objects/Map'
import {
  GROUP_MAP_CONTROLLER,
  GROUP_MAP_EVENT_LISTENERS,
  GROUP_WEBSOCKET_LISTENERS,
} from '../../modules/communication/groupConstants'
import {UserTokenContext} from '../../context'
import InfoPanel from '../../pixi/objects/InfoPanel'
import MapInteractionController from '../../pixi/objects/MapInteractionController'

function GameApp(props) {
  const userToken = useContext(UserTokenContext)

  let currentPlayer = 0
  for(let i = 0; i < props.gameData.players.length; i++) {
    if(userToken.userID === props.gameData.players[i].user_id) {
      currentPlayer = props.gameData.players[i].player_order
    }
  }

  useEffect(() => {
    // setup app
    const stage = new PIXI.Container()

    const map = new Map(props.gameData.game, props.gameData.players, currentPlayer, true, props.comms)
    props.comms.registerSubscriber(map, [GROUP_WEBSOCKET_LISTENERS])
    const viewport = ViewPort(map)
    stage.addChild(viewport)

    const mapInteractionController = new MapInteractionController(map, currentPlayer, props.comms)
    props.comms.registerSubscriber(mapInteractionController, [GROUP_WEBSOCKET_LISTENERS, GROUP_MAP_CONTROLLER], true)

    const infoPanel = new InfoPanel(props.gameData.game)
    props.comms.registerSubscriber(infoPanel, [GROUP_MAP_EVENT_LISTENERS])
    stage.addChild(infoPanel.pixiNode)

    const ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    console.log('load map pixi')
    document.getElementById('game-app').appendChild(renderer.view)

    console.log(`stage has ${stage.children.length} instances`)
    console.log(`map has ${map.pixiNode.children.length} instances`)

    return function cleanup() {
      console.log('map cleanup')
      stage.destroy({
        children: true,
      })
      ticker.destroy()
    }
  })

  return (
    <div>
      <div id="game-app">
      </div>
    </div>
  )
}

GameApp.propTypes = {
  gameData: PropTypes.object.isRequired,
  comms: PropTypes.object.isRequired,
}

// MapViewApp is memo-ed by default
export default React.memo(GameApp)
