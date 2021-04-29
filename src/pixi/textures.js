import * as PIXI from 'pixi.js'

import plainsPNG from './assets/terrain-plains.png'

import youMaskPNG from './assets/unit-you-mask.png'
import youTintPNG from './assets/unit-you-tint.png'
import infantryMaskPNG from './assets/unit-infantry-mask.png'
import infantryTintPNG from './assets/unit-infantry-tint.png'

const plainsTexture = PIXI.Texture.from(plainsPNG)

const youMaskTexture = PIXI.Texture.from(youMaskPNG)
const youTintTexture = PIXI.Texture.from(youTintPNG)

const infantryMaskTexture = PIXI.Texture.from(infantryMaskPNG)
const infantryTintTexture = PIXI.Texture.from(infantryTintPNG)

export {
  plainsTexture,
  youMaskTexture,
  youTintTexture,
  infantryMaskTexture,
  infantryTintTexture,
}
