import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

const bunny = 'https://i.imgur.com/IaUrttj.png'
const bunnyTexture = PIXI.Texture.from(bunny)
const app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb})

function Grid(props) {
  console.log(props.map.terrain_info)
  let terrainInfo = atob(props.map.terrain_info)
  let terrainInfoString = ''
  console.log(terrainInfo)
  console.log(terrainInfo.length)
  for(let i = 0; i < terrainInfo.length; i++) {
    terrainInfoString += ` ${'0' + terrainInfo[i]}`
  }

  useEffect(() => {
    console.log('load map pixi')
    document.getElementById('grid-view').appendChild(app.view)
    for(let i = 0; i < props.map.height; i++) {
      for(let j = 0; j < props.map.width; j++) {
        let bunnySprite = new PIXI.Sprite(bunnyTexture)
        bunnySprite.anchor.set(0.5, 0.5)
        let x = 50 + 50 * j
        let y = 50 + 50 * i
        if(i % 2 === 0) {
          x += 25
        }
        bunnySprite.position.set(x, y)
        app.stage.addChild(bunnySprite)
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
        {terrainInfoString}
      </div>
      <div id="grid-view">
      </div>
    </div>
  )
}

export default Grid
