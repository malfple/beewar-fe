import * as PIXI from 'pixi.js'

import plainsPNG from './assets/terrain-plains.png'
import wallsPNG from './assets/terrain-walls.png'
import honeyFieldPNG from './assets/terrain-honeyfield.png'
import wastelandPNG from './assets/terrain-wasteland.png'
import iceFieldPNG from './assets/terrain-icefield.png'

import queenMaskPNG from './assets/unit-queen-mask.png'
import queenTintPNG from './assets/unit-queen-tint.png'
import infantryMaskPNG from './assets/unit-infantry-mask.png'
import infantryTintPNG from './assets/unit-infantry-tint.png'
import jetCrewMaskPNG from './assets/unit-jet-crew-mask.png'
import jetCrewTintPNG from './assets/unit-jet-crew-tint.png'
import wizardMaskPNG from './assets/unit-wizard-mask.png'
import wizardTintPNG from './assets/unit-wizard-tint.png'
import tankMaskPNG from './assets/unit-tank-mask.png'
import tankTintPNG from './assets/unit-tank-tint.png'
import mortarMaskPNG from './assets/unit-mortar-mask.png'
import mortarTintPNG from './assets/unit-mortar-tint.png'

import btnZoomInPNG from './assets/btn-zoom-in.png'
import btnZoomOutPNG from './assets/btn-zoom-out.png'

const plainsTexture = PIXI.Texture.from(plainsPNG)
const wallsTexture = PIXI.Texture.from(wallsPNG)
const honeyFieldTexture = PIXI.Texture.from(honeyFieldPNG)
const wastelandTexture = PIXI.Texture.from(wastelandPNG)
const iceFieldTexture = PIXI.Texture.from(iceFieldPNG)

const terrainHitArea = new PIXI.Polygon([
  -45, -25,
  -45, 25,
  0, 50,
  45, 25,
  45, -25,
  0, -50,
])

const queenMaskTexture = PIXI.Texture.from(queenMaskPNG)
const queenTintTexture = PIXI.Texture.from(queenTintPNG)
const infantryMaskTexture = PIXI.Texture.from(infantryMaskPNG)
const infantryTintTexture = PIXI.Texture.from(infantryTintPNG)
const jetCrewMaskTexture = PIXI.Texture.from(jetCrewMaskPNG)
const jetCrewTintTexture = PIXI.Texture.from(jetCrewTintPNG)
const wizardMaskTexture = PIXI.Texture.from(wizardMaskPNG)
const wizardTintTexture = PIXI.Texture.from(wizardTintPNG)
const tankMaskTexture = PIXI.Texture.from(tankMaskPNG)
const tankTintTexture = PIXI.Texture.from(tankTintPNG)
const mortarMaskTexture = PIXI.Texture.from(mortarMaskPNG)
const mortarTintTexture = PIXI.Texture.from(mortarTintPNG)

const btnZoomInTexture = PIXI.Texture.from(btnZoomInPNG)
const btnZoomOutTexture = PIXI.Texture.from(btnZoomOutPNG)

export {
  plainsTexture,
  wallsTexture,
  honeyFieldTexture,
  wastelandTexture,
  iceFieldTexture,

  terrainHitArea,

  queenMaskTexture,
  queenTintTexture,
  infantryMaskTexture,
  infantryTintTexture,
  jetCrewMaskTexture,
  jetCrewTintTexture,
  wizardMaskTexture,
  wizardTintTexture,
  tankMaskTexture,
  tankTintTexture,
  mortarMaskTexture,
  mortarTintTexture,

  btnZoomInTexture,
  btnZoomOutTexture,
}
