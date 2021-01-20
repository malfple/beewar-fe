import axios from 'axios'

const axiosCustom = axios.create({
  timeout: 5000,
})

function apiPing() {
  return axiosCustom.get('/api/')
}

function apiServerStats() {
  return axiosCustom.get('/api/server_stats')
}

/*
When trying to send a POST request with access token in payload, please check whether the token is expired.
If it is, please refresh. You can use UserTokenContext > checkTokenAndRefresh
 */

export {
  axiosCustom,
  apiPing,
  apiServerStats,
}
