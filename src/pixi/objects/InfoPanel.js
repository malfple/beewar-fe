import * as PIXI from 'pixi.js'

import {renderer} from '../renderer'
import {PLAYER_COLOR_NAME, PLAYER_COLOR_TINT} from './unitConstants'
import {CMD_END_TURN, COMMS_MAP_EVENT_END_TURN, GROUP_WEBSOCKET} from '../../modules/communication/messageConstants'
import {GAME_STATUS_ONGOING, GAME_STATUS_PICKING} from './gameConstants'
import {nullGameComms} from '../../modules/communication/GameComms'

/**
 * This class shows the overall game information and contains game-wide elements. This includes:
 * 1. Whose turn is it?
 * 2. Has the game already ended?
 * 3. The end turn button
 */
class InfoPanel {
  constructor(game, comms=nullGameComms) {
    this.status = game.status
    this.player_count = game.player_count
    this.turn_count = game.turn_count
    this.turn_player = game.turn_player
    this.comms = comms
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

    // end turn button
    // currently only a text
    this.btnEndTurn = new PIXI.Text('End Turn', {
      fontFamily: 'Arial',
      fontSize: 24,
      align: 'left',
      stroke: 'black',
      strokeThickness: 8,
      fill: 'white',
    })
    this.btnEndTurn.position.set(renderer.width - this.btnEndTurn.width - 20, renderer.height - this.btnEndTurn.height - 20)
    this.pixiNode.addChild(this.btnEndTurn)
    this._setupEndTurnInteraction()
  }

  _setupEndTurnInteraction() {
    this.btnEndTurn.interactive = true
    this.btnEndTurn.on('pointerover', () => {
      this.btnEndTurn.alpha = 0.5
    })
    this.btnEndTurn.on('pointerout', () => {
      this.btnEndTurn.alpha = 1
    })
    this.btnEndTurn.on('click', () => {
      this.comms.triggerMsg({
        cmd: CMD_END_TURN,
      }, GROUP_WEBSOCKET)
    })
  }

  // end turn event sent from Map object
  handleComms(msg) {
    switch(msg.cmd) {
      case COMMS_MAP_EVENT_END_TURN:
        this.status = msg.data.status
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
    if(this.status === GAME_STATUS_PICKING) {
      this.turnInfoText.visible = false
    } else {
      this.turnInfoText.visible = true
      if(this.status === GAME_STATUS_ONGOING) {
        this.turnInfoText.text = `Cycle ${this.turn_count}\nIt's ${PLAYER_COLOR_NAME[this.turn_player]}'s turn!`
        this.turnInfoText.style.fill = PLAYER_COLOR_TINT[this.turn_player]
      } else {
        this.turnInfoText.text = `Cycle ${this.turn_count}\nGame ended!`
        this.turnInfoText.style.fill = 0xFFFFFF
      }
    }
  }
}

export default InfoPanel
