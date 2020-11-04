import React, {useEffect} from 'react'

import * as PIXI from 'pixi.js'

const bunny = 'https://i.imgur.com/IaUrttj.png'
const app = new PIXI.Application({width: 800, height: 600, backgroundColor: 0x1099bb})
const bunnySprite = PIXI.Sprite.from(bunny)
bunnySprite.anchor.set(0.5, 0.5)
bunnySprite.position.set(app.screen.width/2, app.screen.height/2)
app.stage.addChild(bunnySprite)

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
    document.getElementById('grid-view').appendChild(app.view)
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
