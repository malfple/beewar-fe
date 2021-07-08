import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import MapView from './MapView'
import MapList from './MapList'
import RouteWithLogin from '../../components/route/RouteWithLogin'
import MapEdit from './MapEdit'
import withFetchMapData from './withFetchMapData'

const MapViewWithFetchMapData = withFetchMapData(MapView)
const MapEditWithFetchMapData = withFetchMapData(MapEdit)

  function Map() {
  const {path} = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route path={`${path}/list`}>
          <MapList />
        </Route>
        <RouteWithLogin path={`${path}/edit/:id`}>
          <MapEditWithFetchMapData />
        </RouteWithLogin>
        <Route path={`${path}/:id`} >
          <MapViewWithFetchMapData />
        </Route>
      </Switch>
    </div>
  )
}

export default Map
