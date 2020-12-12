import * as PIXI from 'pixi.js'
import {hexTexture} from '../textures'

class Terrain {
  /**
   * @param type  map type
   * @param y     row
   * @param x     column
   * @param interactive: boolean, if true, create listeners
   * @param callbackClick: function(y, x, event)
   */
  constructor(type, y, x, interactive, callbackClick) {
    this.y = y
    this.x = x
    this.type = type
    this.pixiNode = null
    this.dist = -1 // used in bfs for determining distance

    if(type === 0) {
      return
    }
    this.pixiNode = new PIXI.Sprite(hexTexture)
    this.pixiNode.anchor.set(0.5, 0.5)
    const py = 40 * y + 20
    const px = 50 * x + (y % 2 === 0 ? 50 : 25)
    this.pixiNode.position.set(px, py)

    // events
    if(interactive) {
      this.pixiNode.interactive = true
      this.pixiNode.on('pointerover', () => {
        this.pixiNode.scale.set(1.2)
      })
      this.pixiNode.on('pointerout', () => {
        this.pixiNode.scale.set(1)
      })
      this.pixiNode.on('click', e => {
        callbackClick(this.y, this.x, e)
      })
    }
  }

  // triggered when the cell is in movement range of the current selected unit
  activateMoveTarget() {
    this.pixiNode.tint = 0x00FF00
  }
  // triggered when the cell contains an attack target for the current selected unit
  activateAttackTarget() {
    this.pixiNode.tint = 0xFF0000
  }
  // return to normal
  deactivate() {
    this.pixiNode.tint = 0xFFFFFF
  }
}

export default Terrain
