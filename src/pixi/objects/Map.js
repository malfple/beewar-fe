import * as PIXI from 'pixi.js'

import Terrain from './Terrain'
import Unit from './Unit'
import {nullGameComms} from '../../modules/communication/GameComms'

/**
 * This class is responsible for rendering the map in map view
 */
class Map {
  /**
   * @param {Object}    mapData
   * @param {GameComms} comms         - added here because it's needed by terrain
   */
  constructor(mapData, comms=nullGameComms) {
    this.type = mapData.type
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
        this.terrains[i].push(null)
        this.units[i].push(null)
        this.createTerrain(terrainType, i, j)
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
      switch (t) {
        default: // basic ordinary units
          this.createUnit(cy, cx, p, t, hp, s)
          i += 6
      }
    }
  }

  createTerrain(type, y, x) {
    const terrain = new Terrain(type, y, x, false)
    if(terrain.pixiNode) {
      this.pixiNode.addChild(terrain.pixiNode)
    }
    this.terrains[y][x] = terrain
  }

  createUnit(y, x, owner, type, hp, state) {
    const unit = new Unit(y, x, owner, type, hp, state)
    this.pixiNode.addChild(unit.pixiNode)
    this.units[y][x] = unit
  }

  removeTerrain(y, x) {
    if(this.terrains[y][x]) {
      this.terrains[y][x].pixiNode.destroy({
        children: true,
      })
      this.terrains[y][x] = null
    }
  }

  removeUnit(y, x) {
    if(this.units[y][x]) {
      this.units[y][x].pixiNode.destroy({
        children: true,
      })
      this.units[y][x] = null
    }
  }
}

export default Map
