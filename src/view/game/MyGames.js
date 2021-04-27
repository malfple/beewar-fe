import React, {useContext, useEffect, useState} from 'react'

import {apiGameMyGames} from '../../modules/api/game'
import {UserTokenContext} from '../../context'
import GameCard from '../../components/GameCard'

function MyGames() {
  const userToken = useContext(UserTokenContext)
  const [games, setGames] = useState([])

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiGameMyGames(userToken.token).then(res => {
        setGames(res.data.game_users)
      })
    }).catch(() => {
      // do nothing
    })

  }, [userToken])

  return (
    <div>
      <h1>Games</h1>
      <div>
        {games.map((game, i) => <GameCard key={i} game={game} />)}
      </div>
    </div>
  )
}

export default MyGames