import * as PIXI from 'pixi.js'

const renderer = new PIXI.Renderer({width: 0.95 * window.innerWidth, height: 0.75 * window.innerHeight, backgroundColor: 0xAAAAFF})
renderer.view.oncontextmenu = e => e.preventDefault()

export {
  renderer,
}
