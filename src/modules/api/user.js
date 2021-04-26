import {axiosCustom} from './api'

function apiUserGetByUsername(username) {
  return axiosCustom.get('/api/user/get_by_username', {
    params: {
      username: username,
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
  apiUserList,
}
