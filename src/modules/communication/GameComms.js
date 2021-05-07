import {GROUP_NONE} from './groupConstants'

/**
 * Game Comms
 * This is like a message bus, where game components communicate
 *
 * Components/Classes/Subscribers can register/unregister to this class and specify which groups they belong to.
 *
 * message/packet format sent is the same as BE's websocket messages: {cmd, data}.
 *
 * registered subscribers need to have handleComms function
 */

class GameComms {
  constructor() {
    this.allSubscribers = new Set()
    this.groupedSubscribers = {}
  }

  /**
   * @param {Object}    subscriber      - need to have handleComms(msg) function defined
   * @param {string[]}  groups          - an array of strings. Use groupConstants for the group names
   * @param {boolean}   excludeFromAll  - if true, won't add to all subscribers
   */
  registerSubscriber(subscriber, groups=[], excludeFromAll=false) {
    if(!excludeFromAll) {
      this.allSubscribers.add(subscriber)
    }
    for(let i = 0; i < groups.length; i++) {
      const group = groups[i]
      if(!(group in this.groupedSubscribers)) {
        this.groupedSubscribers[group] = new Set()
      }
      this.groupedSubscribers[group].add(subscriber)
    }
  }

  /**
   * @param {Object}    subscriber
   * @param {string[]}  groups          - the groups given has to be the same when registering
   */
  unregisterSubscriber(subscriber, groups=[]) {
    this.allSubscribers.delete(subscriber)
    for(let i = 0; i < groups.length; i++) {
      const group = groups[i]
      this.groupedSubscribers[group].delete(subscriber)
    }
  }

  /**
   * triggers message
   * @param {Object} msg          - in the form of {cmd, data}
   * @param {string} group        - if group is not provided, will send to all subscriber (except those that excludes themselves)
   */
  triggerMsg(msg, group=GROUP_NONE) {
    if(group === GROUP_NONE) {
      console.log(`COMMS: trigger msg to all ${this.allSubscribers.size} subscribers`, msg)
      this.allSubscribers.forEach(subscriber => {
        subscriber.handleComms(msg)
      })
    } else if(group in this.groupedSubscribers) {
      console.log(`COMMS: trigger msg to ${group}: ${this.groupedSubscribers[group].size} subscribers`, msg)
      this.groupedSubscribers[group].forEach(subscriber => {
        subscriber.handleComms(msg)
      })
    }
  }
}

class NullGameComms {
  registerSubscriber(subscriber, groups=[], excludeFromAll=false) {
    console.log('NULL COMMS: register subscriber', subscriber, groups)
  }
  unregisterSubscriber(subscriber, groups=[]) {
    console.log('NULL COMMS: unregister subscriber', subscriber, groups)
  }
  triggerMsg(msg, group=GROUP_NONE) {
    console.log('NULL COMMS: trigger msg', msg, group)
  }
}

const nullGameComms = new NullGameComms()

export default GameComms

export {
  nullGameComms,
}
