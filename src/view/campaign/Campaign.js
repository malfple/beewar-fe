import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'
import CampaignList from './CampaignList'
import NotFound from '../NotFound'
import withFetchMapData from '../map/withFetchMapData'
import CampaignView from './CampaignView'
import CurrentCampaign from './CurrentCampaign'
import CampaignHome from './CampaignHome'

const CampaignViewWithFetchMapData = withFetchMapData(CampaignView)

function Campaign() {
  const {path} = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route exact path={`${path}/`}>
          <CampaignHome />
        </Route>
        <Route exact path={`${path}/current`}>
          <CurrentCampaign />
        </Route>
        <Route exact path={`${path}/list`}>
          <CampaignList />
        </Route>
        <Route path={`${path}/:level/map/:id`}>
          <CampaignViewWithFetchMapData />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default Campaign
