import {axiosCustom} from './api'
import qs from 'querystring'

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
 * @param {int}    mapID
 * @param {string} password
 */
function apiGameCreate(token, mapID, password) {
  return axiosCustom({
    method: 'POST',
    url: '/api/game/create',
    data: qs.stringify({
      map_id: mapID,
      password: password,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Beewar-A-Token': token,
    },
  })
}

export {
  apiGameMyGames,
  apiGameList,
  apiGameCreate,
}
