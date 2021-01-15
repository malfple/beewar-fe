import * as PIXI from 'pixi.js'
import {hexTexture} from '../textures'
import {TERRAIN_STATUS_ATTACK_TARGET, TERRAIN_STATUS_MOVE_TARGET, TERRAIN_STATUS_NORMAL} from './terrainConstants'

import {nullGameComms} from '../../modules/communication/GameComms'
import {GROUP_MAP_CONTROLLER} from '../../modules/communication/groupConstants'
import {COMMS_TERRAIN_CLICK} from '../../modules/communication/messageConstants'

class Terrain {
  /**
   * @param type  terrain type
   * @param y     row
   * @param x     column
   * @param interactive: boolean, if true, create listeners
   * @param {GameComms} comms
   */
  constructor(type, y, x, interactive, comms=nullGameComms) {
    this.y = y
    this.x = x
    this.type = type
    this.pixiNode = null
    this.dist = -1 // used in bfs for determining distance
    this.status = TERRAIN_STATUS_NORMAL // rendering status

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
        comms.triggerMsg({
          cmd: COMMS_TERRAIN_CLICK,
          data: {
            y: this.y,
            x: this.x,
          },
        }, GROUP_MAP_CONTROLLER)
      })
    }
  }

  // triggered when the cell is in movement range of the current selected unit
  activateMoveTarget() {
    if(this.pixiNode) {
      this.pixiNode.tint = 0x00FF00
      this.status = TERRAIN_STATUS_MOVE_TARGET
    }
  }
  isMoveTarget() {
    return this.status === TERRAIN_STATUS_MOVE_TARGET
  }
  // triggered when the cell contains an attack target for the current selected unit
  activateAttackTarget() {
    if(this.pixiNode) {
      this.pixiNode.tint = 0xFF0000
      this.status = TERRAIN_STATUS_ATTACK_TARGET
    }
  }
  isAttackTarget() {
    return this.status === TERRAIN_STATUS_ATTACK_TARGET
  }
  // return to normal
  deactivate() {
    if(this.pixiNode && this.status !== TERRAIN_STATUS_NORMAL) {
      this.pixiNode.tint = 0xFFFFFF
      this.status = TERRAIN_STATUS_NORMAL
    }
  }
}

export default Terrain
