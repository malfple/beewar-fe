import React from 'react'
import infantryPNG from '../../pixi/assets/unit-infantry.png'

function UnitInfantry() {
  return (
    <div>
      <h1>Infantry</h1>
      <img src={infantryPNG} alt="you" />
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
