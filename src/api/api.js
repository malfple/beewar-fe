import axios from 'axios'
import qs from 'querystring'

import config from '../config/config'

function APIRequest(api, method, data) {
  return axios({
    method: method,
    url: config.BEServer + api,
    data: data,
  })
}

function APIRequestForm(api, method, data) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  return axios({
    method: method,
    url: config.BEServer + api,
    data: qs.stringify(data),
    headers: headers,
  })
}

export {APIRequest, APIRequestForm}
