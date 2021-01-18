import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './MapCard.css'

function MapCard(props) {
  const history = useHistory()

  function toMap(mapID) {
    history.push(`/map/${mapID}`)
  }

  return (
    <div className="MapCard" onClick={() => toMap(props.map.id)}>
      <div>
        Name: {props.map.name}
      </div>
      <div>
        H x W : {props.map.height} x {props.map.width}
      </div>
    </div>
  )
}

MapCard.propTypes = {
  map: PropTypes.object.isRequired,
}

export default MapCard
