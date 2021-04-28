import React from 'react'
import youMaskPNG from '../../pixi/assets/you-mask.png'

function UnitYou() {
  return (
    <div>
      <h1>You</h1>
      <img src={youMaskPNG} alt="you" />
      <p>
        This is you. If you die (in-game) then you lose immediately.
      </p>
      <p>
        Can move 1 step in a turn and cannot attack.
      </p>
    </div>
  )
}

export default UnitYou
