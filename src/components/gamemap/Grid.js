import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import {bunnyTexture, hexTexture} from '../../pixi/textures'

function Grid(props) {
  console.log(props.map.terrain_info)
  let terrainInfo = atob(props.map.terrain_info)
  let terrainInfoString = ''
  console.log('terrain info length ' + terrainInfo.length)
  for(let i = 0; i < terrainInfo.length; i++) {
    terrainInfoString += ` ${terrainInfo.charCodeAt(i)}`
  }

  console.log(props.map.unit_info)
  let unitInfo = atob(props.map.unit_info)
  let unitInfoString = ''
  console.log('unit info length ' + unitInfo.length)
  for(let i = 0; i < unitInfo.length; i++) {
    unitInfoString += ` ${unitInfo.charCodeAt(i)}`
  }

  useEffect(() => {
    let stage = new PIXI.Container()
    let ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    console.log('load map pixi')
    document.getElementById('grid-view').appendChild(renderer.view)
    for(let i = 0; i < props.map.height; i++) {
      for(let j = 0; j < props.map.width; j++) {
        let hexVal = terrainInfo.charCodeAt(i * props.map.width + j)
        let hexSprite = new PIXI.Sprite(hexVal === 0 ? hexTexture : bunnyTexture)
        hexSprite.anchor.set(0.5, 0.5)
        let x = 50 + 50 * j
        let y = 50 + 40 * i
        if(i % 2 === 0) {
          x += 25
        }
        hexSprite.position.set(x, y)
        stage.addChild(hexSprite)
      }
    }
    console.log(`map has ${stage.children.length} instances`)

    return function cleanup() {
      console.log('map cleanup')
      stage.destroy()
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
