import React from 'react'

function Grid(props) {
  console.log(props.map.terrain_info)
  let terrainInfo = atob(props.map.terrain_info)
  let terrainInfoString = ''
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

export default Grid
