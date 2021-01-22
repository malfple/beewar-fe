import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

import {apiMapGet} from '../../modules/api/map'
import MapViewApp from '../../components/pixiapp/MapViewApp'

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
        Map not found!
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
    </div>
  )
}

export default MapView
