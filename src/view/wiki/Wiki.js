import React from 'react'
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom'
import NotFound from '../NotFound'
import Units from './Units'

function Wiki() {
  const {path} = useRouteMatch()

  const content = (
    <div>
      <h1>Wiki</h1>
      <p>
        Welcome to the wiki page.
      </p>
      <ol>
        <li><Link to={`${path}/units`}>Units</Link></li>
      </ol>
    </div>
  )

  return (
    <div className="main-container">
      <Switch>
        <Route exact path={`${path}/`}>
          {content}
        </Route>
        <Route path={`${path}/units`}>
          <Units />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default Wiki
