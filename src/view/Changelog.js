import React from 'react'

function Changelog() {
  return (
    <div className="main-container">
      <h1>Changelog</h1>
      <p>Only user-facing updates are shown.</p>
      <h2>v0.4.0 - Beebot Update</h2>
      <ul>
        <li>You can now play against beebot! Just invite him to your game before the game starts.</li>
        <li>Improve turn information. It is now clear whose turn is it and how many turns have passed.</li>
      </ul>
      <h2>v0.3.1</h2>
      <ul>
        <li>Add regular ping to websocket, fixing idle disconnection issue.</li>
      </ul>
      <h2>v0.3.0</h2>
      <ul>
        <li>Leaderboard</li>
        <li>General UI improvement with CSS!</li>
        <li>Map (pixijs) UI improvements!</li>
        <li>Wiki!</li>
      </ul>
      <h2>v0.2.3</h2>
      <ul>
        <li>Document title, meta-data, icon, etc</li>
        <li>How to play section</li>
      </ul>
      <h2>v0.2.0</h2>
      <ul>
        <li>My games list</li>
        <li>Open games list</li>
        <li>Game statuses: game in picking state, game in playing state, game in ended state</li>
        <li>That means we have a complete game flow now! Create game > player join > auto start.</li>
        <li>Simplify the home/landing page</li>
      </ul>
      <h2>v0.1.0</h2>
      <ul>
        <li>Yay! We deployed the service!</li>
      </ul>
    </div>
  )
}

export default Changelog
