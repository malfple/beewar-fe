import * as PIXI from 'pixi.js'
import {renderer} from '../renderer'

/**
 * ViewPort controls the camera/view of the map
 * @param mapController: this should only be an instance of class MapController
 * @returns {PIXI.Container}
 */
function ViewPort(mapController) {
  const fixedFrame = new PIXI.Container()
  const movedFrame = new PIXI.Container()
  const mapContainer = mapController.pixiNode
  fixedFrame.addChild(movedFrame)
  movedFrame.addChild(mapContainer)

  fixedFrame.hitArea = new PIXI.Rectangle(0, 0, renderer.width, renderer.height)
  fixedFrame.interactive = true

  // dragging the screen
  let drag = false
  let dragPosition = null

  function onDragStart(e) {
    movedFrame.alpha = 0.5
    dragPosition = e.data.getLocalPosition(movedFrame)
    drag = true
  }
  fixedFrame.on('rightdown', onDragStart)

  function onDragStop() {
    movedFrame.alpha = 1
    dragPosition = null
    drag = false
  }
  fixedFrame.on('rightup', onDragStop)

  function onDragMove(e) {
    if(drag) {
      const newPosition = e.data.getLocalPosition(fixedFrame)
      movedFrame.x = newPosition.x - dragPosition.x
      movedFrame.y = newPosition.y - dragPosition.y
    }
  }
  fixedFrame.on('pointermove', onDragMove)

  return fixedFrame
}

export default ViewPort
