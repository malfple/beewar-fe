import {axiosCustom} from './api'

function apiGameMyGames(token) {
  return axiosCustom.get('/api/game/my_games', {
    headers: {
      'Beewar-A-Token': token,
    },
  })
}

export {
  apiGameMyGames,
}
