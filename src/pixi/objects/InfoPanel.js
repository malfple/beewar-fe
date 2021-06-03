import * as PIXI from 'pixi.js'

import {renderer} from '../renderer'
import {PLAYER_COLOR_NAME, PLAYER_COLOR_TINT} from './unitConstants'
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

    // turn info text
    this.turnInfoText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 24,
      align: 'left',
      stroke: 'black',
      strokeThickness: 8,
    })
    this.turnInfoText.position.set(20, 20)
    this._updateInfoText()
    this.pixiNode.addChild(this.turnInfoText)
  }

  // end turn event sent from Map object
  handleComms(msg) {
    switch(msg.cmd) {
      case COMMS_MAP_EVENT_END_TURN:
        this.turn_count = msg.data.turn_count
        this.turn_player = msg.data.turn_player
        this._updateBorder()
        this._updateInfoText()
        break
      default:
        // do nothing
    }
  }

  _updateBorder() {
    this.borderGraphics.tint = PLAYER_COLOR_TINT[this.turn_player]
  }

  _updateInfoText() {
    this.turnInfoText.text = `Cycle ${this.turn_count}\nIt's ${PLAYER_COLOR_NAME[this.turn_player]}'s turn!`
    this.turnInfoText.style.fill = PLAYER_COLOR_TINT[this.turn_player]
  }
}

export default InfoPanel
