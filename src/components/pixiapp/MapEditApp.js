import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import Map from '../../pixi/objects/Map'
import ViewPort from '../../pixi/objects/ViewPort'
import {renderer} from '../../pixi/renderer'
import MapInteractionControllerForEdit from '../../pixi/objects/MapInteractionControllerForEdit'
import {GROUP_MAP_CONTROLLER} from '../../modules/communication/groupConstants'

function MapEditApp(props) {
  useEffect(() => {
    const stage = new PIXI.Container()
    const map = new Map(props.map, [], 0, true, props.comms, true)
    const viewport = new ViewPort(map)
    stage.addChild(viewport.fixedFrame)

    const mapInteractionController = new MapInteractionControllerForEdit(map, props.comms)
    props.comms.registerSubscriber(mapInteractionController, [GROUP_MAP_CONTROLLER], true)

    const ticker = new PIXI.Ticker()
    ticker.add(() => {
      renderer.render(stage)
    }, PIXI.UPDATE_PRIORITY.LOW)
    ticker.start()

    document.getElementById('map-edit-app').appendChild(renderer.view)

    return function cleanup() {
      stage.destroy({
        children: true,
      })
      ticker.destroy()
    }
  })

  return (
    <div>
      <div id="map-edit-app">
      </div>
    </div>
  )
}

MapEditApp.propTypes = {
  map: PropTypes.object.isRequired,
  comms: PropTypes.object.isRequired,
}

export default React.memo(MapEditApp)
