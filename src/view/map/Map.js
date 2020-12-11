import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import MapView from './MapView'

function Map() {
  const {path} = useRouteMatch()

  return (
    <div>
      Maps
      <Switch>
        <Route path={`${path}/:id`} >
          <MapView />
        </Route>
      </Switch>
    </div>
  )
}

export default Map
