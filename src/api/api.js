import axios from 'axios'
import qs from 'querystring'

import config from '../config/config'

const axiosCustom = axios.create({
  baseURL: config.BEServer,
  timeout: 5000
})

function requestLogin(username, password) {
  return axiosCustom({
    method: 'POST',
    url: '/auth/login',
    data: qs.stringify({
      username: username,
      password: password
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

function requestProfile(username) {
  return axiosCustom.get('/profile', {
    params: {
      username: username
    }
  })
}

export {
  axiosCustom,
  requestLogin,
  requestProfile
}
