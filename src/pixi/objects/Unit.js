import * as PIXI from 'pixi.js'
import {infantryMaskTexture, infantryTintTexture, youMaskTexture, youTintTexture} from '../textures'
import {UNIT_TYPE_INFANTRY, UNIT_TYPE_YOU} from '../../constants/unitConstants'

class Unit {
  /**
   * @param i       row
   * @param j       column
   * @param owner
   * @param type
   * @param hp
   * @param state
   */
  constructor(i, j, owner, type, hp, state) {
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
    let unitMaskSprite = new PIXI.Sprite(maskTexture)
    let unitTintSprite = new PIXI.Sprite(tintTexture)
    unitMaskSprite.anchor.set(0.5)
    unitTintSprite.anchor.set(0.5)
    let y = 40 * i + 20
    let x = 50 * j + (i % 2 === 0 ? 50 : 25)
    unitMaskSprite.position.set(x, y)
    unitTintSprite.position.set(x, y)
    unitTintSprite.tint = (owner === 1 ? 0xFF5555 : 0x5555FF)
    this.pixiNode.addChild(unitMaskSprite)
    this.pixiNode.addChild(unitTintSprite)
  }
}

export default Unit
