import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'

import {apiMapGet} from '../../modules/api/map'
import MapViewApp from '../../components/pixiapp/MapViewApp'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'
import Button from '../../components/forms/button/Button'
import UserLabel from '../../components/userlabel/UserLabel'

function MapView() {
  const [map, setMap] = useState(null)
  const {id} = useParams()

  useEffect(() => {
    apiMapGet(id).then(res => {
      if(res.data.map) {
        setMap(res.data.map)
      }
    })

  }, [id])

  if(!map) {
    return (
      <div>
        <NormalLoadingSpinner />
      </div>
    )
  }

  return (
    <div className="map-game-view">
      <div className="map-game-view__column-left">
        <div>
          <MapViewApp map={map} />
        </div>
      </div>
      <div className="map-game-view__column-right">
        <h1>{map.name}</h1>
        <div>Author: <UserLabel userID={map.author_user_id} /></div>
        <div>Size (width x height): {map.width} x {map.height}</div>
        <div>
          <Button theme="hollow" small={true}>
            <Link to={`/game/create/${id}`}>
              Create a game using this map
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MapView
