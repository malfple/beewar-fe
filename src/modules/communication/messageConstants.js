/*
MIRROR: These constants are mirrored from backend
 */

const CMD_CHAT = 'CHAT'

const CMD_GAME_DATA = 'GAME_DATA'
const CMD_JOIN = 'JOIN'
const CMD_PING = 'PING'
const CMD_ERROR = 'ERROR'

const CMD_UNIT_STAY = 'UNIT_STAY'
const CMD_UNIT_MOVE = 'UNIT_MOVE'
const CMD_UNIT_ATTACK = 'UNIT_ATTACK'
const CMD_UNIT_MOVE_AND_ATTACK = 'UNIT_MOVE_ATTACK'
const CMD_UNIT_SWAP = 'UNIT_SWAP'

const CMD_END_TURN = 'END_TURN'

/*
FE specific commands
 */
const COMMS_TERRAIN_CLICK = 'TERRAIN_CLICK'
// terrain click data
// {y, x} position only
const COMMS_MAP_EVENT_END_TURN = 'MAP_END_TURN'
// end turn data
// {status, turn_count, turn_player}
const COMMS_BRUSH_SELECT = 'BRUSH_SELECT'
// brush select
// {brush_code, player_order}
const COMMS_MAP_SIZE_CHANGE = 'MAP_SIZE_CHANGE'
// change map size
// {side: U/D/L/R, diff: +1/-1}

export {
  CMD_CHAT,

  CMD_GAME_DATA,
  CMD_JOIN,
  CMD_PING,
  CMD_ERROR,

  CMD_UNIT_STAY,
  CMD_UNIT_MOVE,
  CMD_UNIT_ATTACK,
  CMD_UNIT_MOVE_AND_ATTACK,
  CMD_UNIT_SWAP,

  CMD_END_TURN,

  COMMS_TERRAIN_CLICK,
  COMMS_MAP_EVENT_END_TURN,
  COMMS_BRUSH_SELECT,
  COMMS_MAP_SIZE_CHANGE,
}
