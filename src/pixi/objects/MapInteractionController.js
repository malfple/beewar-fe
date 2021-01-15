import {nullGameComms} from '../../modules/communication/GameComms'
import {
  CMD_UNIT_MOVE,
  CMD_UNIT_MOVE_AND_ATTACK,
  COMMS_TERRAIN_CLICK,
} from '../../modules/communication/messageConstants'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'

const MAP_STATE_NORMAL = 0
const MAP_STATE_UNIT_SELECT = 1
const MAP_STATE_MOVE_CONFIRM = 2

/**
 * this class is responsible for listening click events in a map and updating it.
 * also responsible for sending game events to websocket (through comms)
 */
class MapInteractionController {
  /**
   * @param {Map}       map
   * @param {int}       currentPlayer - the player of this client (not the current turn's player) This is not userID, but player number (1..n)
   * @param {GameComms} comms
   */
  constructor(map, currentPlayer, comms=nullGameComms) {
    this.map = map
    this.currentPlayer = currentPlayer
    this.comms = comms

    this.state = MAP_STATE_NORMAL
    /** @type {Unit} */
    this.selectedUnit = null
    /** @type {Terrain} */
    this.selectedTerrainToMove = null
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
      default:
        console.error('unknown map state. did you forget to add this?')
    }
  }

  _handleClickStateNormal(y, x) {
    if(this.map.units[y][x] && !this.map.units[y][x].isMoved()) { // select unit
      this.selectedUnit = this.map.units[y][x]
      this.selectedUnit.select()
      this.map.activateMoveTerrains(y, x)
      this.state = MAP_STATE_UNIT_SELECT
    }
  }

  _handleClickStateUnitSelect(y, x) {
    if(this.map.units[y][x]) {
      if(!this.map.units[y][x].isMoved() && this.selectedUnit !== this.map.units[y][x]) { // select another unit
        this.map.deactivateMoveTerrains(this.selectedUnit.y, this.selectedUnit.x)
        this.selectedUnit.deselect()
        this.selectedUnit = this.map.units[y][x]
        this.selectedUnit.select()
        this.map.activateMoveTerrains(y, x)
      } else { // same unit = deselect
        this.map.deactivateMoveTerrains(this.selectedUnit.y, this.selectedUnit.x)
        this.selectedUnit.deselect()
        this.selectedUnit = null
        this.state = MAP_STATE_NORMAL
      }
    } else if(this.map.terrains[y][x].isMoveTarget() && this.selectedUnit.owner === this.currentPlayer && this.currentPlayer === this.map.turn_player) {
      // move here, only allowed if moving own unit and it's your turn
      this.map.deactivateMoveTerrains(this.selectedUnit.y, this.selectedUnit.x)
      this.selectedTerrainToMove = this.map.terrains[y][x]
      this.selectedTerrainToMove.activateMoveTarget()
      this.map.activateAttackTerrains(this.selectedUnit, y, x)
      this.state = MAP_STATE_MOVE_CONFIRM
    } else { // clear selection
      this.map.deactivateMoveTerrains(this.selectedUnit.y, this.selectedUnit.x)
      this.selectedUnit.deselect()
      this.selectedUnit = null
      this.state = MAP_STATE_NORMAL
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

    this.map.deactivateAttackTerrains(this.selectedUnit, this.selectedTerrainToMove.y, this.selectedTerrainToMove.x)
    this.selectedTerrainToMove.deactivate()
    this.selectedTerrainToMove = null
    this.selectedUnit.deselect()
    this.selectedUnit = null
    this.state = MAP_STATE_NORMAL
  }
}

export default MapInteractionController
