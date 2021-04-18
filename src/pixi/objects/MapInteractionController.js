import {nullGameComms} from '../../modules/communication/GameComms'
import {
  CMD_UNIT_ATTACK,
  CMD_UNIT_MOVE,
  CMD_UNIT_MOVE_AND_ATTACK,
  COMMS_TERRAIN_CLICK,
} from '../../modules/communication/messageConstants'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'

const MAP_STATE_NORMAL = 0
const MAP_STATE_UNIT_SELECT = 1
const MAP_STATE_MOVE_CONFIRM = 2
const MAP_STATE_ATTACK_CONFIRM = 3

/**
 * this class is responsible for listening click events in a map and updating it.
 * also responsible for sending game events to websocket (through comms)
 */
class MapInteractionController {
  /**
   * @param {Map}       map
   * @param {GameComms} comms
   */
  constructor(map, comms=nullGameComms) {
    this.map = map
    this.comms = comms

    this.state = MAP_STATE_NORMAL
    /** @type {Unit} */
    this.selectedUnit = null
    /** @type {Terrain} */
    this.selectedTerrainToMove = null
    /** @type {Unit} */
    this.selectedUnitToAttack = null
  }

  // required by comms
  handleComms(msg) {
    switch(msg.cmd) {
      case COMMS_TERRAIN_CLICK:
        this.dispatchClick(msg.data.y, msg.data.x)
        break
      default:
        // do nothing
    }
  }

  /**
   * trigger a click on the map
   */
  dispatchClick(y, x) {
    switch(this.state) {
      case MAP_STATE_NORMAL:
        this._handleClickStateNormal(y, x)
        break
      case MAP_STATE_UNIT_SELECT:
        this._handleClickStateUnitSelect(y, x)
        break
      case MAP_STATE_MOVE_CONFIRM:
        this._handleClickStateMoveConfirm(y, x)
        break
      case MAP_STATE_ATTACK_CONFIRM:
        this._handleClickStateAttackConfirm(y, x)
        break
      default:
        console.error('unknown map state. did you forget to add this?')
    }
  }

  _handleClickStateNormal(y, x) {
    if(this.map.units[y][x] && !this.map.units[y][x].isMoved()) { // select unit
      this._transitionStateNormalToStateUnitSelect(y, x)
    }
  }

  _handleClickStateUnitSelect(y, x) {
    if(this.map.terrains[y][x].isAttackTarget() && this._checkUnitOwnedAndCurrentTurn(this.selectedUnit)) {
      // attack confirmation, only allowed if moving own unit and it's your turn
      this.map.deactivateMoveTerrains(this.selectedUnit.y, this.selectedUnit.x)
      this.map.deactivateAttackTerrains(this.selectedUnit, this.selectedUnit.y, this.selectedUnit.x, false)
      this.selectedUnitToAttack = this.map.units[y][x]
      this.map.terrains[this.selectedUnit.y][this.selectedUnit.x].activateMoveTarget()
      this.map.terrains[y][x].activateAttackTarget()
      this.state = MAP_STATE_ATTACK_CONFIRM
    } else if(this.map.units[y][x]) { // click on unit
      if(!this.map.units[y][x].isMoved() && this.map.units[y][x] !== this.selectedUnit) { // select another unit
        this._transitionStateUnitSelectToStateNormal()
        this._transitionStateNormalToStateUnitSelect(y, x)
      } else { // select again = deselect
        this._transitionStateUnitSelectToStateNormal()
      }
    } else if(this.map.terrains[y][x].isMoveTarget() && this._checkUnitOwnedAndCurrentTurn(this.selectedUnit)) {
      // move here, only allowed if moving own unit and it's your turn
      this.map.deactivateMoveTerrains(this.selectedUnit.y, this.selectedUnit.x)
      this.map.deactivateAttackTerrains(this.selectedUnit, this.selectedUnit.y, this.selectedUnit.x, false)
      this.selectedTerrainToMove = this.map.terrains[y][x]
      this.selectedTerrainToMove.activateMoveTarget()
      this.map.activateAttackTerrains(this.selectedUnit, y, x, true)
      this.state = MAP_STATE_MOVE_CONFIRM
    } else { // clear selection
      this._transitionStateUnitSelectToStateNormal()
    }
  }

  _handleClickStateMoveConfirm(y, x) {
    if(this.map.terrains[y][x] === this.selectedTerrainToMove) { // confirm move
      this.comms.triggerMsg({
        cmd: CMD_UNIT_MOVE,
        data: {
          y_1: this.selectedUnit.y,
          x_1: this.selectedUnit.x,
          y_2: y,
          x_2: x,
        },
      }, GROUP_WEBSOCKET)
    } else if(this.map.terrains[y][x].isAttackTarget()) { // attttaaaacccc
      this.comms.triggerMsg({
        cmd: CMD_UNIT_MOVE_AND_ATTACK,
        data: {
          y_1: this.selectedUnit.y,
          x_1: this.selectedUnit.x,
          y_2: this.selectedTerrainToMove.y,
          x_2: this.selectedTerrainToMove.x,
          y_t: y,
          x_t: x,
        },
      }, GROUP_WEBSOCKET)
    }

    this.map.deactivateAttackTerrains(this.selectedUnit, this.selectedTerrainToMove.y, this.selectedTerrainToMove.x, true)
    this.selectedTerrainToMove.deactivate()
    this.selectedTerrainToMove = null
    this.selectedUnit.deselect()
    this.selectedUnit = null
    this.state = MAP_STATE_NORMAL
  }

  _handleClickStateAttackConfirm(y, x) {
    if(this.map.units[y][x] === this.selectedUnitToAttack) {
      this.comms.triggerMsg({
        cmd: CMD_UNIT_ATTACK,
        data: {
          y_1: this.selectedUnit.y,
          x_1: this.selectedUnit.x,
          y_t: y,
          x_t: x,
        },
      }, GROUP_WEBSOCKET)
    }

    this.map.terrains[this.selectedUnit.y][this.selectedUnit.x].deactivate()
    this.map.terrains[this.selectedUnitToAttack.y][this.selectedUnitToAttack.x].deactivate()
    this.selectedUnitToAttack = null
    this.selectedUnit.deselect()
    this.selectedUnit = null
    this.state = MAP_STATE_NORMAL
  }

  // repetitive transition functions

  _transitionStateNormalToStateUnitSelect(y, x) {
    this.selectedUnit = this.map.units[y][x]
    this.selectedUnit.select()
    this.map.activateMoveTerrains(y, x)
    this.map.activateAttackTerrains(this.selectedUnit, y, x, false)
    this.state = MAP_STATE_UNIT_SELECT
  }

  _transitionStateUnitSelectToStateNormal() {
    this.map.deactivateMoveTerrains(this.selectedUnit.y, this.selectedUnit.x)
    this.map.deactivateAttackTerrains(this.selectedUnit, this.selectedUnit.y, this.selectedUnit.x, false)
    this.selectedUnit.deselect()
    this.selectedUnit = null
    this.state = MAP_STATE_NORMAL
  }

  // util functions

  /**
   * check to see if the unit is owned by the current player and it's their turn
   * @param {Unit} unit
   * @returns {boolean}
   * @private
   */
  _checkUnitOwnedAndCurrentTurn(unit) {
    return unit.owner === this.map.currentPlayer && this.map.currentPlayer === this.map.turn_player
  }
}

export default MapInteractionController
