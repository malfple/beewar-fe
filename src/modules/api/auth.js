import {axiosCustom} from './api'

function apiAuthLogin(username, password) {
  return axiosCustom({
    method: 'POST',
    url: '/api/auth/login',
    data: {
      username: username,
      password: password,
    },
  })
}

function apiAuthRegister(email, username, password) {
  return axiosCustom({
    method: 'POST',
    url: '/api/auth/register',
    data: {
      email:    email,
      username: username,
      password: password,
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
  apiAuthRegister,
  apiAuthToken,
  apiAuthLogout,
}
