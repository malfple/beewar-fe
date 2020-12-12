import * as PIXI from 'pixi.js'

import Terrain from './Terrain'
import Unit from './Unit'
import {
  UNIT_MOVE_STEPS_INFANTRY,
  UNIT_MOVE_STEPS_YOU,
  UNIT_TYPE_INFANTRY,
  UNIT_TYPE_YOU,
  UNIT_WEIGHT_MAP,
} from './unitConstants'

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
  constructor(mapData, unitInteractive=false) {
    this.height = mapData.height
    this.width = mapData.width
    this.terrains = []
    this.units = []
    this.pixiNode = new PIXI.Container()
    this.selectedUnit = null

    const terrainInfo = atob(mapData.terrain_info)
    const unitInfo = atob(mapData.unit_info)

    // also builds units grid
    for(let i = 0; i < mapData.height; i++) {
      this.terrains.push([])
      this.units.push([])
      for(let j = 0; j < mapData.width; j++) {
        const terrainType = terrainInfo.charCodeAt(i * mapData.width + j)
        const terrain = new Terrain(terrainType, i, j, unitInteractive, this.handleUnitClick.bind(this))
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

  handleUnitClick(y, x, e) {
    console.log('click')
    console.log('pos ', y, x)
    if(this.units[y][x]) { // select unit to move
      if(this.selectedUnit) {
        this.selectedUnit.deselect()
        this._deactivateTerrains(this.selectedUnit.y, this.selectedUnit.x)
      }
      if(this.selectedUnit === this.units[y][x]) {
        this.selectedUnit = null
        return
      }
      this.units[y][x].select()
      this.selectedUnit = this.units[y][x]
      this._activateTerrains(y, x)
    } else { // deselect
      if(this.selectedUnit) {
        this.selectedUnit.deselect()
        this._deactivateTerrains(this.selectedUnit.y, this.selectedUnit.x)
        this.selectedUnit = null
      }
    }
  }

  // there needs to be a unit at (y, x)
  _activateTerrains(y, x) {
    switch(this.units[y][x].type) {
      case UNIT_TYPE_YOU:
        this._bfs(y, x, UNIT_MOVE_STEPS_YOU)
        break
      case UNIT_TYPE_INFANTRY:
        this._bfs(y, x, UNIT_MOVE_STEPS_INFANTRY)
        break
      default:
        console.error('null or unknown unit')
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
  // there needs to be a unit at (y, x)
  _bfs(y, x, steps) {
    const queue = []
    let ptq = 0
    const unit = this.units[y][x]
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
          if(currUnit.owner !== unit.owner) {
            continue
          }
          if(UNIT_WEIGHT_MAP[currUnit.type] + UNIT_WEIGHT_MAP[unit.type] > 1) {
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

  // ends turn and starts turn for the specified players
  // MIRROR: there is a similar backend function to this one
  nextTurn(endTurnPlayer, startTurnPlayer) {
    for(let i = 0; i < this.height; i++) {
      for(let j = 0; j < this.width; j++) {
        if(!this.units[i][j]) {
          continue
        }
        if(this.units[i][j].owner === endTurnPlayer) {
          this.units[i][j].endTurn()
        }else if(this.units[i][j].owner === startTurnPlayer) {
          this.units[i][j].startTurn()
        }
      }
    }
  }
}

export default MapController
