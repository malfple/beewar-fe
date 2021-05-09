import * as PIXI from 'pixi.js'

import plainsPNG from './assets/terrain-plains.png'

import queenMaskPNG from './assets/unit-queen-mask.png'
import queenTintPNG from './assets/unit-queen-tint.png'
import infantryMaskPNG from './assets/unit-infantry-mask.png'
import infantryTintPNG from './assets/unit-infantry-tint.png'

import btnZoomInPNG from './assets/btn-zoom-in.png'
import btnZoomOutPNG from './assets/btn-zoom-out.png'

const plainsTexture = PIXI.Texture.from(plainsPNG)

const queenMaskTexture = PIXI.Texture.from(queenMaskPNG)
const queenTintTexture = PIXI.Texture.from(queenTintPNG)

const infantryMaskTexture = PIXI.Texture.from(infantryMaskPNG)
const infantryTintTexture = PIXI.Texture.from(infantryTintPNG)

const btnZoomInTexture = PIXI.Texture.from(btnZoomInPNG)
const btnZoomOutTexture = PIXI.Texture.from(btnZoomOutPNG)

export {
  plainsTexture,
  queenMaskTexture,
  queenTintTexture,
  infantryMaskTexture,
  infantryTintTexture,
  btnZoomInTexture,
  btnZoomOutTexture,
}
