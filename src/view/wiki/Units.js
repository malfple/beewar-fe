import React from 'react'
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom'
import NotFound from '../NotFound'
import UnitYou from './UnitYou'
import UnitInfantry from './UnitInfantry'

function Units() {
  const {path} = useRouteMatch()

  const content = (
    <div>
      <h1>Units</h1>
      List of units:
      <ol>
        <li><Link to={`${path}/you`}>You</Link></li>
        <li><Link to={`${path}/infantry`}>Infantry</Link></li>
      </ol>
    </div>
  )

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        {content}
      </Route>
      <Route path={`${path}/you`}>
        <UnitYou />
      </Route>
      <Route path={`${path}/infantry`}>
        <UnitInfantry />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  )
}

export default Units
