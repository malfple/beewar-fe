import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import MapController from '../../pixi/objects/MapController'

function MapViewApp(props) {
  useEffect(() => {
    const stage = new PIXI.Container()
    const mapController = new MapController(props.map)
    const viewport = ViewPort(mapController)

    stage.addChild(viewport)

    const ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    document.getElementById('map-view-app').appendChild(renderer.view)

    return function cleanup() {
      stage.destroy({
        children: true,
      })
      ticker.destroy()
    }
  })

  return (
    <div>
      <div id="map-view-app">
      </div>
    </div>
  )
}

// MapViewApp is memo-ed by default
export default React.memo(MapViewApp)
