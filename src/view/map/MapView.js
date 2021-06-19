import React, {useContext, useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'

import {apiMapGet} from '../../modules/api/map'
import MapViewApp from '../../components/pixiapp/MapViewApp'
import {UserTokenContext} from '../../context'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'
import Button from '../../components/forms/button/Button'

function MapView() {
  const [map, setMap] = useState(null)
  const {id} = useParams()
  const userToken = useContext(UserTokenContext)

  useEffect(() => {
    apiMapGet(id).then(res => {
      if(res.data.map) {
        setMap(res.data.map)
      }
    })

  }, [id])

  let createGameButton = null
  if(userToken.username !== '') {
    createGameButton = (
      <Button theme="hollow">
        <Link to={`/game/create/${id}`}>
          Create a game using this map
        </Link>
      </Button>
    )
  }

  if(!map) {
    return (
      <div>
        <NormalLoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <h1>{map.name}</h1>
      <div>Size (width x height): {map.width} x {map.height}</div>
      <div>
        <MapViewApp map={map} />
      </div>
      <div>
        {createGameButton}
      </div>
    </div>
  )
}

export default MapView
