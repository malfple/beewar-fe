import React, {useState} from 'react'

const ws = new WebSocket('ws://localhost:3001/api/game/ws')

ws.onopen = () => {
  console.log('Successfully Connected')
  ws.send('client hello')
}

ws.onmessage = msg => {
  console.log('ws msg: ', msg)
}

ws.onclose = event => {
  console.log('ws close: ', event)
}

ws.onerror = error => {
  console.log('ws error: ', error)
}

function Game() {
  let [msg, setMsg] = useState('')

  function sendMsg() {
    console.log('send message', msg)
    ws.send(msg)
  }

  return (
    <div>
      <div>Game</div>
      <input type="text" onChange={e => setMsg(e.target.value)} />
      <button onClick={sendMsg}>send</button>
    </div>
  )
}

export default Game
