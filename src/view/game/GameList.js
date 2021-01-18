import React, {useContext, useEffect, useState} from 'react'
import qs from 'querystring'

import {axiosCustom} from '../../modules/api/api'
import {UserTokenContext} from '../../context'
import GameCard from '../../components/GameCard'

function GameList() {
  const userToken = useContext(UserTokenContext)
  const [games, setGames] = useState([])

  useEffect(() => {
    axiosCustom({
      method: 'POST',
      url: '/api/game/list',
      data: qs.stringify({
        token: userToken.token,
      }),
    }).then(res => {
      setGames(res.data.game_users)
    })
  }, [userToken.token])

  return (
    <div>
      <h1>Games</h1>
      <div>
        {games.map((game, i) => <GameCard key={i} game={game} />)}
      </div>
    </div>
  )
}

export default GameList
