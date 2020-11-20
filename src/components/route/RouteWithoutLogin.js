import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'

import {UserTokenContext} from '../../context'

function RouteWithoutLogin({children, ...props}) {
  // if this route is redirected from RouteWithLogin,
  // a redirect back pathname will be provided, and we will redirect back there if login is successful
  let redirectTo = '/'
  if(props.location.state !== undefined) {
    redirectTo = props.location.state.from
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
