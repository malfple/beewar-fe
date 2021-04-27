import React from 'react'

function How2Play() {
  return (
    <div style={{margin: '10px'}}>
      <h1>How to Play</h1>
      <h2>Login and Register</h2>
      <p>
        Register with a unique email and username. After that, you can login
      </p>
      <h2>Initiating games</h2>
      <p>
        You can browse open games from the navbar.
        Otherwise, you can also create a new one by going to the map view from the navbar,
        select any map, and then click the create game button at the bottom of the map.
        You can join a game and the game will automatically start once all player slots are filled.
      </p>
      <h2>The game</h2>
      <p>
        Each player takes turns moving their unit.
        To know whose turn it is, see the map border. The border color will indicate the current player.
        You can select units to check their movement range, indicated by green hexes.
        When it's your turn, you can move the unit to an empty reachable hex and click again to confirm the move.
        To attack, move into attack range of an enemy unit and some red hexes will show.
      </p>
    </div>
  )
}

export default How2Play