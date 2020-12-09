import * as PIXI from 'pixi.js'
import {hexTexture} from '../textures'

class Terrain {
  /**
   * @param type  map type
   * @param i     row
   * @param j     column
   */
  constructor(type, i, j) {
    this.type = type
    this.pixiNode = null

    if(type === 0) {
      return
    }
    this.pixiNode = new PIXI.Sprite(hexTexture)
    this.pixiNode.anchor.set(0.5, 0.5)
    let y = 40 * i + 20
    let x = 50 * j + (i % 2 === 0 ? 50 : 25)
    this.pixiNode.position.set(x, y)
  }
}

export default Terrain
