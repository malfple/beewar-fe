import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'

import './Card.css'

function CampaignCard(props) {
  const history = useHistory()

  function toCampaign() {
    history.push(`/campaign/${props.level}/map/${props.map.id}`)
  }

  return (
    <div className="card card--campaign" onClick={toCampaign}>
      <div className="card__content">
        <h2>{`Level ${props.level}`}</h2> <br />
        {`Map name: ${props.map.name}`}
      </div>
    </div>
  )
}

CampaignCard.propTypes = {
  level: PropTypes.number.isRequired,
  map: PropTypes.object.isRequired,
}

export default CampaignCard
