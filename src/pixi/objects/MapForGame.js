import Map from './Map'

import Terrain from './Terrain'
import {
  ATTACK_TYPE_AERIAL,
  ATTACK_TYPE_GROUND,
  ATTACK_TYPE_NONE, MOVE_TYPE_BLINK,
  MOVE_TYPE_GROUND,
  UNIT_ATTACK_RANGE_MAP, UNIT_ATTACK_RANGE_MIN_MAP, UNIT_ATTACK_TYPE_MAP,
  UNIT_MOVE_RANGE_MAP, UNIT_MOVE_RANGE_MIN_MAP,
  UNIT_MOVE_TYPE_MAP,
  UNIT_TYPE_QUEEN,
  UNIT_WEIGHT_MAP,
} from './unitConstants'
import {
  CMD_CHAT,
  CMD_END_TURN,
  CMD_ERROR, CMD_JOIN, CMD_PING, CMD_UNIT_ATTACK,
  CMD_UNIT_MOVE,
  CMD_UNIT_MOVE_AND_ATTACK, CMD_UNIT_STAY, COMMS_MAP_EVENT_END_TURN,
  CMD_UNIT_SWAP,
  GROUP_MAP_EVENT_LISTENERS,
} from '../../modules/communication/messageConstants'
import {hexDistance} from '../../utils/grid'
import PriorityQueue from '../../utils/PriorityQueue'
import {GAME_STATUS_ENDED, GAME_STATUS_ONGOING, GAME_STATUS_PICKING} from './gameConstants'
import {calcMoveCost} from '../../utils/moveCost'
import {TERRAIN_TYPE_ICE_FIELD, TERRAIN_TYPE_THRONE} from './terrainConstants'
import {UNIT_MOVE_AND_ATTACK_MAP, UNIT_SWAP_MAP} from './cmdWhitelist'
import {MAP_TYPE_ESCAPE} from './mapTypeConstants'

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
 * This class is an extension of Map and allows it to listen to events and edit itself.
 */
class MapForGame extends Map {
  /**
   * @param {Object}    mapData
   * @param {Array}     playerData
   * @param {int}       userID       - the current logged in user
   * @param {GameComms} comms
   */
  constructor(mapData, playerData, userID, comms) {
    super(mapData, comms)
    this.playerData = playerData
    this.userID = userID
    this.currentPlayer = 0 // only used by map interaction controller
    this.calcCurrentPlayer()
  }

