import React from 'react'
import PropTypes from 'prop-types'
import {PLAYER_COLOR_TINT} from '../../pixi/objects/unitConstants'

function BrushForColor(props) {
  let className = 'brush-icon'
  if(props.playerOrder === props.selectedPlayerOrder) {
    className += ' brush-icon--selected'
  }
  return (
    <div
      className={className}
      style={{backgroundColor: `#${PLAYER_COLOR_TINT[props.playerOrder].toString(16)}`}}
      onClick={() => props.setSelectedPlayerOrder(props.playerOrder)}
    >{props.playerOrder}</div>
  )
}

BrushForColor.propTypes = {
  playerOrder: PropTypes.number.isRequired,
  selectedPlayerOrder: PropTypes.number.isRequired,
  setSelectedPlayerOrder: PropTypes.func.isRequired,
}

export default BrushForColor
