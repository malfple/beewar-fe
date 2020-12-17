import {CMD_CHAT} from './messageConstants'
import {GROUP_WEBSOCKET_LISTENERS} from './groupConstants'

/**
 * Wraps javascript's WebSocket class for use with Games
 *
 * needs GameComms to send ws message to listeners
 *
 * it is assumed that all websocket messages to BE will be in the form {cmd, data}
 */
class WebsocketWrapper {
  /**
   * @param {int}       gameID
   * @param {string}    token     - access token
   * @param {GameComms} gameComms
   */
  constructor(gameID, token, gameComms) {
    this.onMessageListeners = [rawMsg => {
      // console.log('ws msg: ', msg)
      // console.log(msg.data)
      const msg = JSON.parse(rawMsg.data)
      console.log('ws msg: ', msg)
      gameComms.triggerMsg(msg, GROUP_WEBSOCKET_LISTENERS)
    }]

    this.ws = new WebSocket(`ws://localhost:3001/api/game/ws?id=${gameID}`, ['game_room', token])

    this.ws.onopen = () => {
      console.log('Successfully Connected')
      this.ws.send(JSON.stringify({
        cmd: CMD_CHAT,
        data: 'hello',
      }))
    }

    this.ws.onmessage = rawMsg => {
      for(let i = 0; i < this.onMessageListeners.length; i++) {
        this.onMessageListeners[i](rawMsg)
      }
    }

    this.ws.onclose = event => {
      console.log('ws close: ', event)
    }

    this.ws.onerror = error => {
      console.log('ws error: ', error)
      // reset access token if the token is expired
      // if(Date.now() >= jwt(userToken.token).exp * 1000) {
      //   console.log('expired')
      //   userToken.refreshTheToken()
      // }
    }
  }

  /**
   * @param {function} listener
   */
  addOnMessageListener(listener) {
    this.onMessageListeners.push(listener)
  }

  // required by GameComms
  handleComms(msg) {
    this.ws.send(JSON.stringify(msg))
  }

  close() {
    this.ws.close()
  }
}

export default WebsocketWrapper
