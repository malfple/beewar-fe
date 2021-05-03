import React, {useContext, useEffect, useState} from 'react'

import {apiGameMyGames} from '../../modules/api/game'
import {UserTokenContext} from '../../context'
import GameCard from '../../components/GameCard'

function MyGames() {
  const userToken = useContext(UserTokenContext)
  const [state, setState] = useState({
    games: [],
    gameUsers: [],
  })

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiGameMyGames(userToken.token).then(res => {
        setState({
          games: res.data.games,
          gameUsers: res.data.game_users,
        })
      })
    }).catch(() => {
      // do nothing
    })

  }, [userToken])

  return (
    <div>
      <h1>Games</h1>
      <div>
        {state.games.map((game, i) => <GameCard key={i} game={game} gameUser={state.gameUsers[i]} />)}
      </div>
    </div>
  )
}

export default MyGames
