import * as PIXI from 'pixi.js'

import Terrain from './Terrain'
import Unit from './Unit'

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

    const terrainInfo = atob(mapData.terrain_info)
    const unitInfo = atob(mapData.unit_info)

    // also builds units grid
    for(let i = 0; i < mapData.height; i++) {
      this.terrains.push([])
      this.units.push([])
      for(let j = 0; j < mapData.width; j++) {
        const terrainType = terrainInfo.charCodeAt(i * mapData.width + j)
        const terrain = new Terrain(terrainType, i, j)
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
          unit = new Unit(cy, cx, p, t, hp, s, unitInteractive, this.handleUnitClick.bind(this))
          i += 6
      }

      if(unit) {
        this.pixiNode.addChild(unit.pixiNode)
        this.units[cy][cx] = unit
      }
    }
  }

  handleUnitClick(unit, e) {
    console.log('click')
    console.log('unit ', unit)
    console.log('this ', this)
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
