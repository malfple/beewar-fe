import React, {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'

import './Card.css'
import {
  TERRAIN_TYPE_VOID,
} from '../../pixi/objects/terrainConstants'

const PREVIEW_TERRAIN_COLOR = [
  'black',
  'grey', // plains
  'brown',
  'yellow',
  'green',
  'cyan',
]

function Preview(props) {
  /** @type {React.MutableRefObject<HTMLCanvasElement>} */
  const canvas = useRef(null)

  useEffect(() => {
    // draw the preview to canvas
    const ctx = canvas.current.getContext('2d')

    const terrainInfo = atob(props.map.terrain_info)
    // limit size to prevent rendering off-canvas
    const height = Math.min(props.map.height, 20)
    const width = Math.min(props.map.width, 31)

    for(let i = 0; i < height; i++) {
      for(let j = 0; j < width; j++) {
        const py = 10 * i
        const px = 10 * j + (i % 2 === 0 ? 0 : -5)
        const terrainType = terrainInfo.charCodeAt(i * props.map.width + j)
        if(terrainType !== TERRAIN_TYPE_VOID) {
          ctx.fillStyle = PREVIEW_TERRAIN_COLOR[terrainType]
          ctx.beginPath()
          ctx.rect(px, py, 10, 10)
          ctx.fill()
        }
      }
    }
  })

  return (
    <canvas className="card__preview" ref={canvas} height="200px" width="300px" />
  )
}

Preview.propTypes = {
  map: PropTypes.object.isRequired,
}

export default Preview
