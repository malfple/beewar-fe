import {useContext, useEffect, useState} from 'react'
import {apiCampaignCurrent} from '../../modules/api/campaign'
import {UserTokenContext} from '../../context'

/**
 * This hook calls apiCampaignCurrent and returns game id.
 * If game id is null, it means it is loading.
 */
function useApiCampaignCurrent() {
  const userToken = useContext(UserTokenContext)
  const [gameID, setGameID] = useState(null)

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiCampaignCurrent(userToken.token).then(res => {
        setGameID(res.data.game_id)
      })
    }).catch(() => {
      // do nothing
    })
  }, [userToken])

  return gameID
}

export default useApiCampaignCurrent
