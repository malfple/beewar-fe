import React, {useContext, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import MapForGame from '../../pixi/objects/MapForGame'
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
  /** @type {React.MutableRefObject<>} */
  const appContainer = useRef(null)

  useEffect(() => {
    // setup app
    const stage = new PIXI.Container()

    const map = new MapForGame(props.gameData.game, props.gameData.players, userToken.userID, props.comms)
    props.comms.registerSubscriber(map, [GROUP_WEBSOCKET_LISTENERS])
    const viewport = new ViewPort(map)
    stage.addChild(viewport.fixedFrame)

    const mapInteractionController = new MapInteractionController(map, props.comms)
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
    appContainer.current.appendChild(renderer.view)

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
    <div ref={appContainer} />
  )
}

GameApp.propTypes = {
  gameData: PropTypes.object.isRequired,
  comms: PropTypes.object.isRequired,
}

// MapViewApp is memo-ed by default
export default React.memo(GameApp)
