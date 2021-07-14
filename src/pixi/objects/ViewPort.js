import * as PIXI from 'pixi.js'
import {renderer} from '../renderer'
import {btnZoomInTexture, btnZoomOutTexture} from '../textures'

/**
 * ViewPort controls the camera/view of the map and also zoom
 */
class ViewPort {
  /**
   * @param {Map} map: this should only be an instance of class Map
   * @returns {PIXI.Container}
   */
  constructor(map) {
    this.pixiNode = new PIXI.Container()

    this.fixedFrame = new PIXI.Container()
    this.movedFrame = new PIXI.Container()
    this.fixedFrame.addChild(this.movedFrame)
    this.movedFrame.addChild(map.pixiNode)

    this.fixedFrame.hitArea = new PIXI.Rectangle(0, 0, renderer.width, renderer.height)
    this.fixedFrame.interactive = true

    this._setupDragInteraction()

    this.btnZoomIn = new PIXI.Sprite(btnZoomInTexture)
    this.btnZoomOut = new PIXI.Sprite(btnZoomOutTexture)
    this.fixedFrame.addChild(this.btnZoomIn)
    this.fixedFrame.addChild(this.btnZoomOut)

    this._setupZoomInteraction(map)
  }

  _setupDragInteraction() {
    let drag = false
    let dragPosition = null

    const onDragStart = e => {
      dragPosition = e.data.getLocalPosition(this.movedFrame)
      drag = true
    }
    this.fixedFrame.on('rightdown', onDragStart)

    const onDragStop = () => {
      dragPosition = null
      drag = false
    }
    this.fixedFrame.on('rightup', onDragStop)
    this.fixedFrame.on('rightupoutside', onDragStop)

    const onDragMove = e => {
      if(drag) {
        const newPosition = e.data.getLocalPosition(this.fixedFrame)
        this.movedFrame.x = newPosition.x - dragPosition.x
        this.movedFrame.y = newPosition.y - dragPosition.y
      }
    }
    this.fixedFrame.on('pointermove', onDragMove)
  }

  /**
   * @param {Map} map
   * @private
   */
  _setupZoomInteraction(map) {
    // button position
    this.btnZoomIn.position.set(renderer.width - this.btnZoomIn.width - 10, 10)
    this.btnZoomOut.position.set(renderer.width - this.btnZoomOut.width - 10,
      this.btnZoomIn.y + this.btnZoomIn.height + 10)

    this.btnZoomIn.interactive = true
    this.btnZoomIn.on('pointerover', () => {
      this.btnZoomIn.alpha = 0.5
    })
    this.btnZoomIn.on('pointerout', () => {
      this.btnZoomIn.alpha = 1
    })
    this.btnZoomIn.on('click', () => {
      let newScale = map.pixiNode.scale.x + 0.1
      if(newScale > 2) {
        newScale = 2
      }
      map.pixiNode.scale.set(newScale)
    })

    this.btnZoomOut.interactive = true
    this.btnZoomOut.on('pointerover', () => {
      this.btnZoomOut.alpha = 0.5
    })
    this.btnZoomOut.on('pointerout', () => {
      this.btnZoomOut.alpha = 1
    })
    this.btnZoomOut.on('click', () => {
      let newScale = map.pixiNode.scale.x - 0.1
      if(newScale < 0.2) {
        newScale = 0.2
      }
      map.pixiNode.scale.set(newScale)
    })
  }
}

export default ViewPort
