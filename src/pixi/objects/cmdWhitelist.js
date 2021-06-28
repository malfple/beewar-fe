// MIRROR: copy from BE, but not full

import {UNIT_TYPE_INFANTRY, UNIT_TYPE_JET_CREW, UNIT_TYPE_TANK} from './unitConstants'

const UNIT_MOVE_AND_ATTACK_MAP = {}

UNIT_MOVE_AND_ATTACK_MAP[UNIT_TYPE_INFANTRY] = true
UNIT_MOVE_AND_ATTACK_MAP[UNIT_TYPE_JET_CREW] = true
UNIT_MOVE_AND_ATTACK_MAP[UNIT_TYPE_TANK] = true

export {
  UNIT_MOVE_AND_ATTACK_MAP,
}
