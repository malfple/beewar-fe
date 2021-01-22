import {axiosCustom} from './api'
import qs from 'querystring'

function apiGameList(token) {
  return axiosCustom({
    method: 'POST',
    url: '/api/game/list',
    data: qs.stringify({
      token: token,
    }),
  })
}

export {
  apiGameList,
}
