import React from 'react'
import {Link} from 'react-router-dom'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'
import useApiCampaignCurrent from './useApiCampaignCurrent'

function CampaignHome() {
  const [gameID] = useApiCampaignCurrent()

  return (
    <div>
      <h1>Campaign</h1>
      <div>
        {gameID === null ? <NormalLoadingSpinner /> : null}
      </div>
      <div hidden={gameID === null || gameID === 0}>
        <div>
          You have an active campaign game!
        </div>
        <Link to="/campaign/current">
          >>> go to campaign game
        </Link>
      </div>
      <div>
        <Link to="/campaign/list">
          >>> go to campaign list
        </Link>
      </div>
    </div>
  )
}

export default CampaignHome
