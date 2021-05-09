/*
MIRROR: These constants are mirrored from backend
 */

const UNIT_TYPE_QUEEN = 1
const UNIT_TYPE_INFANTRY = 3

const UNIT_WEIGHT_QUEEN = 0
const UNIT_WEIGHT_INFANTRY = 0
const UNIT_WEIGHT_MAP = [
  -1,
  UNIT_WEIGHT_QUEEN,
  -1,
  UNIT_WEIGHT_INFANTRY,
]

const MOVE_TYPE_NONE = 0
const MOVE_TYPE_GROUND = 1
const UNIT_MOVE_TYPE_MAP = [
  -1,
  MOVE_TYPE_GROUND,
  -1,
  MOVE_TYPE_GROUND,
]

const UNIT_MOVE_RANGE_QUEEN = 1
const UNIT_MOVE_RANGE_INFANTRY = 3
const UNIT_MOVE_RANGE_MAP = [
  -1,
  UNIT_MOVE_RANGE_QUEEN,
  -1,
  UNIT_MOVE_RANGE_INFANTRY,
]

const ATTACK_TYPE_NONE = 0
const ATTACK_TYPE_GROUND = 1
const UNIT_ATTACK_TYPE_MAP = [
  -1,
  ATTACK_TYPE_NONE,
  -1,
  ATTACK_TYPE_GROUND,
]

const UNIT_ATTACK_RANGE_QUEEN = 0
const UNIT_ATTACK_RANGE_INFANTRY = 1
const UNIT_ATTACK_RANGE_MAP = [
  -1,
  UNIT_ATTACK_RANGE_QUEEN,
  -1,
  UNIT_ATTACK_RANGE_INFANTRY,
]

const UNIT_STATE_BIT_MOVED = 1

/*
Color constants
 */
const PLAYER_COLOR_TINT = [
  0, // unused
  0xFF6666,
  0x6666FF,
  0x22AA00,
  0x8800CC,
]

export {
  UNIT_TYPE_QUEEN,
  UNIT_TYPE_INFANTRY,

  UNIT_WEIGHT_QUEEN,
  UNIT_WEIGHT_INFANTRY,
  UNIT_WEIGHT_MAP,

  MOVE_TYPE_NONE,
  MOVE_TYPE_GROUND,
  UNIT_MOVE_TYPE_MAP,

  UNIT_MOVE_RANGE_QUEEN,
  UNIT_MOVE_RANGE_INFANTRY,
  UNIT_MOVE_RANGE_MAP,

  ATTACK_TYPE_NONE,
  ATTACK_TYPE_GROUND,
  UNIT_ATTACK_TYPE_MAP,

  UNIT_ATTACK_RANGE_QUEEN,
  UNIT_ATTACK_RANGE_INFANTRY,
  UNIT_ATTACK_RANGE_MAP,

  UNIT_STATE_BIT_MOVED,

  PLAYER_COLOR_TINT,
}
