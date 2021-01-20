import {axiosCustom} from './api'

function apiUserGetByUsername(username) {
  return axiosCustom.get('/api/user/get_by_username', {
    params: {
      username: username,
    },
  })
}

export {
  apiUserGetByUsername,
}
