import axios from 'axios'
import qs from 'querystring'

const axiosCustom = axios.create({
  timeout: 5000,
})

function requestLogin(username, password) {
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

/*
When trying to send a POST request with access token in payload, please check whether the token is expired.
If it is, please refresh. You can use UserTokenContext > checkTokenAndRefresh
 */

export {
  axiosCustom,
  requestLogin,
}
