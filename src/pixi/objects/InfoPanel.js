import * as PIXI from 'pixi.js'

import {renderer} from '../renderer'
import {PLAYER_COLOR_TINT} from './unitConstants'
import {CMD_END_TURN} from '../../modules/communication/messageConstants'

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

  // end turn event
  handleComms(msg) {
    switch(msg.cmd) {
      case CMD_END_TURN:
        this._nextTurn()
        this._updateBorder()
        break
      default:
        // do nothing
    }
  }

  _updateBorder() {
    this.borderGraphics.tint = PLAYER_COLOR_TINT[this.turn_player]
  }

  // similar to the one in Map
  _nextTurn() {
    this.turn_player++
    if(this.turn_player > this.player_count) {
      this.turn_count++
      this.turn_player = 1
    }
  }
}

export default InfoPanel
