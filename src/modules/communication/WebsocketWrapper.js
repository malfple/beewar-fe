import {CMD_GAME_DATA, GROUP_WEBSOCKET, GROUP_WEBSOCKET_LISTENERS} from './messageConstants'

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
   * @param {GameComms} comms
   */
  constructor(gameID, token, comms) {
    this.gameID = gameID
    this.token = token
    this.comms = comms
    this.isClosed = false // this is to indicate whether to reopen the connection if not closed manually
    comms.registerSubscriber(this, [GROUP_WEBSOCKET], true)

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
        this.comms.triggerMsg(msg, GROUP_WEBSOCKET_LISTENERS)
      }

      this.ws.onclose = event => {
        console.log('ws close: ', event)
      }

      this.ws.onerror = error => {
        console.log('ws error: ', error)
      }
    }
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
