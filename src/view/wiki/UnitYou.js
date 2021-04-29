import React from 'react'
import youPNG from '../../pixi/assets/you.png'

function UnitYou() {
  return (
    <div>
      <h1>You</h1>
      <img src={youPNG} alt="you" />
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
