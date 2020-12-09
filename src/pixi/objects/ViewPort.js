import * as PIXI from 'pixi.js'
import {renderer} from '../renderer'

/**
 * ViewPort controls the camera/view of the map
 * @param mapController: this should only be an instance of class MapController
 * @returns {PIXI.Container}
 */
function ViewPort(mapController) {
  let fixedFrame = new PIXI.Container()
  let movedFrame = new PIXI.Container()
  let mapContainer = mapController.stage
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
  fixedFrame.on('pointerdown', onDragStart)
  function onDragStop(e) {
    movedFrame.alpha = 1
    dragPosition = null
    drag = false
  }
  fixedFrame.on('pointerup', onDragStop)
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