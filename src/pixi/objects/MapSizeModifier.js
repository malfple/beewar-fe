import * as PIXI from 'pixi.js'
import {renderer} from '../renderer'
import {GROUP_MAP_CONTROLLER} from '../../modules/communication/groupConstants'
import {COMMS_MAP_SIZE_CHANGE} from '../../modules/communication/messageConstants'

class MapSizeModifier {
  /**
   * @param {GameComms} comms
   */
  constructor(comms) {
    this.pixiNode = new PIXI.Container()

    this.box = new PIXI.Graphics()
    this.box.beginFill(0x888888)
    this.box.lineStyle(2, 0xFFFFFF)
    this.box.drawRect(50, 50, 100, 100)
    this.box.endFill()
    this.pixiNode.addChild(this.box)

    // top
    this.topAdd = new PIXI.Graphics()
    this.topAdd.beginFill(0x00FF00)
    this.topAdd.lineStyle(2, 0x000000)
    this.topAdd.drawRect(90, 20, 20, 20)
    this.topAdd.endFill()
    this.topAdd.interactive = true
    this.topAdd.on('pointerover', () => {
      this.topAdd.alpha = 0.5
    })
    this.topAdd.on('pointerout', () => {
      this.topAdd.alpha = 1
    })
    this.topAdd.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'U',
          diff: 1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.topAdd)

    this.topRem = new PIXI.Graphics()
    this.topRem.beginFill(0xFF0000)
    this.topRem.lineStyle(2, 0x000000)
    this.topRem.drawRect(90, 60, 20, 20)
    this.topRem.endFill()
    this.topRem.interactive = true
    this.topRem.on('pointerover', () => {
      this.topRem.alpha = 0.5
    })
    this.topRem.on('pointerout', () => {
      this.topRem.alpha = 1
    })
    this.topRem.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'U',
          diff: -1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.topRem)

    // bottom
    this.botAdd = new PIXI.Graphics()
    this.botAdd.beginFill(0x00FF00)
    this.botAdd.lineStyle(2, 0x000000)
    this.botAdd.drawRect(90, 160, 20, 20)
    this.botAdd.endFill()
    this.botAdd.interactive = true
    this.botAdd.on('pointerover', () => {
      this.botAdd.alpha = 0.5
    })
    this.botAdd.on('pointerout', () => {
      this.botAdd.alpha = 1
    })
    this.botAdd.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'D',
          diff: 1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.botAdd)

    this.botRem = new PIXI.Graphics()
    this.botRem.beginFill(0xFF0000)
    this.botRem.lineStyle(2, 0x000000)
    this.botRem.drawRect(90, 120, 20, 20)
    this.botRem.endFill()
    this.botRem.interactive = true
    this.botRem.on('pointerover', () => {
      this.botRem.alpha = 0.5
    })
    this.botRem.on('pointerout', () => {
      this.botRem.alpha = 1
    })
    this.botRem.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'D',
          diff: -1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.botRem)

    // left
    this.leftAdd = new PIXI.Graphics()
    this.leftAdd.beginFill(0x00FF00)
    this.leftAdd.lineStyle(2, 0x000000)
    this.leftAdd.drawRect(20, 90, 20, 20)
    this.leftAdd.endFill()
    this.leftAdd.interactive = true
    this.leftAdd.on('pointerover', () => {
      this.leftAdd.alpha = 0.5
    })
    this.leftAdd.on('pointerout', () => {
      this.leftAdd.alpha = 1
    })
    this.leftAdd.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'L',
          diff: 1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.leftAdd)

    this.leftRem = new PIXI.Graphics()
    this.leftRem.beginFill(0xFF0000)
    this.leftRem.lineStyle(2, 0x000000)
    this.leftRem.drawRect(60, 90, 20, 20)
    this.leftRem.endFill()
    this.leftRem.interactive = true
    this.leftRem.on('pointerover', () => {
      this.leftRem.alpha = 0.5
    })
    this.leftRem.on('pointerout', () => {
      this.leftRem.alpha = 1
    })
    this.leftRem.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'L',
          diff: -1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.leftRem)

    // right
    this.rightAdd = new PIXI.Graphics()
    this.rightAdd.beginFill(0x00FF00)
    this.rightAdd.lineStyle(2, 0x000000)
    this.rightAdd.drawRect(160, 90, 20, 20)
    this.rightAdd.endFill()
    this.rightAdd.interactive = true
    this.rightAdd.on('pointerover', () => {
      this.rightAdd.alpha = 0.5
    })
    this.rightAdd.on('pointerout', () => {
      this.rightAdd.alpha = 1
    })
    this.rightAdd.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'R',
          diff: 1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.rightAdd)

    this.rightRem = new PIXI.Graphics()
    this.rightRem.beginFill(0xFF0000)
    this.rightRem.lineStyle(2, 0x000000)
    this.rightRem.drawRect(120, 90, 20, 20)
    this.rightRem.endFill()
    this.rightRem.interactive = true
    this.rightRem.on('pointerover', () => {
      this.rightRem.alpha = 0.5
    })
    this.rightRem.on('pointerout', () => {
      this.rightRem.alpha = 1
    })
    this.rightRem.on('click', () => {
      comms.triggerMsg({
        cmd: COMMS_MAP_SIZE_CHANGE,
        data: {
          side: 'R',
          diff: -1,
        },
      }, GROUP_MAP_CONTROLLER)
    })
    this.pixiNode.addChild(this.rightRem)

    // button helper text
    const addText = new PIXI.Text('+1', {
      fontFamily: 'Arial',
      fontSize: 14,
      align: 'left',
      fill: 'black',
    })
    addText.position.set(92, 22)
    this.pixiNode.addChild(addText)
    const remText = new PIXI.Text('-1', {
      fontFamily: 'Arial',
      fontSize: 14,
      align: 'left',
      fill: 'white',
    })
    remText.position.set(92, 62)
    this.pixiNode.addChild(remText)

    // adjust position
    this.pixiNode.position.set(renderer.width - 200, renderer.height - 200)
  }
}

export default MapSizeModifier
