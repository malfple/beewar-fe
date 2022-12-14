import React, {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import {renderer} from '../../pixi/renderer'
import ViewPort from '../../pixi/objects/ViewPort'
import Map from '../../pixi/objects/Map'

function MapViewApp(props) {
  /** @type {React.MutableRefObject<>} */
  const appContainer = useRef(null)

  useEffect(() => {
    const stage = new PIXI.Container()
    const map = new Map(props.map)
    const viewport = new ViewPort(map)

    stage.addChild(viewport.fixedFrame)

    const ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    appContainer.current.appendChild(renderer.view)

    return function cleanup() {
      stage.destroy({
        children: true,
      })
      ticker.destroy()
    }
  })

  return (
    <div ref={appContainer} />
  )
}

MapViewApp.propTypes = {
  map: PropTypes.object.isRequired,
}

// MapViewApp is memo-ed by default
export default React.memo(MapViewApp)
