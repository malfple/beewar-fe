// copy from BE

import {
  TERRAIN_TYPE_HONEY_FIELD, TERRAIN_TYPE_ICE_FIELD,
  TERRAIN_TYPE_PLAINS, TERRAIN_TYPE_VOID,
  TERRAIN_TYPE_WALLS,
  TERRAIN_TYPE_WASTELAND,
} from '../pixi/objects/terrainConstants'

/**
 * @param {number} terrainType
 * @param {number} unitWeight
 * @returns {number}
 */
function calcMoveCost(terrainType, unitWeight) {
  switch (terrainType) {
    case TERRAIN_TYPE_VOID:
      return 999999
    case TERRAIN_TYPE_PLAINS:
      return 1
    case TERRAIN_TYPE_WALLS:
      return 999999
    case TERRAIN_TYPE_HONEY_FIELD:
      return 2
    case TERRAIN_TYPE_WASTELAND:
      return 1 + unitWeight
    case TERRAIN_TYPE_ICE_FIELD:
      return 2
    default:
      // do nothing
  }
  return 999999
}

export {
  calcMoveCost,
}
