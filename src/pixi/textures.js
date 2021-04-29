import * as PIXI from 'pixi.js'
import {renderer} from './renderer'

import youMaskPNG from './assets/unit-you-mask.png'
import youTintPNG from './assets/unit-you-tint.png'
import infantryMaskPNG from './assets/unit-infantry-mask.png'
import infantryTintPNG from './assets/unit-infantry-tint.png'

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

const youMaskTexture = PIXI.Texture.from(youMaskPNG)
const youTintTexture = PIXI.Texture.from(youTintPNG)

const infantryMaskTexture = PIXI.Texture.from(infantryMaskPNG)
const infantryTintTexture = PIXI.Texture.from(infantryTintPNG)

export {
  hexTexture,
  youMaskTexture,
  youTintTexture,
  infantryMaskTexture,
  infantryTintTexture,
}
