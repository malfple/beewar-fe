import React, {useEffect, useState} from 'react'

import {apiMapList} from '../../modules/api/map'
import MapCard from '../../components/MapCard'

function MapList() {
  const [maps, setMaps] = useState([])

  useEffect(() => {
    apiMapList().then(res => {
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
