import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'

function Grid(props) {
  let terrainInfo = atob(props.map.terrain_info)
  let terrainInfoString = ''
  for(let i = 0; i < terrainInfo.length; i++) {
    terrainInfoString += ` ${terrainInfo.charCodeAt(i)}`
  }

  let unitInfo = atob(props.map.unit_info)
  let unitInfoString = ''
  for(let i = 0; i < unitInfo.length; i++) {
    unitInfoString += ` ${unitInfo.charCodeAt(i)}`
  }

  useEffect(() => {
    let stage = new PIXI.Container()
    let viewport = ViewPort(props.map)
    stage.addChild(viewport)

    let ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    console.log('load map pixi')
    document.getElementById('grid-view').appendChild(renderer.view)

    console.log(`stage has ${stage.children.length} instances`)

    return function cleanup() {
      console.log('map cleanup')
      stage.destroy({
        children: true
      })
      ticker.destroy()
    }
  })

  return (
    <div>
      <div>
        terrain: {terrainInfoString}
      </div>
      <div>
        unit: {unitInfoString}
      </div>
      <div id="grid-view">
      </div>
    </div>
  )
}

export default Grid
