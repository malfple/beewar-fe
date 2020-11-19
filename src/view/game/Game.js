import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import GameView from './GameView'

function Game(props) {
  let {path} = useRouteMatch()

  return (
    <div>
      Game
      <Switch>
        <Route path={`${path}/:id`} >
          <GameView token={props.token} />
        </Route>
      </Switch>
    </div>
  )
}

export default Game
