import React from 'react'

// provides username and access token
// if username is empty, there is no logged-in user
const UserTokenContext = React.createContext({
  username: '',
  token: '',
  refreshTheToken: () => {}
})

export {
  UserTokenContext
}
