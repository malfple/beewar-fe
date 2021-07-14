import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js'

import MapForEdit from '../../pixi/objects/MapForEdit'
import ViewPort from '../../pixi/objects/ViewPort'
import {renderer} from '../../pixi/renderer'
import MapInteractionControllerForEdit from '../../pixi/objects/MapInteractionControllerForEdit'
import {GROUP_MAP_CONTROLLER} from '../../modules/communication/groupConstants'
import MapSizeModifier from '../../pixi/objects/MapSizeModifier'

/**
 * Map edit app uses forward ref so the parent component can access the map object
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<MapForEdit>>}
 */
const MapEditApp = React.forwardRef((props, ref) => {
  useEffect(() => {
    const stage = new PIXI.Container()
    const map = new MapForEdit(props.map, props.comms)
    const viewport = new ViewPort(map)
    stage.addChild(viewport.fixedFrame)

    // set forward ref
    ref.current = map

    const mapInteractionController = new MapInteractionControllerForEdit(map, props.comms)
    props.comms.registerSubscriber(mapInteractionController, [GROUP_MAP_CONTROLLER], true)

    const mapSizeModifier = new MapSizeModifier(props.comms)
    stage.addChild(mapSizeModifier.pixiNode)

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
})

MapEditApp.propTypes = {
  map: PropTypes.object.isRequired,
  comms: PropTypes.object.isRequired,
}

export default React.memo(MapEditApp)
