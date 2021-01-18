import React, {useEffect, useState} from 'react'

import {axiosCustom} from '../../modules/api/api'
import MapCard from '../../components/MapCard'

function MapList() {
  const [maps, setMaps] = useState([])

  useEffect(() => {
    axiosCustom.get('/api/map/list', {
      params: {
        limit: 10,
        offset: 0,
      },
    }).then(res => {
      setMaps(res.data.maps)
    })
  }, [])

  return (
    <div>
      <h1>Maps</h1>
      <div>
        {maps.map((map, i) => <MapCard key={i} map={map} />)}
      </div>
    </div>
  )
}

export default MapList
