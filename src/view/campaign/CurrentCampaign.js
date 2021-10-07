import React from 'react'
import {Link} from 'react-router-dom'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'
import CampaignGameView from './CampaignGameView'
import useApiCampaignCurrent from './useApiCampaignCurrent'

function CurrentCampaign() {
  const gameID = useApiCampaignCurrent()

  if(gameID === null) {
    return (
      <div>
        <NormalLoadingSpinner />
      </div>
    )
  }

  if(gameID === 0) { // no current campaign game
    return (
      <div>
        <h1>Current Campaign</h1>
        <div>
          Currently, there is no active campaign game
        </div>
        <div>
          <Link to="/campaign/list">
            >>> go to campaign list
          </Link>
        </div>
      </div>
    )
  }

  return (
    <CampaignGameView gameID={gameID} />
  )
}

export default CurrentCampaign
