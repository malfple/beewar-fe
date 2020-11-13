import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import {
  hexTexture,
  youMaskTexture,
  youTintTexture,
  infantryMaskTexture,
  infantryTintTexture
} from '../../pixi/textures'

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
        if(hexVal === 0) {
          continue
        }
        let hexSprite = new PIXI.Sprite(hexTexture)
        hexSprite.anchor.set(0.5, 0.5)
        let y = 40 * i + 20
        let x = 50 * j + (i % 2 === 0 ? 50 : 25)
        hexSprite.position.set(x, y)
        viewport.addChild(hexSprite)
      }
    }

    for(let i = 0; i < unitInfo.length; i += 5) {
      let cy = unitInfo.charCodeAt(i)
      let cx = unitInfo.charCodeAt(i+1)
      let y = 40 * cy + 20
      let x = 50 * cx + (cy % 2 === 0 ? 50 : 25)
      let t = unitInfo.charCodeAt(i+3)
      let p = unitInfo.charCodeAt(i+2)
      let unitMaskSprite = new PIXI.Sprite(t === 1 ? youMaskTexture : infantryMaskTexture)
      let unitTintSprite = new PIXI.Sprite(t === 1 ? youTintTexture : infantryTintTexture)
      unitMaskSprite.anchor.set(0.5, 0.5)
      unitTintSprite.anchor.set(0.5, 0.5)
      unitMaskSprite.position.set(x, y)
      unitTintSprite.position.set(x, y)
      unitTintSprite.tint = (p === 1 ? 0xFF5555 : 0x5555FF)
      viewport.addChild(unitMaskSprite)
      viewport.addChild(unitTintSprite)
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
