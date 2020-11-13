import * as PIXI from 'pixi.js'
import {renderer} from './renderer'

const bunny = 'https://i.imgur.com/IaUrttj.png'
const bunnyTexture = PIXI.Texture.from(bunny)

const hexGraphics = new PIXI.Graphics()
hexGraphics.lineStyle(2, 0xffffff, 1)
hexGraphics.moveTo(0, 10)
hexGraphics.lineTo(0, 30)
hexGraphics.lineTo(20, 40)
hexGraphics.lineTo(40, 30)
hexGraphics.lineTo(40, 10)
hexGraphics.lineTo(20, 0)
hexGraphics.lineTo(0, 10)

const hexTexture = renderer.generateTexture(hexGraphics)

export {
  bunnyTexture,
  hexTexture
}
