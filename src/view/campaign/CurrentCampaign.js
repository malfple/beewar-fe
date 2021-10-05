import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {apiCampaignCurrent} from '../../modules/api/campaign'
import {UserTokenContext} from '../../context'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'

function CurrentCampaign(props) {
  const userToken = useContext(UserTokenContext)
  const [state, setState] = useState({
    loading: true,
    gameID: 0,
  })

  useEffect(() => {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiCampaignCurrent(userToken.token).then(res => {
        setState({
          loading: false,
          gameID: res.data.game_id,
        })
      })
    }).catch(() => {
      // do nothing
    })
  }, [userToken])

  return (
    <div>
      <h1>Current Campaign</h1>
      <div>
        {state.loading ? <NormalLoadingSpinner /> : null}
        {!state.loading ? `current campaign game id: ${state.gameID}` : null}
      </div>
      <div hidden={state.gameID === 0}>
        <Link to={`/game/${state.gameID}`}>
          >>> go to game
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

export default CurrentCampaign
