import * as PIXI from 'pixi.js'
import {
  infantryMaskTexture,
  infantryTintTexture,
  jetCrewMaskTexture, jetCrewTintTexture, mortarMaskTexture, mortarTintTexture,
  queenMaskTexture,
  queenTintTexture, tankMaskTexture, tankTintTexture, wizardMaskTexture, wizardTintTexture,
} from '../textures'
import {
  PLAYER_COLOR_TINT, UNIT_MAX_HP_TANK,
  UNIT_STATE_BIT_MOVED,
  UNIT_TYPE_INFANTRY,
  UNIT_TYPE_JET_CREW, UNIT_TYPE_MORTAR,
  UNIT_TYPE_QUEEN, UNIT_TYPE_TANK, UNIT_TYPE_WIZARD,
} from './unitConstants'
import {dimFilter} from '../filters'

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

    // main sprite
    let maskTexture = null
    let tintTexture = null
    switch (type) {
      case UNIT_TYPE_QUEEN:
        maskTexture = queenMaskTexture
        tintTexture = queenTintTexture
        break
      case UNIT_TYPE_INFANTRY:
        maskTexture = infantryMaskTexture
        tintTexture = infantryTintTexture
        break
      case UNIT_TYPE_JET_CREW:
        maskTexture = jetCrewMaskTexture
        tintTexture = jetCrewTintTexture
        break
      case UNIT_TYPE_WIZARD:
        maskTexture = wizardMaskTexture
        tintTexture = wizardTintTexture
        break
      case UNIT_TYPE_TANK:
        maskTexture = tankMaskTexture
        tintTexture = tankTintTexture
        break
      case UNIT_TYPE_MORTAR:
        maskTexture = mortarMaskTexture
        tintTexture = mortarTintTexture
        break
      default:
        console.error('load unit: unknown unit type')
    }
    this.maskSprite = new PIXI.Sprite(maskTexture)
    this.tintSprite = new PIXI.Sprite(tintTexture)
    this.tintSprite.tint = PLAYER_COLOR_TINT[owner]
    this.maskSprite.anchor.set(0.5)
    this.tintSprite.anchor.set(0.5)
    // this.maskSprite.scale.set(0.5)
    // this.tintSprite.scale.set(0.5)
    this.pixiNode.addChild(this.maskSprite)
    this.pixiNode.addChild(this.tintSprite)
    this._updateSpriteFromState()

    // hp text
    this.hpText = new PIXI.Text(this.hp, {
      fontFamily: 'Arial',
      fontSize: 24,
      align: 'left',
      fill: 'white',
      stroke: 'black',
      strokeThickness: 8,
    })
    this.hpText.position.set(-40, 0)
    this.pixiNode.addChild(this.hpText)

    this._setPosition(y, x)
  }

  _setPosition(y, x) {
    this.y = y
    this.x = x
    const py = 75 * y + 50
    const px = 90 * x + (y % 2 === 0 ? 95 : 50)
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

  moveTo(y, x) {
    this._setPosition(y, x)
  }
  toggleMoved() {
    this.state |= UNIT_STATE_BIT_MOVED
    this._updateSpriteFromState()
  }
  isMoved() {
    return (this.state & UNIT_STATE_BIT_MOVED) !== 0
  }

  setHP(hp) {
    this.hp = hp
    this.hpText.text = this.hp
    if(this.hp === 0) { // unit destroyed, remove sprite
      this.pixiNode.destroy({
        children: true,
      })
    }
  }

  // update functions for rendering
  _updateSpriteFromState() {
    if(this.isMoved()) {
      this.maskSprite.filters = [dimFilter]
      this.tintSprite.filters = [dimFilter]
    } else {
      this.maskSprite.filters = null
      this.tintSprite.filters = null
    }
  }

  startTurn() {
    // nothing yet
  }
  endTurn() {
    this.state &= ~UNIT_STATE_BIT_MOVED
    this._updateSpriteFromState()
    // tank heal
    if(this.type === UNIT_TYPE_TANK) {
      this.setHP(Math.min(this.hp + 2, UNIT_MAX_HP_TANK))
    }
  }
}

export default Unit
