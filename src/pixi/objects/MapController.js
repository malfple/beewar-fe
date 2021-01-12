import * as PIXI from 'pixi.js'

import Terrain from './Terrain'
import Unit from './Unit'
import {
  UNIT_ATTACK_RANGE_INFANTRY,
  UNIT_MOVE_STEPS_INFANTRY,
  UNIT_MOVE_STEPS_YOU,
  UNIT_TYPE_INFANTRY,
  UNIT_TYPE_YOU, UNIT_WEIGHT_INFANTRY,
  UNIT_WEIGHT_MAP, UNIT_WEIGHT_YOU,
} from './unitConstants'
import {
  CMD_CHAT,
  CMD_END_TURN,
  CMD_ERROR,
  CMD_UNIT_MOVE,
  CMD_UNIT_MOVE_AND_ATTACK,
} from '../../modules/communication/messageConstants'
import {GROUP_WEBSOCKET} from '../../modules/communication/groupConstants'
import {hexDistance} from '../../utils/grid'

// MIRROR: for bfs
const K = 6
const adjY = [0, 0, -1, 1, -1, 1]
const adjXEven = [-1, 1, 0, 0, 1, 1]
const adjXOdd = [-1, 1, 0, 0, -1, -1]
function getAdjList(y, x) {
  if((y&1) === 0) { // even row
    return [adjY, adjXEven]
  } else {
    return [adjY, adjXOdd]
  }
}

/**
 * this class is responsible for rendering the map and updating it
 */
class MapController {
  /**
   * @param {Object}    mapData
   * @param {int}       currentPlayer   - the player of this client (not the current turn's player) This is not userID, but player number (1..n)
   * @param {boolean}   interactive
   * @param {GameComms} comms
   */
  constructor(mapData, currentPlayer, interactive=false, comms=null) {
    this.currentPlayer = currentPlayer
    this.height = mapData.height
    this.width = mapData.width
    this.terrains = []
    this.units = []
    this.player_count = mapData.player_count
    this.turn_count = mapData.turn_count
    this.turn_player = mapData.turn_player
    this.pixiNode = new PIXI.Container()
    this.selectedUnit = null
    this.selectedTerrainToMove = null
    this.comms = comms

    const terrainInfo = atob(mapData.terrain_info)
    const unitInfo = atob(mapData.unit_info)

    // builds terrains, also builds units grid
    for(let i = 0; i < mapData.height; i++) {
      this.terrains.push([])
      this.units.push([])
      for(let j = 0; j < mapData.width; j++) {
        const terrainType = terrainInfo.charCodeAt(i * mapData.width + j)
        const terrain = new Terrain(terrainType, i, j, interactive, this.handleGridClick.bind(this))
        if(terrain.pixiNode) {
          this.pixiNode.addChild(terrain.pixiNode)
        }
        this.terrains[i].push(terrain)
        this.units[i].push(null)
      }
    }

    // MIRROR: this is mirrored from a function in backend
    // however, it is more simple because units are grouped
    for(let i = 0; i < unitInfo.length;) {
      const cy = unitInfo.charCodeAt(i)
      const cx = unitInfo.charCodeAt(i+1)
      const p = unitInfo.charCodeAt(i+2)
      const t = unitInfo.charCodeAt(i+3)
      const hp = unitInfo.charCodeAt(i+4)
      const s = unitInfo.charCodeAt(i+5)

      // switch is only for special cases
      let unit = null
      switch (t) {
        default: // basic ordinary units
          unit = new Unit(cy, cx, p, t, hp, s)
          i += 6
      }

      if(unit) {
        this.pixiNode.addChild(unit.pixiNode)
        this.units[cy][cx] = unit
      }
    }
  }

