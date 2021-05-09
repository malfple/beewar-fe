import React from 'react'
import queenPNG from '../../pixi/assets/unit-queen.png'

function UnitQueen() {
  return (
    <div>
      <h1>Queen (you)</h1>
      <img src={queenPNG} alt="queen" />
      <p>
        This is you. If you die (in-game) then you lose immediately.
      </p>
      <p>
        Can move 1 step in a turn and cannot attack.
      </p>
    </div>
  )
}

export default UnitQueen
