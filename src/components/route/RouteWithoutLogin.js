import React from 'react'
import {Route, Redirect} from 'react-router-dom'

function RouteWithoutLogin({isLoggedIn, ...props}) {
  return (
    <Route {...props}>
      {isLoggedIn ? <Redirect to="/" /> : props.children}
    </Route>
  )
}

export default RouteWithoutLogin