  handleGridClick(y, x) {
    if(this.terrains[y][x] === this.selectedTerrainToMove) { // confirm move
      this.comms.triggerMsg({
        cmd: CMD_UNIT_MOVE,
        data: {
          y_1: this.selectedUnit.y,
          x_1: this.selectedUnit.x,
          y_2: y,
          x_2: x,
        },
      }, GROUP_WEBSOCKET)
      this._clearSelection()
    } else if(this.terrains[y][x].isAttackTarget()) { // attack
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
      this._clearSelection()
    } else if(this.units[y][x]) { // select unit
      if(!this.units[y][x].isMoved()) { // only if not yet moved
        this._selectUnit(y, x)
      } else {
        this._clearSelection()
      }
    } else if(this.terrains[y][x].dist === -1) { // select out of range cells, deselect
      this._clearSelection()
    } else { // move
      // only go to move confirmation if selected unit is own unit and it is currently your turn
      if(this.selectedUnit && this.selectedUnit.owner === this.currentPlayer && this.currentPlayer === this.turn_player) {
        this.selectedTerrainToMove = this.terrains[y][x]
        this._deactivateTerrains(this.selectedUnit.y, this.selectedUnit.x) // deactivate, but don't deselect
        this.selectedTerrainToMove.activateMoveTarget()
        this._activateAttackTerrains(y, x)
      } else {
        this._clearSelection()
      }
    }
  }

  _selectUnit(y, x) {
    const prevUnit = this.selectedUnit
    this._clearSelection()
    if(prevUnit === this.units[y][x]) { // deselect if select again
      return
    }
    this.units[y][x].select()
    this.selectedUnit = this.units[y][x]
    this._activateMoveTerrains(y, x)
  }
  _clearSelection() {
    // clears all selection
    if(this.selectedTerrainToMove) {
      this._deactivateAttackTerrains(this.selectedTerrainToMove.y, this.selectedTerrainToMove.x)
      this.selectedTerrainToMove.deactivate()
      this.selectedTerrainToMove = null
    }
    if(this.selectedUnit) {
      this.selectedUnit.deselect()
      this._deactivateTerrains(this.selectedUnit.y, this.selectedUnit.x)
      this.selectedUnit = null
    }
  }

  // there needs to be a unit at (y, x)
  _activateMoveTerrains(y, x) {
    const unit = this.units[y][x]
    switch(unit.type) {
      case UNIT_TYPE_YOU:
        this._bfs(y, x, UNIT_MOVE_STEPS_YOU, unit.owner, UNIT_WEIGHT_YOU)
        break
      case UNIT_TYPE_INFANTRY:
        this._bfs(y, x, UNIT_MOVE_STEPS_INFANTRY, unit.owner, UNIT_WEIGHT_INFANTRY)
        break
      default:
        console.error('null or unknown unit')
    }
  }
  _activateAttackTerrains(y, x) {
    let atkRange = 0
    switch(this.selectedUnit.type) {
      case UNIT_TYPE_YOU:
        break
      case UNIT_TYPE_INFANTRY:
        atkRange = UNIT_ATTACK_RANGE_INFANTRY
        break
      default:
        console.error('null or unknown unit')
    }
    for(let i = y-atkRange; i <= y+atkRange; i++) {
      for(let j = x-atkRange; j <= x+atkRange; j++) {
        if(i === y && j === x) {
          continue
        }
        if(i < 0 || i >= this.height || j < 0 || j >= this.width) {
          continue
        }
        if(hexDistance(y, x, i, j) > atkRange) {
          continue
        }
        if(this.units[i][j] && this.units[i][j].owner !== this.selectedUnit.owner) {
          this.terrains[i][j].activateAttackTarget()
        }
      }
    }
  }
  _deactivateAttackTerrains(y, x) {
    let atkRange = 0
    switch(this.selectedUnit.type) {
      case UNIT_TYPE_YOU:
        break
      case UNIT_TYPE_INFANTRY:
        atkRange = UNIT_ATTACK_RANGE_INFANTRY
        break
      default:
        console.error('null or unknown unit')
    }
    for(let i = y-atkRange; i <= y+atkRange; i++) {
      for(let j = x-atkRange; j <= x+atkRange; j++) {
        if(i === y && j === x) {
          continue
        }
        if(i < 0 || i >= this.height || j < 0 || j >= this.width) {
          continue
        }
        if(hexDistance(y, x, i, j) > atkRange) {
          continue
        }
        this.terrains[i][j].deactivate()
      }
    }
  }
  _deactivateTerrains(y, x) {
    switch(this.units[y][x].type) {
      case UNIT_TYPE_YOU:
      case UNIT_TYPE_INFANTRY:
        this._bfsReset(y, x)
        break
      default:
        console.error('null or unknown unit')
    }
  }

