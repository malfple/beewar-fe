import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import {CMD_CHAT} from '../modules/communication/messageConstants'
import {GROUP_WEBSOCKET, GROUP_WEBSOCKET_LISTENERS} from '../modules/communication/groupConstants'

function ChatBox(props) {
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState(['start of chat'])

  // send chat message to backend server
  function sendChat() {
    props.comms.triggerMsg({
      cmd: CMD_CHAT,
      data: msg,
    }, GROUP_WEBSOCKET)
  }

  useEffect(() => {
    // dummy object
    const dummy = {
      handleComms(msg) {
        if(msg.cmd === CMD_CHAT) {
          setMessages(prevMessages => [...prevMessages, `${msg.sender}: ${msg.data}`])
        }
      },
    }

    props.comms.registerSubscriber(dummy, [GROUP_WEBSOCKET_LISTENERS])

    return function cleanup() {
      props.comms.unregisterSubscriber(dummy, [GROUP_WEBSOCKET_LISTENERS])
    }
  }, [props.comms])

  return (
    <div>
      <div>
        Players:
      </div>
      <div>
        Chat:
        <input type="text" onChange={e => setMsg(e.target.value)} />
        <button onClick={sendChat}>send</button>
        <div>
          {messages.map((msg, i) => <div key={i}>{msg}</div>)}
        </div>
      </div>
    </div>
  )
}

ChatBox.propTypes = {
  comms: PropTypes.object.isRequired,
}

export default ChatBox
