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
    let viewport = new PIXI.Container()
    stage.addChild(viewport)
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
        let x = 25 + 50 * j
        let y = 20 + 40 * i
        if(i % 2 === 0) {
          x += 25
        }
        hexSprite.position.set(x, y)
        viewport.addChild(hexSprite)
      }
    }

    console.log(`stage has ${stage.children.length} instances`)
    console.log(`viewport has ${viewport.children.length} instances`)

    stage.hitArea = new PIXI.Rectangle(0, 0, renderer.width, renderer.height)
    stage.interactive = true

    // dragging the screen
    let drag = false
    let dragPosition = null
    function onDragStart(e) {
      viewport.alpha = 0.5
      dragPosition = e.data.getLocalPosition(viewport)
      drag = true
    }
    stage.on('pointerdown', onDragStart)
    function onDragStop(e) {
      viewport.alpha = 1
      dragPosition = null
      drag = false
    }
    stage.on('pointerup', onDragStop)
    function onDragMove(e) {
      if(drag) {
        const newPosition = e.data.getLocalPosition(stage)
        viewport.x = newPosition.x - dragPosition.x
        viewport.y = newPosition.y - dragPosition.y
      }
    }
    stage.on('pointermove', onDragMove)

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
