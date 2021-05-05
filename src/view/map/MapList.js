import React, {useEffect, useState} from 'react'

import {apiMapList} from '../../modules/api/map'
import MapCard from '../../components/MapCard'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'

function MapList() {
  const [state, setState] = useState({
    loading: true,
    maps: [],
  })

  useEffect(() => {
    apiMapList().then(res => {
      setState({
        loading: false,
        maps: res.data.maps,
      })
    })
  }, [])

  return (
    <div>
      <h1>Maps</h1>
      {state.loading ? <NormalLoadingSpinner /> : null}
      <div>
        {state.maps.map((map, i) => <MapCard key={i} map={map} />)}
      </div>
    </div>
  )
}

export default MapList
