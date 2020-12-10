import * as PIXI from 'pixi.js'

const renderer = new PIXI.Renderer({width: window.innerWidth, height: 0.75 * window.innerHeight, backgroundColor: 0x1099bb})
renderer.view.oncontextmenu = e => e.preventDefault()

export {
  renderer
}
