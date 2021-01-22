import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'

function MapCard(props) {
  const history = useHistory()

  function toMap() {
    history.push(`/map/${props.map.id}`)
  }

  return (
    <div className="map-card" onClick={toMap}>
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
