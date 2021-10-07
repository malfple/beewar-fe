import {useContext, useEffect, useState} from 'react'
import {apiCampaignCurrent} from '../../modules/api/campaign'
import {UserTokenContext} from '../../context'

/**
 * This hook calls apiCampaignCurrent and returns game id.
 * If game id is null, it means it is loading.
 */
function useApiCampaignCurrent() {
  const userToken = useContext(UserTokenContext)
  const [state, setState] = useState({
    gameID: null,
    campaignLevel: null,
  })

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiCampaignCurrent(userToken.token).then(res => {
        setState({
          gameID: res.data.game_id,
          campaignLevel: res.data.campaign_level,
        })
      })
    }).catch(() => {
      // do nothing
    })
  }, [userToken])

  return [state.gameID, state.campaignLevel]
}

export default useApiCampaignCurrent
