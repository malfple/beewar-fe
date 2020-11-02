import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {axiosCustom} from '../../api/api'

function MapView() {
  let [map, setMap] = useState()
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

  function renderMap() {
    console.log(map.terrain_info)
    let terrainInfo = atob(map.terrain_info)
    let terrainInfoString = ""
    console.log(terrainInfo)
    console.log(terrainInfo.length)
    for(let i = 0; i < terrainInfo.length; i++) {
      terrainInfoString += ` ${'0' + terrainInfo[i]}`
    }

    return (
      <div>
        {terrainInfoString}
      </div>
    )
  }

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
        {renderMap()}
      </div>
    </div>
  )
}

export default MapView
