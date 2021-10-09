import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'
import Preview from './Preview'
import {MAP_TYPE_TEXT} from '../../pixi/objects/mapTypeConstants'

function MapCard(props) {
  const history = useHistory()

  function toMap() {
    history.push(`/map/${props.map.id}`)
  }

  console.log(props.map)

  return (
    <div className="card" onClick={toMap}>
      <Preview map={props.map} />
      <div className="card__content">
        <div>
          Name: {props.map.name}
        </div>
        <div>
          Map Type/Game Mode: {MAP_TYPE_TEXT[props.map.type]}
        </div>
        <div>
          Size (height x width) : {props.map.height} x {props.map.width}
        </div>
        <div>
          Players: {props.map.player_count}
        </div>
      </div>
    </div>
  )
}

MapCard.propTypes = {
  map: PropTypes.object.isRequired,
}

export default MapCard
