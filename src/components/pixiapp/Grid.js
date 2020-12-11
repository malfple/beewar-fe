import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import MapController from '../../pixi/objects/MapController'

function Grid(props) {
  useEffect(() => {
    let stage = new PIXI.Container()
    let mapController = new MapController(props.map, true)
    let viewport = ViewPort(mapController)

    stage.addChild(viewport)

    let ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    console.log('load map pixi')
    document.getElementById('grid-view').appendChild(renderer.view)

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
      <div id="grid-view">
      </div>
    </div>
  )
}

// Grid is memo-ed by default
export default React.memo(Grid)
