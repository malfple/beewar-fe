import React from 'react'

// provides username and access token
const UserTokenContext = React.createContext({
  username: '',
  token: ''
})

export {
  UserTokenContext
}
