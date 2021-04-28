import React from 'react'
import infantryMaskPNG from '../../pixi/assets/infantry-mask.png'

function UnitInfantry() {
  return (
    <div>
      <h1>Infantry</h1>
      <img src={infantryMaskPNG} alt="you" />
      <p>
        A weak unit that carries a handgun.
      </p>
      <p>
        Can move 3 step in a turn and can attack adjacent units.
      </p>
    </div>
  )
}

export default UnitInfantry
