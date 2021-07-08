import React, {useContext, useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import InputBox from '../../components/forms/InputBox'
import useInputChange from '../../components/forms/useInputChange'
import MapEditApp from '../../components/pixiapp/MapEditApp'
import GameComms from '../../modules/communication/GameComms'

import BrushPanel from '../../components/mapeditor/BrushPanel'
import Button from '../../components/forms/button/Button'
import {apiMapUpdate} from '../../modules/api/map'
import {UserTokenContext} from '../../context'

function MapEdit(props) {
  const userToken = useContext(UserTokenContext)
  const [input, handleInputChange] = useInputChange({
    name: props.map.name,
  })
  /** @type {React.MutableRefObject<GameComms>} */
  const comms = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    comms.current = new GameComms()

    setLoading(false)

    return function cleanup() {
      // actually do nothing, because no registration to comms here
    }
  }, [])

  function handleSubmit(e) {
    console.log(input, props.map)
    // check token
    userToken.checkTokenAndRefresh().then(() => {
      apiMapUpdate(
        userToken.token,
        props.map.id,
        props.map.type,
        props.map.height,
        props.map.width,
        input.name,
        props.map.player_count,
        props.map.terrain_info,
        props.map.unit_info,
      ).then(res => {
        const errMsg = res.data.err_msg
        console.log(res.data)
        if(errMsg.length === 0) {
          alert('save success')
        } else {
          alert(errMsg)
        }
      })
    }).catch(() => {
      // do nothing
    })
    e.preventDefault()
  }

  if(loading) {
    return null
  }

  return (
    <div>
      <h1>Map Editor</h1>
      <div className="map-game-view">
        <div className="map-game-view__column-left">
          <div>
            <MapEditApp map={props.map} comms={comms.current} />
          </div>
        </div>
        <div className="map-game-view__column-right">
          <BrushPanel comms={comms.current} />
        </div>
      </div>
      <div>
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <InputBox
              label="Map ID"
              type="text"
              name="id"
              defaultValue={props.map.id}
              disabled={true}
            />
          </div>
          <div>
            <InputBox
              label="Map Name"
              type="text"
              name="name"
              defaultValue={props.map.name}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <div>
            <Button theme="fill">
              <input type="submit" value="Save" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

MapEdit.propTypes = {
  map: PropTypes.object.isRequired,
}

export default MapEdit
