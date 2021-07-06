import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'

function MapCard(props) {
  const history = useHistory()

  function toMap() {
    history.push(`/map/${props.map.id}`)
  }

  console.log(props.map)

  return (
    <div className="card" onClick={toMap}>
      <div>
        Name: {props.map.name}
      </div>
      <div>
        Size (height x width) : {props.map.height} x {props.map.width}
      </div>
      <div>
        Players: {props.map.player_count}
      </div>
    </div>
  )
}

MapCard.propTypes = {
  map: PropTypes.object.isRequired,
}

export default MapCard