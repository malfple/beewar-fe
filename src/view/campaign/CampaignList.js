import React, {useContext, useEffect, useState} from 'react'
import {apiCampaignList} from '../../modules/api/campaign'
import {UserTokenContext} from '../../context'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'
import CampaignCard from '../../components/cards/CampaignCard'
import {Link} from 'react-router-dom'

function CampaignList() {
  const userToken = useContext(UserTokenContext)
  const [state, setState] = useState({
    loading: true,
    campaignMaps: [],
  })

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiCampaignList(userToken.token).then(res => {
        setState({
          loading: false,
          campaignMaps: res.data.campaign_maps,
        })
      })
    }).catch(() => {
      // do nothing
    })
  }, [userToken])

  return (
    <div className="main-container">
      <h1>Select Campaign Chapter</h1>
      <div>
        The highest campaign level you have cleared can be seen in your <Link to={`/profile/${userToken.username}`}>
        profile page</Link>. The highest level you can play right now is the highest you've reached + 1.
        <br />
      </div>
      <div>
        {state.loading ? <NormalLoadingSpinner /> : null}
        {state.campaignMaps.map((campaignMap, i) => <CampaignCard key={i} level={i+1} map={campaignMap} />)}
      </div>
    </div>
  )
}

export default CampaignList
