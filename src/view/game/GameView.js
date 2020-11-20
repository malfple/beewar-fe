import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import {UserTokenContext} from '../../context'

function GameView() {
  let {id} = useParams()
  let userToken = useContext(UserTokenContext)
  let [msg, setMsg] = useState('')
  let ws = useRef(null)

  useEffect(() => {
    if(userToken.token !== '') {
      ws.current = new WebSocket(`ws://localhost:3001/api/game/ws?id=${id}`, ['game_room', userToken.token])

      ws.current.onopen = () => {
        console.log('Successfully Connected')
        ws.current.send(JSON.stringify({
          cmd: 'JUST_A_TEXT',
          data: 'client hello'
        }))
      }
      ws.current.onmessage = msg => {
        // console.log('ws msg: ', msg)
        // console.log(msg.data)
        console.log('ws msg: ', JSON.parse(msg.data))
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
    }
  }, [id, userToken.token])

  function sendMsg() {
    console.log('send message', msg)
    ws.current.send(JSON.stringify({
      cmd: 'JUST_A_TEXT',
      data: msg
    }))
  }

  return (
    <div>
      <input type="text" onChange={e => setMsg(e.target.value)} />
      <button onClick={sendMsg}>send</button>
    </div>
  )
}

export default GameView