  // MIRROR: bfs function from backend
  _bfs(y, x, steps, owner, weight) {
    const queue = []
    let ptq = 0
    this.terrains[y][x].dist = 0
    this.terrains[y][x].activateMoveTarget()
    queue.push({y: y, x: x})
    while(ptq < queue.length) {
      const now = queue[ptq++]

      if(this.terrains[now.y][now.x].dist >= steps) {
        continue
      }

      const [cy, cx] = getAdjList(now.y, now.x)
      for(let k = 0; k < K; k++) {
        const ty = now.y + cy[k]
        const tx = now.x + cx[k]
        if(ty < 0 || ty >= this.height || tx < 0 || tx >= this.width) {
          continue
        }
        if(this.terrains[ty][tx].dist !== -1) {
          continue
        }
        if(this.terrains[ty][tx].type !== 1) {
          continue
        }
        const currUnit = this.units[ty][tx]
        if(currUnit) {
          if(currUnit.owner !== owner) {
            continue
          }
          if(UNIT_WEIGHT_MAP[currUnit.type] + weight > 1) {
            continue
          }
        }

        this.terrains[ty][tx].dist = this.terrains[now.y][now.x].dist + 1
        this.terrains[ty][tx].activateMoveTarget()
        queue.push({y: ty, x: tx})
      }
    }
  }
  // same thing as above but reverse
  _bfsReset(y, x) {
    const queue = []
    let ptq = 0
    this.terrains[y][x].dist = -1
    this.terrains[y][x].deactivate()
    queue.push({y: y, x: x})
    while(ptq < queue.length) {
      const now = queue[ptq++]

      const [cy, cx] = getAdjList(now.y, now.x)
      for(let k = 0; k < K; k++) {
        const ty = now.y + cy[k]
        const tx = now.x + cx[k]
        if(ty < 0 || ty >= this.height || tx < 0 || tx >= this.width) {
          continue
        }
        if(this.terrains[ty][tx].dist === -1) {
          continue
        }

        this.terrains[ty][tx].dist =-1
        this.terrains[ty][tx].deactivate()
        queue.push({y: ty, x: tx})
      }
    }
  }

  // handle ws events from BE
  handleComms(msg) {
    switch(msg.cmd) {
      case CMD_UNIT_MOVE:
        const unit = this.units[msg.data.y_1][msg.data.x_1]
        this.units[msg.data.y_1][msg.data.x_1] = null
        this.units[msg.data.y_2][msg.data.x_2] = unit
        unit.moveTo(msg.data.y_2, msg.data.x_2)
        break
      case CMD_UNIT_MOVE_AND_ATTACK:
        const unit2 = this.units[msg.data.y_1][msg.data.x_1]
        this.units[msg.data.y_1][msg.data.x_1] = null
        this.units[msg.data.y_2][msg.data.x_2] = unit2
        unit2.moveTo(msg.data.y_2, msg.data.x_2)
        this.units[msg.data.y_2][msg.data.x_2].setHP(msg.data.hp_atk)
        if(this.units[msg.data.y_2][msg.data.x_2].hp === 0) {
          this.units[msg.data.y_2][msg.data.x_2] = null
        }
        this.units[msg.data.y_t][msg.data.x_t].setHP(msg.data.hp_def)
        if(this.units[msg.data.y_t][msg.data.x_t].hp === 0) {
          this.units[msg.data.y_t][msg.data.x_t] = null
        }
        break
      case CMD_END_TURN:
        this._nextTurn()
        break
      case CMD_CHAT:
      case CMD_ERROR:
        // do nothing
        break
      default:
        console.error(`map controller comms: unknown event: ${msg.cmd}`)
    }
  }

  // ends current player turn and start next player turn
  // MIRROR: there is a similar backend function to this one
  _nextTurn() {
    const endTurnPlayer = this.turn_player
    this.turn_player++
    if(this.turn_player > this.player_count) {
      this.turn_count++
      this.turn_player = 1
    }
    // update units
    for(let i = 0; i < this.height; i++) {
      for(let j = 0; j < this.width; j++) {
        if(!this.units[i][j]) {
          continue
        }
        if(this.units[i][j].owner === endTurnPlayer) {
          this.units[i][j].endTurn()
        }else if(this.units[i][j].owner === this.turn_player) {
          this.units[i][j].startTurn()
        }
      }
    }
  }
}

export default MapController
