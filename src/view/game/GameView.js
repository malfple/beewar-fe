import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

function GameView() {
  let {id} = useParams()
  let [msg, setMsg] = useState('')
  let ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:3001/api/game/ws?id=${id}`)

    ws.current.onopen = () => {
      console.log('Successfully Connected')
      ws.current.send('client hello')
    }
    ws.current.onmessage = msg => {
      console.log('ws msg: ', msg)
    }
    ws.current.onclose = event => {
      console.log('ws close: ', event)
    }
    ws.current.onerror = error => {
      console.log('ws error: ', error)
    }

    return function cleanup() {
      ws.current.close()
    }
  }, [id])

  function sendMsg() {
    console.log('send message', msg)
    ws.current.send(msg)
  }

  return (
    <div>
      <input type="text" onChange={e => setMsg(e.target.value)} />
      <button onClick={sendMsg}>send</button>
    </div>
  )
}

export default GameView
