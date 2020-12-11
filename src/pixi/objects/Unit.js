import * as PIXI from 'pixi.js'
import {infantryMaskTexture, infantryTintTexture, youMaskTexture, youTintTexture} from '../textures'
import {PLAYER_COLOR_TINT, UNIT_STATE_BIT_MOVED, UNIT_TYPE_INFANTRY, UNIT_TYPE_YOU} from './unitConstants'

class Unit {
  /**
   * @param i       row
   * @param j       column
   * @param owner
   * @param type
   * @param hp
   * @param state
   * @param interactive: boolean, if true, create listeners
   * @param callbackClick: function(target_unit, event)
   */
  constructor(i, j, owner, type, hp, state, interactive, callbackClick) {
    this.i = i
    this.j = j
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

    const y = 40 * i + 20
    const x = 50 * j + (i % 2 === 0 ? 50 : 25)
    this.pixiNode.position.set(x, y)

    // events
    if(interactive) {
      this.pixiNode.interactive = true
      this.pixiNode.on('click', e => {
        this.pixiNode.alpha = (this.pixiNode.alpha === 1 ? 0.5 : 1)
        callbackClick(this, e)
      })
    }
  }

  static startTurn() {}

  endTurn() {
    this.state &= ~UNIT_STATE_BIT_MOVED
  }
}

export default Unit
