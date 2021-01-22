import * as PIXI from 'pixi.js'

import {renderer} from '../renderer'
import {PLAYER_COLOR_TINT} from './unitConstants'
import {COMMS_MAP_EVENT_END_TURN} from '../../modules/communication/messageConstants'

class InfoPanel {
  constructor(game) {
    this.player_count = game.player_count
    this.turn_count = game.turn_count
    this.turn_player = game.turn_player
    this.pixiNode = new PIXI.Container()

    // create border
    this.borderGraphics = new PIXI.Graphics()
    this.borderGraphics.lineStyle(10, 0xffffff, 1)
    this.borderGraphics.moveTo(0, 0)
    this.borderGraphics.lineTo(renderer.width, 0)
    this.borderGraphics.lineTo(renderer.width, renderer.height)
    this.borderGraphics.lineTo(0, renderer.height)
    this.borderGraphics.lineTo(0, 0)
    this._updateBorder()

    this.pixiNode.addChild(this.borderGraphics)
  }

  // end turn event sent from Map object
  handleComms(msg) {
    switch(msg.cmd) {
      case COMMS_MAP_EVENT_END_TURN:
        this.turn_count = msg.data.turn_count
        this.turn_player = msg.data.turn_player
        this._updateBorder()
        break
      default:
        // do nothing
    }
  }

  _updateBorder() {
    this.borderGraphics.tint = PLAYER_COLOR_TINT[this.turn_player]
  }
}

export default InfoPanel
