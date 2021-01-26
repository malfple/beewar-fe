import React, {useContext} from 'react'
import {Route, Redirect, useLocation} from 'react-router-dom'

import {UserTokenContext} from '../../context'

function RouteWithoutLogin({children, ...props}) {
  // if this route is redirected from RouteWithLogin,
  // a redirect back pathname will be provided, and we will redirect back there if login is successful
  const location = useLocation()

  let redirectTo = '/'
  if(location.state !== undefined) {
    redirectTo = location.state.from
  }

  const {username} = useContext(UserTokenContext)
  const isLoggedIn = username !== ''

  return (
    <Route {...props}>
      {isLoggedIn ? <Redirect to={redirectTo} /> : children}
    </Route>
  )
}

export default RouteWithoutLogin
