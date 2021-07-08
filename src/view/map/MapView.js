import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import MapViewApp from '../../components/pixiapp/MapViewApp'
import Button from '../../components/forms/button/Button'
import UserLabel from '../../components/userlabel/UserLabel'

function MapView(props) {
  return (
    <div className="map-game-view">
      <div className="map-game-view__column-left">
        <div>
          <MapViewApp map={props.map} />
        </div>
      </div>
      <div className="map-game-view__column-right">
        <h1>{props.map.name}</h1>
        <div>Author: <UserLabel userID={props.map.author_user_id} /></div>
        <div>Size (width x height): {props.map.width} x {props.map.height}</div>
        <div>
          <Button theme="hollow" small={true}>
            <Link to={`/game/create/${props.map.id}`}>
              Create a game using this map
            </Link>
          </Button>
        </div>
        <div>
          <Button theme="hollow" small={true}>
            <Link to={`/map/edit/${props.map.id}`}>
              Edit Map
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

MapView.propTypes = {
  map: PropTypes.object.isRequired,
}

export default MapView
