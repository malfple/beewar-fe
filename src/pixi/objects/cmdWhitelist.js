// MIRROR: copy from BE, but not full

import {UNIT_TYPE_INFANTRY, UNIT_TYPE_JET_CREW, UNIT_TYPE_TANK, UNIT_TYPE_WIZARD} from './unitConstants'

const UNIT_MOVE_AND_ATTACK_MAP = {}
UNIT_MOVE_AND_ATTACK_MAP[UNIT_TYPE_INFANTRY] = true
UNIT_MOVE_AND_ATTACK_MAP[UNIT_TYPE_JET_CREW] = true
UNIT_MOVE_AND_ATTACK_MAP[UNIT_TYPE_TANK] = true

const UNIT_SWAP_MAP = {}
UNIT_SWAP_MAP[UNIT_TYPE_WIZARD] = true

export {
  UNIT_MOVE_AND_ATTACK_MAP,
  UNIT_SWAP_MAP,
}
