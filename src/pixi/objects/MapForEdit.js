import Map from './Map'
import Terrain from './Terrain'

/**
 * This class is an extension of Map and allows terrain and unit change/edit
 */
class MapForEdit extends Map {
  createTerrain(type, y, x) {
    const terrain = new Terrain(type, y, x, true, true, this.comms)
    if(terrain.pixiNode) {
      this.pixiNode.addChild(terrain.pixiNode)
    }
    this.terrains[y][x] = terrain
  }
}

export default MapForEdit
