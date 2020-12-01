import * as PIXI from 'pixi.js'
import {hexTexture, infantryMaskTexture, infantryTintTexture, youMaskTexture, youTintTexture} from '../textures'
import {renderer} from '../renderer'

function ViewPort(map) {
  let terrainInfo = atob(map.terrain_info)
  let unitInfo = atob(map.unit_info)

  let fixedFrame = new PIXI.Container()
  let movedFrame = new PIXI.Container()
  let mapContainer = new PIXI.Container()
  fixedFrame.addChild(movedFrame)
  movedFrame.addChild(mapContainer)

  for(let i = 0; i < map.height; i++) {
    for(let j = 0; j < map.width; j++) {
      let hexVal = terrainInfo.charCodeAt(i * map.width + j)
      if(hexVal === 0) {
        continue
      }
      let hexSprite = new PIXI.Sprite(hexTexture)
      hexSprite.anchor.set(0.5, 0.5)
      let y = 40 * i + 20
      let x = 50 * j + (i % 2 === 0 ? 50 : 25)
      hexSprite.position.set(x, y)
      mapContainer.addChild(hexSprite)
    }
  }

  for(let i = 0; i < unitInfo.length; i += 6) {
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
    mapContainer.addChild(unitMaskSprite)
    mapContainer.addChild(unitTintSprite)
  }

  fixedFrame.hitArea = new PIXI.Rectangle(0, 0, renderer.width, renderer.height)
  fixedFrame.interactive = true

  // dragging the screen
  let drag = false
  let dragPosition = null
  function onDragStart(e) {
    movedFrame.alpha = 0.5
    dragPosition = e.data.getLocalPosition(movedFrame)
    drag = true
  }
  fixedFrame.on('pointerdown', onDragStart)
  function onDragStop(e) {
    movedFrame.alpha = 1
    dragPosition = null
    drag = false
  }
  fixedFrame.on('pointerup', onDragStop)
  function onDragMove(e) {
    if(drag) {
      const newPosition = e.data.getLocalPosition(fixedFrame)
      movedFrame.x = newPosition.x - dragPosition.x
      movedFrame.y = newPosition.y - dragPosition.y
    }
  }
  fixedFrame.on('pointermove', onDragMove)

  return fixedFrame
}

export default ViewPort
