import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import MapView from './MapView'
import MapList from './MapList'

function Map() {
  const {path} = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route path={`${path}/list`}>
          <MapList />
        </Route>
        <Route path={`${path}/:id`} >
          <MapView />
        </Route>
      </Switch>
    </div>
  )
}

export default Map
