import React, {useContext} from 'react'
import {Route, Redirect, useLocation} from 'react-router-dom'

import {UserTokenContext} from '../../context'

function RouteWithLogin({children, ...props}) {
  // redirects to login page if not logged in
  // while also, providing the pathname so it can redirect back here
  // the pathname will be received by RouteWithoutLogin, which controls the redirection

  const location = useLocation()

  const {username} = useContext(UserTokenContext)
  const isLoggedIn = username !== ''

  return (
    <Route {...props}>
      {
        !isLoggedIn ?
          <Redirect to={{
            pathname: '/login',
            state: {from: location.pathname},
          }} />
          :
          children
      }
    </Route>
  )
}

export default RouteWithLogin
