import * as PIXI from 'pixi.js'
import {
  honeyFieldTexture,
  iceFieldTexture,
  plainsTexture,
  terrainHitArea,
  wallsTexture,
  wastelandTexture,
} from '../textures'
import {
  TERRAIN_STATUS_ATTACK_TARGET,
  TERRAIN_STATUS_MOVE_TARGET,
  TERRAIN_STATUS_NORMAL, TERRAIN_TYPE_HONEY_FIELD, TERRAIN_TYPE_ICE_FIELD,
  TERRAIN_TYPE_PLAINS, TERRAIN_TYPE_WALLS, TERRAIN_TYPE_WASTELAND,
} from './terrainConstants'

import {nullGameComms} from '../../modules/communication/GameComms'
import {GROUP_MAP_CONTROLLER} from '../../modules/communication/groupConstants'
import {COMMS_TERRAIN_CLICK} from '../../modules/communication/messageConstants'
import {dimFilter} from '../filters'

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
    switch (type) {
      case TERRAIN_TYPE_PLAINS:
        this.pixiNode = new PIXI.Sprite(plainsTexture)
        break
      case TERRAIN_TYPE_WALLS:
        this.pixiNode = new PIXI.Sprite(wallsTexture)
        break
      case TERRAIN_TYPE_HONEY_FIELD:
        this.pixiNode = new PIXI.Sprite(honeyFieldTexture)
        break
      case TERRAIN_TYPE_WASTELAND:
        this.pixiNode = new PIXI.Sprite(wastelandTexture)
        break
      case TERRAIN_TYPE_ICE_FIELD:
        this.pixiNode = new PIXI.Sprite(iceFieldTexture)
        break
      default:
        console.error('unknown terrain type')
        return
    }
    this.pixiNode.anchor.set(0.5, 0.5)
    const py = 75 * y + 50
    const px = 90 * x + (y % 2 === 0 ? 95 : 50)
    this.pixiNode.position.set(px, py)
    this.pixiNode.hitArea = terrainHitArea

    // events
    if(interactive) {
      this.pixiNode.interactive = true
      this.pixiNode.on('pointerover', () => {
        this.pixiNode.alpha = 0.5
      })
      this.pixiNode.on('pointerout', () => {
        this.pixiNode.alpha = 1
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

  setUnitIsMoved() {
    this.pixiNode.filters = [dimFilter]
  }
  unsetUnitIsMoved() {
    this.pixiNode.filters = null
  }
}

export default Terrain
