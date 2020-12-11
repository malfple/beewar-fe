import * as PIXI from 'pixi.js'

import Terrain from './Terrain'
import Unit from './Unit'

/**
 * this class is responsible for rendering the map and updating it
 */
class MapController {
  constructor(mapData, unitInteractive=false) {
    this.pixiNode = new PIXI.Container()
    this.terrains = []
    this.units = []

    let terrainInfo = atob(mapData.terrain_info)
    let unitInfo = atob(mapData.unit_info)

    // also builds units grid
    for(let i = 0; i < mapData.height; i++) {
      this.terrains.push([])
      this.units.push([])
      for(let j = 0; j < mapData.width; j++) {
        let terrainType = terrainInfo.charCodeAt(i * mapData.width + j)
        let terrain = new Terrain(terrainType, i, j)
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
      let cy = unitInfo.charCodeAt(i)
      let cx = unitInfo.charCodeAt(i+1)
      let p = unitInfo.charCodeAt(i+2)
      let t = unitInfo.charCodeAt(i+3)
      let hp = unitInfo.charCodeAt(i+4)
      let s = unitInfo.charCodeAt(i+5)

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
}

export default MapController
