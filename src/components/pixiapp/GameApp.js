import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import MapController from '../../pixi/objects/MapController'
import {GROUP_WEBSOCKET_LISTENERS} from '../../modules/communication/groupConstants'

function GameApp(props) {
  useEffect(() => {
    // setup app
    const stage = new PIXI.Container()
    const mapController = new MapController(props.map, true, props.comms)
    props.comms.registerSubscriber(mapController, [GROUP_WEBSOCKET_LISTENERS])
    const viewport = ViewPort(mapController)

    stage.addChild(viewport)

    const ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    console.log('load map pixi')
    document.getElementById('game-app').appendChild(renderer.view)

    console.log(`stage has ${stage.children.length} instances`)
    console.log(`mapController has ${mapController.pixiNode.children.length} instances`)

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
  map: PropTypes.object.isRequired,
  comms: PropTypes.object.isRequired,
}

// MapViewApp is memo-ed by default
export default React.memo(GameApp)
