import qs from 'querystring'
import {axiosCustom} from './api'

function apiAuthLogin(username, password) {
  return axiosCustom({
    method: 'POST',
    url: '/api/auth/login',
    data: qs.stringify({
      username: username,
      password: password,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

function apiAuthToken() {
  return axiosCustom({
    method: 'POST',
    url: '/api/auth/token',
  })
}

function apiAuthLogout() {
  return axiosCustom({
    method: 'POST',
    url: '/api/auth/logout',
  })
}

export {
  apiAuthLogin,
  apiAuthToken,
  apiAuthLogout,
}
