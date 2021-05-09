import * as PIXI from 'pixi.js'

import Terrain from './Terrain'
import Unit from './Unit'
import {
  ATTACK_TYPE_GROUND,
  ATTACK_TYPE_NONE,
  MOVE_TYPE_GROUND,
  UNIT_ATTACK_RANGE_MAP, UNIT_ATTACK_TYPE_MAP,
  UNIT_MOVE_RANGE_MAP,
  UNIT_MOVE_TYPE_MAP,
  UNIT_TYPE_QUEEN,
  UNIT_WEIGHT_MAP,
} from './unitConstants'
import {
  CMD_CHAT,
  CMD_END_TURN,
  CMD_ERROR, CMD_JOIN, CMD_PING, CMD_UNIT_ATTACK,
  CMD_UNIT_MOVE,
  CMD_UNIT_MOVE_AND_ATTACK, COMMS_MAP_EVENT_END_TURN,
} from '../../modules/communication/messageConstants'
import {hexDistance} from '../../utils/grid'
import {nullGameComms} from '../../modules/communication/GameComms'
import {TERRAIN_TYPE_PLAINS} from './terrainConstants'
import {GROUP_MAP_EVENT_LISTENERS} from '../../modules/communication/groupConstants'
import PriorityQueue from '../../utils/PriorityQueue'
import {GAME_STATUS_ENDED, GAME_STATUS_ONGOING, GAME_STATUS_PICKING} from './gameConstants'

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
class Map {
  /**
   * @param {Object}    mapData
   * @param {Array}     playerData
   * @param {int}       userID       - the current logged in user
   * @param {boolean}   interactive
   * @param {GameComms} comms
   */
  constructor(mapData, playerData=[], userID, interactive=false, comms=nullGameComms) {
    this.playerData = playerData
    this.userID = userID
    this.currentPlayer = 0
    this.calcCurrentPlayer()
    this.height = mapData.height
    this.width = mapData.width
    this.terrains = []
    this.units = []
    this.player_count = mapData.player_count
    this.status = mapData.status
    this.turn_count = mapData.turn_count
    this.turn_player = mapData.turn_player
    this.pixiNode = new PIXI.Container()
    this.comms = comms

    const terrainInfo = atob(mapData.terrain_info)
    const unitInfo = atob(mapData.unit_info)

    // builds terrains, also builds units grid
    for(let i = 0; i < mapData.height; i++) {
      this.terrains.push([])
      this.units.push([])
      for(let j = 0; j < mapData.width; j++) {
        const terrainType = terrainInfo.charCodeAt(i * mapData.width + j)
        const terrain = new Terrain(terrainType, i, j, interactive, this.comms)
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
        if(unit.isMoved()) {
          this.terrains[cy][cx].setUnitIsMoved()
        }
      }
    }
  }

  calcCurrentPlayer() {
    this.currentPlayer = 0
    for(let i = 0; i < this.playerData.length; i++) {
      if(this.userID === this.playerData[i].user_id) {
        this.currentPlayer = this.playerData[i].player_order
      }
    }
  }

  /**
   * given a position with a unit, activate move terrains for that unit.
   */
  activateMoveTerrains(y, x) {
    const unit = this.units[y][x]
    switch(UNIT_MOVE_TYPE_MAP[unit.type]) {
      case MOVE_TYPE_GROUND:
        this._fillMoveGround(y, x, UNIT_MOVE_RANGE_MAP[unit.type], unit.owner, UNIT_WEIGHT_MAP[unit.type])
        break
      default:
        console.error('null or unknown move type')
    }
  }

  /**
   * return terrains to normal
   */
  deactivateMoveTerrains(y, x) {
    const unit = this.units[y][x]
    switch(UNIT_MOVE_TYPE_MAP[unit.type]) {
      case MOVE_TYPE_GROUND:
        this._fillMoveGroundReset(y, x)
        break
      default:
        console.error('null or unknown move type')
    }
  }

