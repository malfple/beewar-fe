import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import MapController from '../../pixi/objects/MapController'
import {GROUP_WEBSOCKET, GROUP_WEBSOCKET_LISTENERS} from '../../modules/communication/groupConstants'

function GameApp(props) {
  // sends message to websocket
  function sendMsg(cmd, data) {
    props.comms.triggerMsg({
      cmd: cmd,
      data: data,
    }, GROUP_WEBSOCKET)
  }

  useEffect(() => {
    // setup app
    const stage = new PIXI.Container()
    const mapController = new MapController(props.map, true, sendMsg)
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

    // create a dummy object to listen for ws events
    const selfDummy = {
      handleComms(msg) {
        mapController.handleWSMessage(msg)
      },
    }
    props.comms.registerSubscriber(selfDummy, [GROUP_WEBSOCKET_LISTENERS])

    return function cleanup() {
      console.log('map cleanup')
      stage.destroy({
        children: true,
      })
      ticker.destroy()

      props.comms.unregisterSubscriber(selfDummy, [GROUP_WEBSOCKET_LISTENERS])
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
