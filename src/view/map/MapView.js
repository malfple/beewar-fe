import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {axiosCustom} from '../../api/api'

import Grid from '../../components/gamemap/Grid'

function MapView() {
  let [map, setMap] = useState(null)
  let {id} = useParams()

  useEffect(() => {
    axiosCustom.get('/map/get', {
      params: {
        id: id
      }
    }).then(res => {
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
        <Grid map={map} />
      </div>
    </div>
  )
}

export default MapView