  /**
   * given a unit and position, paint attack terrains on that position
   * @param {Unit} unit
   * @param y
   * @param x
   * @param {boolean} afterMove - a boolean indicating whether the attack is done after moving
   */
  activateAttackTerrains(unit, y, x, afterMove) {
    let atkRange = 0
    switch(UNIT_ATTACK_TYPE_MAP[unit.type]) {
      case ATTACK_TYPE_NONE:
        break
      case ATTACK_TYPE_GROUND:
        atkRange = UNIT_ATTACK_RANGE_MAP[unit.type]
        break
      default:
        console.error('null or unknown attack type')
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
        if(this.units[i][j] && this.units[i][j].owner !== unit.owner) {
          this.terrains[i][j].activateAttackTarget()
        }
      }
    }
  }

  /**
   * return terrains to normal. you should still give the attacking unit and position
   * @param {Unit} unit
   * @param y
   * @param x
   * @param {boolean} afterMove - a boolean indicating whether the attack is done after moving
   */
  deactivateAttackTerrains(unit, y, x, afterMove) {
    let atkRange = 0
    switch(UNIT_ATTACK_TYPE_MAP[unit.type]) {
      case ATTACK_TYPE_NONE:
        break
      case ATTACK_TYPE_GROUND:
        atkRange = UNIT_ATTACK_RANGE_MAP[unit.type]
        break
      default:
        console.error('null or unknown attack type')
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

  // MIRROR: dijkstra function from backend
  _fillMoveGround(y, x, steps, owner, weight) {
    const pq = new PriorityQueue()
    pq.push(0, {y: y, x: x})
    while(!pq.empty()) {
      const [d, now] = pq.top()
      pq.pop()

      if(this.terrains[now.y][now.x].dist !== -1) {
        continue
      }
      this.terrains[now.y][now.x].dist = d
      this.terrains[now.y][now.x].activateMoveTarget()
      if(d === steps) {
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
        if(this.terrains[ty][tx].type !== TERRAIN_TYPE_PLAINS) {
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

        if(d+1 <= steps) {
          pq.push(d+1, {y: ty, x: tx})
        }
      }
    }
  }
  // same thing as above but reverse
  _fillMoveGroundReset(y, x) {
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

  // game comms
  _sendCommsEndTurn() {
    // trigger comms to other objects to notify end turn
    this.comms.triggerMsg({
      cmd: COMMS_MAP_EVENT_END_TURN,
      data: {
        turn_count: this.turn_count,
        turn_player: this.turn_player,
      },
    }, GROUP_MAP_EVENT_LISTENERS)
  }
  handleComms(msg) {
    switch(msg.cmd) {
      case CMD_UNIT_MOVE:
        this._unitMove(msg.data.y_1, msg.data.x_1, msg.data.y_2, msg.data.x_2)
        this.units[msg.data.y_2][msg.data.x_2].toggleMoved()
        this.terrains[msg.data.y_2][msg.data.x_2].setUnitIsMoved()
        break
      case CMD_UNIT_ATTACK:
        this._unitAttack(msg.data.y_1, msg.data.x_1, msg.data.hp_atk, msg.data.y_t, msg.data.x_t, msg.data.hp_def)
        this.units[msg.data.y_1][msg.data.x_1].toggleMoved()
        this.terrains[msg.data.y_1][msg.data.x_1].setUnitIsMoved()
        break
      case CMD_UNIT_MOVE_AND_ATTACK:
        this._unitMove(msg.data.y_1, msg.data.x_1, msg.data.y_2, msg.data.x_2)
        this._unitAttack(msg.data.y_2, msg.data.x_2, msg.data.hp_atk, msg.data.y_t, msg.data.x_t, msg.data.hp_def)
        this.units[msg.data.y_2][msg.data.x_2].toggleMoved()
        this.terrains[msg.data.y_2][msg.data.x_2].setUnitIsMoved()
        break
      case CMD_END_TURN:
        this._nextTurn()
        this._sendCommsEndTurn()
        break
      case CMD_JOIN:
        const player = msg.data.player
        this.playerData[player.player_order-1] = player
        this.calcCurrentPlayer()
        this._checkGameStart()
        break
      case CMD_CHAT:
      case CMD_PING:
      case CMD_ERROR:
        // do nothing
        break
      default:
        console.error(`map comms: unknown event: ${msg.cmd}`)
    }
  }

  // unit edit functions
  _unitMove(y1, x1, y2, x2) {
    const unit = this.units[y1][x1]
    this.units[y1][x1] = null
    this.units[y2][x2] = unit
    unit.moveTo(y2, x2)
  }
  _unitAttack(y, x, hpAtk, yt, xt, hpDef) {
    this.units[y][x].setHP(hpAtk)
    this._checkUnitAlive(y, x)
    this.units[yt][xt].setHP(hpDef)
    this._checkUnitAlive(yt, xt)
  }
  // MIRROR: utils function from GameLoader BE
  _checkGameStart() {
    if(this.status !== GAME_STATUS_PICKING) {
      return
    }
    for(let i = 0; i < this.playerData.length; i++) {
      if(this.playerData[i].user_id === 0) {
        // empty slot
        return
      }
    }
    this.status = GAME_STATUS_ONGOING
    this.turn_player = 1
    this._sendCommsEndTurn() // just to update the turn indicator / border
  }
  _checkGameEnd() {
    if(this.status !== GAME_STATUS_ONGOING) {
      return
    }
    let playersLeft = 0
    for(let i = 0; i < this.playerData.length; i++) {
      if(this.playerData[i].final_turns === 0) {
        playersLeft++
      }
    }
    if(playersLeft <= 1) {
      for(let i = 0; i < this.playerData.length; i++) {
        this._assignPlayerRank(i+1)
      }
      this.status = GAME_STATUS_ENDED
      this.turn_player = 0
      this._sendCommsEndTurn()
    }
  }
  _checkUnitAlive(y, x) {
    if(this.units[y][x].hp === 0) {
      if(this.units[y][x].type === UNIT_TYPE_QUEEN) {
        // player defeated
        this._assignPlayerRank(this.units[y][x].owner)
        this._checkGameEnd()
      }
      this.units[y][x] = null
    }
  }
  _assignPlayerRank(player) {
    // modifying player directly is dangerous but whatever
    if(this.playerData[player-1].final_turns !== 0) {
      return
    }
    for(let i = 0; i < this.playerData.length; i++) {
      if(this.playerData[i].final_turns === 0) {
        this.playerData[player-1].final_rank++
      }
    }
    this.playerData[player-1].final_turns = this.turn_count
  }

  // ends current player turn and start next player turn
  // MIRROR: there is a similar backend function to this one
  _nextTurn() {
    const endTurnPlayer = this.turn_player
    while(true) {
      this.turn_player++
      if(this.turn_player > this.player_count) {
        this.turn_count++
        this.turn_player = 1
      }
      if(this.playerData[this.turn_player-1].final_turns === 0) { // player not defeated
        break
      }
    }
    // update units and terrains
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
        this.terrains[i][j].unsetUnitIsMoved()
      }
    }
    // just in case, also check if game ends
    this._checkGameEnd()
  }
}

export default Map
