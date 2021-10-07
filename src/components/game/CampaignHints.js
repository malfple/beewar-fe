import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import queenPNG from '../../pixi/assets/unit-queen.png'

function CampaignHints(props) {
  if(props.campaignLevel === 1) {
    return (
      <div>
        <p>
          Welcome to Bee War!
        </p>
        <p>
          In campaign games, you normally control the red units.
          Try left-clicking on one of them to open up its movement range.
          You can click again on an empty green hex to move the selected unit there,
          and then click again for the 3rd time to confirm the move.
          To cancel, or select another unit, click on another unit or another non-coloured hex.
          You can click on enemy units too!
        </p>
        <p>
          Finally after you've made your turn,
          click on the end turn button at the bottom right of the screen to end your turn.
          On your second turn, some units may already be in attack range of each other.
          This time you can see a red hex when moving your units.
        </p>
        <p>
          Your objective in this game is to destroy the enemy queen!
        </p>
        <p>The queen looks like this: <img src={queenPNG} alt={'queen'} height="50px" /></p>
      </div>
    )
  }

  if(props.campaignLevel === 2) {
    return (
      <div>
        <p>
          There are more unfamiliar hexes now!
        </p>
        <p>
          These hexes have different types of terrain.
          Some terrains slow down unit movement and some terrains block unit movement completely.
          To get the complete info, you can visit the <Link to="/wiki">wiki</Link> page.
        </p>
        <p>
          Oh shoot! Since this map is long, you can also right-click and drag the screen to move the camera.
        </p>
      </div>
    )
  }

  console.error('hints for this the given campaign level not found')

  return (
    <div>
      something went wrong.
    </div>
  )
}

CampaignHints.propTypes = {
  campaignLevel: PropTypes.number.isRequired,
}

export default CampaignHints
