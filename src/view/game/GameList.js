import React, {useContext, useEffect, useState} from 'react'

import {apiGameList} from '../../modules/api/game'
import {UserTokenContext} from '../../context'
import GameCard from '../../components/GameCard'

function GameList() {
  const userToken = useContext(UserTokenContext)
  const [games, setGames] = useState([])

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiGameList(userToken.token).then(res => {
        setGames(res.data.games)
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

export default GameList
