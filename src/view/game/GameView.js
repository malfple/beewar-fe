import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import jwt from 'jwt-decode'

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
          cmd: 'CHAT',
          data: `${userToken.username} says hello`
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
        // reset access token if the token is expired
        if(Date.now() >= jwt(userToken.token).exp * 1000) {
          console.log('expired')
          userToken.refreshTheToken()
        }
      }

      return function cleanup() {
        ws.current.close()
      }
    }
  }, [id, userToken])

  function sendMsg() {
    console.log('send message', msg)
    ws.current.send(JSON.stringify({
      cmd: 'CHAT',
      data: msg
    }))
  }

  if(userToken.token === '') {
    return (
      <div>
        Game not found
      </div>
    )
  }

  return (
    <div>
      <input type="text" onChange={e => setMsg(e.target.value)} />
      <button onClick={sendMsg}>send</button>
    </div>
  )
}

export default GameView
