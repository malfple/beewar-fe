import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import MapController from '../../pixi/objects/MapController'

function GameApp(props) {
  // sends message to websocket
  function sendMsg(cmd, data) {
    console.log('send message2', cmd, data)
    props.ws.send(JSON.stringify({
      cmd: cmd,
      data: data,
    }))
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

    // override websocket listener
    const currOnMessageListener = props.ws.onmessage
    props.ws.onmessage = rawMsg => {
      const msg = JSON.parse(rawMsg.data)
      mapController.handleWSMessage(msg)
      currOnMessageListener(rawMsg)
    }

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
  ws: PropTypes.object.isRequired,
}

// MapViewApp is memo-ed by default
export default React.memo(GameApp)
