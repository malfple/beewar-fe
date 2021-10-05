import {axiosCustom} from './api'

function apiCampaignList(token) {
  return axiosCustom.get('/api/campaign/list', {
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

function apiCampaignCurrent(token) {
  return axiosCustom.get('/api/campaign/current', {
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

function apiCampaignStart(token, campaignLevel) {
  return axiosCustom({
    method: 'POST',
    url: '/api/campaign/start',
    data: {
      campaign_level: parseInt(campaignLevel),
    },
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

export {
  apiCampaignList,
  apiCampaignCurrent,
  apiCampaignStart,
}
