import {axiosCustom} from './api'

function apiGameMyGames(token) {
  return axiosCustom.get('/api/game/my_games', {
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

function apiGameList(token) {
  return axiosCustom.get('/api/game/list', {
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

/**
 * @param {string} token
 * @param {number} mapID
 * @param {string} password
 */
function apiGameCreate(token, mapID, password) {
  return axiosCustom({
    method: 'POST',
    url: '/api/game/create',
    data: {
      map_id: parseInt(mapID),
      password: password,
    },
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

/**
 * @param {string} token
 * @param {number} gameID
 * @param {number} playerOrder
 * @param {string} password
 */
function apiGameBeebotJoin(token, gameID, playerOrder, password) {
  return axiosCustom({
    method: 'POST',
    url: '/api/game/beebot_join',
    data: {
      game_id: parseInt(gameID),
      player_order: parseInt(playerOrder),
      password: password,
    },
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

export {
  apiGameMyGames,
  apiGameList,
  apiGameCreate,
  apiGameBeebotJoin,
}
