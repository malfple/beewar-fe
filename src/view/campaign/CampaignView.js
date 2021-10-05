import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {useHistory, useParams} from 'react-router-dom'

import MapViewApp from '../../components/pixiapp/MapViewApp'
import Button from '../../components/forms/button/Button'
import {apiCampaignStart} from '../../modules/api/campaign'
import {UserTokenContext} from '../../context'

function CampaignView(props) {
  const {level} = useParams()
  const userToken = useContext(UserTokenContext)
  const history = useHistory()
  console.log(`rendering campaign level ${level}`)

  function startCampaign(e) {
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiCampaignStart(userToken.token, level).then(res => {
        if(res.data.err_msg === '') {
          alert(`start campaign level: ${level}, with game id: ${res.data.game_id}`)
          history.push('/campaign')
        } else {
          alert(`Error: ${res.data.err_msg}`)
        }
      })
    }).catch(() => {
      // do nothing
    })
    e.preventDefault()
  }

  return (
    <div className="map-game-view">
      <div className="map-game-view__column-left">
        <div>
          <MapViewApp map={props.map} />
        </div>
      </div>
      <div className="map-game-view__column-right">
        <h1>{props.map.name}</h1>
        <div>
          <Button theme="hollow">
            <div onClick={startCampaign}>
              Start Campaign
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

CampaignView.propTypes = {
  map: PropTypes.object.isRequired,
}

export default CampaignView
