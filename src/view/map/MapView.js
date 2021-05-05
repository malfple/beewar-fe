import React, {useContext, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import {apiMapGet} from '../../modules/api/map'
import MapViewApp from '../../components/pixiapp/MapViewApp'
import {UserTokenContext} from '../../context'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'

function MapView() {
  const [map, setMap] = useState(null)
  const {id} = useParams()
  const userToken = useContext(UserTokenContext)
  const history = useHistory()

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
      <button onClick={() => {
        history.push(`/game/create/${id}`)
      }}>Create Game</button>
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
      {id}
      <div>size (w * h): {map.width} x {map.height}</div>
      <div>name: {map.name}</div>
      <div>
        Terrain
        <MapViewApp map={map} />
      </div>
      <div>
        {createGameButton}
      </div>
    </div>
  )
}

export default MapView
