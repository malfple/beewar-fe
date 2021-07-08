import {axiosCustom} from './api'

function apiMapList() {
  return axiosCustom.get('/api/map/list', {
    params: {
      limit: 10,
      offset: 0,
    },
  })
}

function apiMapGet(mapID) {
  return axiosCustom.get('/api/map/get', {
    params: {
      id: mapID,
    },
  })
}

function apiMapCreate(token) {
  return axiosCustom({
    method: 'POST',
    url: '/api/map/create',
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

/**
 * @param token
 * @param {number} mapID
 * @param {number} mapType
 * @param {number} height
 * @param {number} width
 * @param {string} name
 * @param {number} playerCount
 * @param {string} terrainInfo
 * @param {string} unitInfo
 */
function apiMapUpdate(token, mapID, mapType, height, width, name, playerCount, terrainInfo, unitInfo) {
  return axiosCustom({
    method: 'POST',
    url: '/api/map/update',
    data: {
      map_id: parseInt(mapID),
      map_type: parseInt(mapType),
      height: parseInt(height),
      width: parseInt(width),
      name: name,
      player_count: parseInt(playerCount),
      terrain_info: terrainInfo,
      unit_info: unitInfo,
    },
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

export {
  apiMapList,
  apiMapGet,
  apiMapCreate,
  apiMapUpdate,
}
