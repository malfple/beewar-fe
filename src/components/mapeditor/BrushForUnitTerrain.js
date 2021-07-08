import React from 'react'
import PropTypes from 'prop-types'

function BrushForUnitTerrain(props) {
  let className = 'brush-icon'
  if(props.brushCode === props.selectedBrushCode) {
    className += ' brush-icon--selected'
  }
  return (
    <img
      className={className}
      src={props.src}
      alt="brush-icon"
      onClick={() => props.setSelectedBrushCode(props.brushCode)}
    />
  )
}

BrushForUnitTerrain.propTypes = {
  brushCode: PropTypes.number.isRequired,
  selectedBrushCode: PropTypes.number.isRequired,
  setSelectedBrushCode: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
}

export default BrushForUnitTerrain
