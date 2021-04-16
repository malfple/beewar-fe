import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import GameView from './GameView'
import MyGames from './MyGames'
import GameList from './GameList'
import GameCreate from './GameCreate'

function Game() {
  const {path} = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route path={`${path}/my_games`} >
          <MyGames />
        </Route>
        <Route path={`${path}/list`} >
          <GameList />
        </Route>
        <Route path={`${path}/create/:map_id`} >
          <GameCreate />
        </Route>
        <Route path={`${path}/:id`} >
          <GameView />
        </Route>
      </Switch>
    </div>
  )
}

export default Game
