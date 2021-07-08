import {nullGameComms} from '../../modules/communication/GameComms'
import {TERRAIN_TYPE_VOID} from './terrainConstants'
import {COMMS_BRUSH_SELECT, COMMS_TERRAIN_CLICK} from '../../modules/communication/messageConstants'
import {TERRAIN_BRUSH, UNIT_BRUSH} from './editorConstants'
import {UNIT_MAX_HP_MAP} from './unitConstants'

/**
 * Keeps track of the current brush, listens to events for brush change and terrain click,
 * and updates map accordingly.
 */
class MapInteractionControllerForEdit {
  /**
   * @param {MapForEdit}  map
   * @param {GameComms}   comms
   */
  constructor(map, comms=nullGameComms) {
    this.map = map
    this.comms = comms

    this.brushCode = TERRAIN_BRUSH + TERRAIN_TYPE_VOID
    this.playerOrder = 1
  }

  // required by comms
  handleComms(msg) {
    switch(msg.cmd) {
      case COMMS_BRUSH_SELECT:
        if(msg.data.brush_code !== -1) {
          this.brushCode = msg.data.brush_code
        }
        if(msg.data.player_order !== -1) {
          this.playerOrder = msg.data.player_order
        }
        break
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
    console.log(`set cell (${y}, ${x}) to brush ${this.brushCode}, player ${this.playerOrder}`)
    if(this.brushCode >= TERRAIN_BRUSH && this.brushCode < UNIT_BRUSH) {
      // it's a terrain brush
      this.map.terrains[y][x].pixiNode.destroy({
        children: true,
      })
      this.map.terrains[y][x] = null
      if(this.map.units[y][x]) {
        this.map.units[y][x].pixiNode.destroy({
          children: true,
        })
        this.map.units[y][x] = null
      }

      this.map.createTerrain(this.brushCode - TERRAIN_BRUSH, y, x)
    } else {
      // it's a unit brush
      if(this.map.units[y][x]) {
        this.map.units[y][x].pixiNode.destroy({
          children: true,
        })
        this.map.units[y][x] = null
      }

      // only certain terrains
      if(this.map.terrains[y][x].type !== TERRAIN_TYPE_VOID) {
        // add unit, logic replicated from Map
        this.map.createUnit(y, x, this.playerOrder, this.brushCode - UNIT_BRUSH, UNIT_MAX_HP_MAP[this.brushCode - UNIT_BRUSH], 0)
      }
    }
  }
}

export default MapInteractionControllerForEdit
