import React, {useContext, useEffect, useState} from 'react'

import {apiGameList} from '../../modules/api/game'
import {UserTokenContext} from '../../context'
import GameCard from '../../components/GameCard'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'

function GameList() {
  const userToken = useContext(UserTokenContext)
  const [state, setState] = useState({
    loading: true,
    games: [],
  })

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiGameList(userToken.token).then(res => {
        setState({
          loading: false,
          games: res.data.games,
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
        {state.loading ? <NormalLoadingSpinner /> : null}
        {state.games.map((game, i) => <GameCard key={i} game={game} />)}
      </div>
    </div>
  )
}

export default GameList
