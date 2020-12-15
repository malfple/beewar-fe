import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import jwt from 'jwt-decode'

import {UserTokenContext} from '../../context'
import GameApp from '../../components/pixiapp/GameApp'
import {CMD_CHAT, CMD_END_TURN, CMD_GAME_DATA} from '../../pixi/objects/messageConstants'

function GameView() {
  const {id} = useParams()
  const userToken = useContext(UserTokenContext)
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState(['start of chat'])
  const [gameData, setGameData] = useState(null)
  const ws = useRef(null)

  useEffect(() => {
    if(userToken.token !== '') {
      ws.current = new WebSocket(`ws://localhost:3001/api/game/ws?id=${id}`, ['game_room', userToken.token])

      ws.current.onopen = () => {
        console.log('Successfully Connected')
        ws.current.send(JSON.stringify({
          cmd: CMD_CHAT,
          data: `${userToken.username} says hello`,
        }))
      }
      ws.current.onmessage = rawMsg => {
        // console.log('ws msg: ', msg)
        // console.log(msg.data)
        const msg = JSON.parse(rawMsg.data)
        console.log('ws msg: ', msg)
        if(msg.cmd === CMD_CHAT) {
          setMessages(prevMessages => [...prevMessages, `${msg.sender}: ${msg.data}`])
        } else if(msg.cmd === CMD_GAME_DATA) {
          setGameData(msg.data)
        }
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

  // sends message to backend server
  function sendMsg(cmd, data) {
    console.log('send message', cmd, data)
    ws.current.send(JSON.stringify({
      cmd: cmd,
      data: data,
    }))
  }

  function endTurn() {
    ws.current.send(JSON.stringify({
      cmd: CMD_END_TURN,
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
      <button onClick={endTurn}>end turn</button> <br />
      <input type="text" onChange={e => setMsg(e.target.value)} />
      <button onClick={() => sendMsg(CMD_CHAT, msg)}>send</button>
      <div>
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      {gameData ? <GameApp map={gameData.game} ws={ws.current} /> : null}
    </div>
  )
}

export default GameView
