import * as PIXI from 'pixi.js'
import {hexTexture, infantryMaskTexture, infantryTintTexture, youMaskTexture, youTintTexture} from '../textures'

// this class is responsible for rendering the map and updating it
class MapController {
  constructor(mapData) {
    let terrainInfo = atob(mapData.terrain_info)
    let unitInfo = atob(mapData.unit_info)

    this.stage = new PIXI.Container()

    for(let i = 0; i < mapData.height; i++) {
      for(let j = 0; j < mapData.width; j++) {
        let hexVal = terrainInfo.charCodeAt(i * mapData.width + j)
        if(hexVal === 0) {
          continue
        }
        let hexSprite = new PIXI.Sprite(hexTexture)
        hexSprite.anchor.set(0.5, 0.5)
        let y = 40 * i + 20
        let x = 50 * j + (i % 2 === 0 ? 50 : 25)
        hexSprite.position.set(x, y)
        this.stage.addChild(hexSprite)
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
      this.stage.addChild(unitMaskSprite)
      this.stage.addChild(unitTintSprite)
    }
  }
}

export default MapController
