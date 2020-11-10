import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

const bunny = 'https://i.imgur.com/IaUrttj.png'
const bunnyTexture = PIXI.Texture.from(bunny)
const app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb})

const hexGraphics = new PIXI.Graphics()
hexGraphics.lineStyle(2, 0xffffff, 1)
hexGraphics.moveTo(0, 10)
hexGraphics.lineTo(0, 30)
hexGraphics.lineTo(20, 40)
hexGraphics.lineTo(40, 30)
hexGraphics.lineTo(40, 10)
hexGraphics.lineTo(20, 0)
hexGraphics.lineTo(0, 10)

const hexTexture = app.renderer.generateTexture(hexGraphics)

function Grid(props) {
  console.log(props.map.terrain_info)
  let terrainInfo = atob(props.map.terrain_info)
  let terrainInfoString = ''
  console.log('terrain info length ' + terrainInfo.length)
  for(let i = 0; i < terrainInfo.length; i++) {
    terrainInfoString += ` ${terrainInfo.charCodeAt(i)}`
  }

  console.log(props.map.unit_info)
  let unitInfo = atob(props.map.unit_info)
  let unitInfoString = ''
  console.log('unit info length ' + unitInfo.length)
  for(let i = 0; i < unitInfo.length; i++) {
    unitInfoString += ` ${unitInfo.charCodeAt(i)}`
  }

  useEffect(() => {
    console.log('load map pixi')
    document.getElementById('grid-view').appendChild(app.view)
    for(let i = 0; i < props.map.height; i++) {
      for(let j = 0; j < props.map.width; j++) {
        let hexVal = terrainInfo.charCodeAt(i * props.map.width + j)
        let hexSprite = new PIXI.Sprite(hexVal === 0 ? hexTexture : bunnyTexture)
        hexSprite.anchor.set(0.5, 0.5)
        let x = 50 + 50 * j
        let y = 50 + 40 * i
        if(i % 2 === 0) {
          x += 25
        }
        hexSprite.position.set(x, y)
        app.stage.addChild(hexSprite)
      }
    }
    console.log(`map has ${app.stage.children.length} instances`)

    return function cleanup() {
      console.log('map cleanup')
    }
  })

  return (
    <div>
      <div>
        terrain: {terrainInfoString}
      </div>
      <div>
        unit: {unitInfoString}
      </div>
      <div id="grid-view">
      </div>
    </div>
  )
}

export default Grid
