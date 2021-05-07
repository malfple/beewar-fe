import {CMD_GAME_DATA} from './messageConstants'
import {GROUP_WEBSOCKET, GROUP_WEBSOCKET_LISTENERS} from './groupConstants'

const BE_SERVER_WEBSOCKET_URL = process.env.REACT_APP_BE_SERVER_WEBSOCKET_URL

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
    this.gameID = gameID
    this.token = token
    this.isClosed = false // this is to indicate whether to reopen the connection if not closed manually
    gameComms.registerSubscriber(this, [GROUP_WEBSOCKET], true)

    this.onMessageListeners = [msg => {
      gameComms.triggerMsg(msg, GROUP_WEBSOCKET_LISTENERS)
    }]

    this.open(true)
  }

  /**
   * Open the connection. This function is automatically called once in constructor
   * @param {boolean} withGameData
   */
  open(withGameData) {
    if(!this.isClosed) {
      this.ws = new WebSocket(`${BE_SERVER_WEBSOCKET_URL}/api/game/ws?id=${this.gameID}`, ['game_room', this.token])

      this.ws.onopen = () => {
        console.log('ws: Successfully Connected')
        if(withGameData) {
          this.ws.send(JSON.stringify({
            cmd: CMD_GAME_DATA,
          }))
        }
      }

      this.ws.onmessage = rawMsg => {
        const msg = JSON.parse(rawMsg.data)
        for(let i = 0; i < this.onMessageListeners.length; i++) {
          this.onMessageListeners[i](msg)
        }
      }

      this.ws.onclose = event => {
        console.log('ws close: ', event)
      }

      this.ws.onerror = error => {
        console.log('ws error: ', error)
      }
    }
  }

  /**
   * @param {function} listener   - function(msg), msg is an object in the form of {cmd, data}
   */
  addOnMessageListener(listener) {
    this.onMessageListeners.push(listener)
  }

  // required by GameComms
  handleComms(msg) {
    if(!this.isClosed) {
      if(this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg))
      } else {
        alert('connection lost')
      }
    } else {
      console.error('websocket already closed')
    }
  }

  close() {
    this.isClosed = true
    this.ws.close()
  }
}

export default WebsocketWrapper
