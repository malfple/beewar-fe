import {axiosCustom} from './api'
import axios from 'axios'

function apiUserGetByUsername(username) {
  return axiosCustom.get('/api/user/get_by_username', {
    params: {
      username: username,
    },
  })
}

/**
 * @param {Array<number>} ids
 */
function apiUserGetManyByID(ids) {
  return axios.get('/api/user/get_many_by_id', {
    params: {
      ids: ids.join(','),
    },
  })
}

function apiUserList() {
  return axiosCustom.get('/api/user/list', {
    params: {
      limit: 100,
      offset: 0,
    },
  })
}

export {
  apiUserGetByUsername,
  apiUserGetManyByID,
  apiUserList,
}