  createTerrain(type, y, x) {
    const terrain = new Terrain(type, y, x, false, true, this.comms)
    if(terrain.pixiNode) {
      this.pixiNode.addChild(terrain.pixiNode)
    }
    this.terrains[y][x] = terrain
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
      case MOVE_TYPE_BLINK:
        this._fillMoveBlink(y, x, UNIT_MOVE_RANGE_MIN_MAP[unit.type], UNIT_MOVE_RANGE_MAP[unit.type], UNIT_SWAP_MAP[unit.type])
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
      case MOVE_TYPE_BLINK:
        this._fillMoveBlinkReset(y, x, UNIT_MOVE_RANGE_MIN_MAP[unit.type], UNIT_MOVE_RANGE_MAP[unit.type])
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
    if(afterMove && !UNIT_MOVE_AND_ATTACK_MAP.hasOwnProperty(unit.type)) {
      return
    }
    let atkRangeMin = 0, atkRangeMax = 0
    switch(UNIT_ATTACK_TYPE_MAP[unit.type]) {
      case ATTACK_TYPE_NONE:
        break
      case ATTACK_TYPE_GROUND:
      case ATTACK_TYPE_AERIAL:
        atkRangeMax = UNIT_ATTACK_RANGE_MAP[unit.type]
        atkRangeMin = UNIT_ATTACK_RANGE_MIN_MAP[unit.type]
        break
      default:
        console.error('null or unknown attack type')
    }
    for(let i = y-atkRangeMax; i <= y+atkRangeMax; i++) {
      for(let j = x-atkRangeMax; j <= x+atkRangeMax; j++) {
        if(i === y && j === x) {
          continue
        }
        if(i < 0 || i >= this.height || j < 0 || j >= this.width) {
          continue
        }
        if(hexDistance(y, x, i, j) > atkRangeMax || hexDistance(y, x, i, j) < atkRangeMin) {
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
   */
  deactivateAttackTerrains(unit, y, x) {
    let atkRangeMin = 0, atkRangeMax = 0
    switch(UNIT_ATTACK_TYPE_MAP[unit.type]) {
      case ATTACK_TYPE_NONE:
        break
      case ATTACK_TYPE_GROUND:
      case ATTACK_TYPE_AERIAL:
        atkRangeMax = UNIT_ATTACK_RANGE_MAP[unit.type]
        atkRangeMin = UNIT_ATTACK_RANGE_MIN_MAP[unit.type]
        break
      default:
        console.error('null or unknown attack type')
    }
    for(let i = y-atkRangeMax; i <= y+atkRangeMax; i++) {
      for(let j = x-atkRangeMax; j <= x+atkRangeMax; j++) {
        if(i === y && j === x) {
          continue
        }
        if(i < 0 || i >= this.height || j < 0 || j >= this.width) {
          continue
        }
        if(hexDistance(y, x, i, j) > atkRangeMax || hexDistance(y, x, i, j) < atkRangeMin) {
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
        const currUnit = this.units[ty][tx]
        if(currUnit) {
          if(currUnit.owner !== owner) {
            continue
          }
          if(UNIT_WEIGHT_MAP[currUnit.type] + weight > 1) {
            continue
          }
        }

        const dnext = d + calcMoveCost(this.terrains[ty][tx].type, weight)
        if(dnext <= steps) {
          pq.push(dnext, {y: ty, x: tx})
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
  // these are not mirrors from BE, because validation does not need to fill the cells specifically.
  // also fills for swap
  _fillMoveBlink(y, x, moveRangeMin, moveRangeMax, canSwap) {
    for(let i = y-moveRangeMax; i <= y+moveRangeMax; i++) {
      for(let j = x-moveRangeMax; j <= x+moveRangeMax; j++) {
        if(i < 0 || i >= this.height || j < 0 || j >= this.width) {
          continue
        }
        const dist = hexDistance(y, x, i, j)
        if(dist > moveRangeMax || dist < moveRangeMin) {
          continue
        }
        if(this.units[i][j]) {
          if(canSwap && this.units[y][x].owner === this.units[i][j].owner) {
            this.terrains[i][j].activateSwapTarget()
          }
          continue
        }
        this.terrains[i][j].dist = dist
        this.terrains[i][j].activateMoveTarget()
      }
    }
  }
  _fillMoveBlinkReset(y, x, moveRangeMin, moveRangeMax) {
    for(let i = y-moveRangeMax; i <= y+moveRangeMax; i++) {
      for(let j = x-moveRangeMax; j <= x+moveRangeMax; j++) {
        if(i < 0 || i >= this.height || j < 0 || j >= this.width) {
          continue
        }
        // no need to check distance
        this.terrains[i][j].dist = -1
        this.terrains[i][j].deactivate()
      }
    }
  }

  // game comms
  _sendCommsEndTurn() {
    // trigger comms to other objects to notify end turn
    this.comms.triggerMsg({
      cmd: COMMS_MAP_EVENT_END_TURN,
      data: {
        status: this.status,
        turn_count: this.turn_count,
        turn_player: this.turn_player,
      },
    }, GROUP_MAP_EVENT_LISTENERS)
  }
  handleComms(msg) {
    switch(msg.cmd) {
      case CMD_UNIT_STAY:
        this.units[msg.data.y_1][msg.data.x_1].toggleMoved()
        break
      case CMD_UNIT_MOVE:
        this._unitMove(msg.data.y_1, msg.data.x_1, msg.data.y_2, msg.data.x_2)
        if(this.units[msg.data.y_2][msg.data.x_2]) { // if dis a queen, might be gone already
          this.units[msg.data.y_2][msg.data.x_2].toggleMoved()
        }
        break
      case CMD_UNIT_ATTACK:
        this._unitAttack(msg.data.y_1, msg.data.x_1, msg.data.hp_atk, msg.data.y_t, msg.data.x_t, msg.data.hp_def)
        if(this.units[msg.data.y_1][msg.data.x_1]) {
          this.units[msg.data.y_1][msg.data.x_1].toggleMoved()
        }
        break
      case CMD_UNIT_MOVE_AND_ATTACK:
        this._unitMove(msg.data.y_1, msg.data.x_1, msg.data.y_2, msg.data.x_2)
        this._unitAttack(msg.data.y_2, msg.data.x_2, msg.data.hp_atk, msg.data.y_t, msg.data.x_t, msg.data.hp_def)
        if(this.units[msg.data.y_2][msg.data.x_2]) {
          this.units[msg.data.y_2][msg.data.x_2].toggleMoved()
        }
        break
      case CMD_UNIT_SWAP:
        this._unitSwap(msg.data.y_1, msg.data.x_1, msg.data.y_2, msg.data.x_2)
        this.units[msg.data.y_2][msg.data.x_2].toggleMoved()
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
    unit.setPosition(y2, x2)
    this._checkQueenOnThrone(y2, x2)
  }
  _unitAttack(y, x, hpAtk, yt, xt, hpDef) {
    this.units[y][x].setHP(hpAtk)
    this._checkUnitAlive(y, x)
    this.units[yt][xt].setHP(hpDef)
    this._checkUnitAlive(yt, xt)
  }
  _unitSwap(y1, x1, y2, x2) {
    const unit1 = this.units[y1][x1]
    this.units[y1][x1] = this.units[y2][x2]
    this.units[y2][x2] = unit1
    this.units[y1][x1].setPosition(y1, x1)
    this.units[y2][x2].setPosition(y2, x2)
    this._checkQueenOnThrone(y1, x1) // the swapped unit might be a queen
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
        this._assignPlayerRank(i+1, true)
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
        this._assignPlayerRank(this.units[y][x].owner, false)
        this._checkGameEnd()
      }
      this.units[y][x] = null
    }
  }
  _checkQueenOnThrone(y, x) {
    if(this.type === MAP_TYPE_ESCAPE) {
      if(this.terrains[y][x].type === TERRAIN_TYPE_THRONE) {
        if(this.units[y][x].type === UNIT_TYPE_QUEEN) {
          this._assignPlayerRank(this.units[y][x].owner, true)
          this.units[y][x].setHP(0) // need this additional step to remove the queen sprite
          this.units[y][x] = null
          this._checkGameEnd()
        }
      }
    }
  }
  _assignPlayerRank(player, win) {
    // modifying player directly is dangerous but whatever
    if(this.playerData[player-1].final_turns !== 0) {
      return
    }
    const rankTaken = []
    for(let i = 0; i <= this.playerData.length; i++) { rankTaken.push(false) }
    for(let i = 0; i < this.playerData.length; i++) {
      if(this.playerData[i].final_rank !== 0) { // player already ranked
        rankTaken[this.playerData[i].final_rank] = true
      }
    }
    if(win) {
      this.playerData[player-1].final_rank = 1
      while(rankTaken[this.playerData[player-1].final_rank]) {
        this.playerData[player-1].final_rank++
      }
    } else {
      this.playerData[player-1].final_rank = this.playerData.length
      while(rankTaken[this.playerData[player-1].final_rank]) {
        this.playerData[player-1].final_rank--
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
          // ice field terrain effect
          if(this.terrains[i][j].type === TERRAIN_TYPE_ICE_FIELD) {
            const dmg = 1 + UNIT_WEIGHT_MAP[this.units[i][j].type]
            this.units[i][j].setHP(Math.max(0, this.units[i][j].hp - dmg))
            this._checkUnitAlive(i, j)
          }
        }
      }
    }
    // just in case, also check if game ends
    this._checkGameEnd()
  }
}

export default MapForGame
