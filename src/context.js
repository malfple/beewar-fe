import React from 'react'

// provides username and access token
// if username is empty, there is no logged-in user
const UserTokenContext = React.createContext({
  username: '',
  userID: 0,
  token: '',
  /**
   * this function should implement refreshing the token.
   * this function should check first if the token is not expired before requesting for a new one.
   * and then, it should return a promise:
   * 1. resolution is called if the token is not expired (i.e. you can continue doing whatever),
   * 2. rejection is called if the token is refreshed, regardless of error (stop what you are doing and let your parent re-mount you).
   */
  checkTokenAndRefresh: () => new Promise((resolutionFunc, rejectionFunc) => {
    resolutionFunc()
    // in default case, rejectionFunc is never called.
  }),
})

export {
  UserTokenContext,
}
