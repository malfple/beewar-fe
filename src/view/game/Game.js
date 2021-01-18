import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import GameView from './GameView'
import GameList from './GameList'

function Game() {
  const {path} = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route path={`${path}/list`} >
          <GameList />
        </Route>
        <Route path={`${path}/:id`} >
          <GameView />
        </Route>
      </Switch>
    </div>
  )
}

export default Game
