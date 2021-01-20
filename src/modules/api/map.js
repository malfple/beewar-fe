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

export {
  apiMapList,
  apiMapGet,
}
