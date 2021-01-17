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
   */
  checkTokenAndRefresh: () => {},
})

export {
  UserTokenContext,
}
