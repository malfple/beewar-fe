import * as PIXI from 'pixi.js'
import {infantryMaskTexture, infantryTintTexture, youMaskTexture, youTintTexture} from '../textures'
import {PLAYER_COLOR_TINT, UNIT_STATE_BIT_MOVED, UNIT_TYPE_INFANTRY, UNIT_TYPE_YOU} from './unitConstants'

class Unit {
  /**
   * @param y       row
   * @param x       column
   * @param owner
   * @param type
   * @param hp
   * @param state
   */
  constructor(y, x, owner, type, hp, state) {
    this.y = y
    this.x = x
    this.owner = owner
    this.type = type
    this.hp = hp
    this.state = state
    this.pixiNode = new PIXI.Container()

    let maskTexture = null
    let tintTexture = null
    switch (type) {
      case UNIT_TYPE_YOU:
        maskTexture = youMaskTexture
        tintTexture = youTintTexture
        break
      case UNIT_TYPE_INFANTRY:
        maskTexture = infantryMaskTexture
        tintTexture = infantryTintTexture
        break
      default:
        console.error('load unit: unknown unit type')
    }
    const unitMaskSprite = new PIXI.Sprite(maskTexture)
    const unitTintSprite = new PIXI.Sprite(tintTexture)
    unitTintSprite.tint = PLAYER_COLOR_TINT[owner]
    unitMaskSprite.anchor.set(0.5)
    unitTintSprite.anchor.set(0.5)
    this.pixiNode.addChild(unitMaskSprite)
    this.pixiNode.addChild(unitTintSprite)

    const py = 40 * y + 20
    const px = 50 * x + (y % 2 === 0 ? 50 : 25)
    this.pixiNode.position.set(px, py)
  }

  // triggered when this unit is selected to move
  select() {
    this.pixiNode.scale.set(1.2)
  }
  // reverse of above
  deselect() {
    this.pixiNode.scale.set(1)
  }

  static startTurn() {}

  endTurn() {
    this.state &= ~UNIT_STATE_BIT_MOVED
  }
}

export default Unit
