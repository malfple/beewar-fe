import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

import {apiMapCreate, apiMapList} from '../../modules/api/map'
import MapCard from '../../components/cards/MapCard'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'
import Button from '../../components/forms/button/Button'
import {UserTokenContext} from '../../context'

function MapList() {
  const [state, setState] = useState({
    loading: true,
    maps: [],
  })

  const userToken = useContext(UserTokenContext)
  const loggedIn = userToken.username !== ''

  const history = useHistory()

  useEffect(() => {
    apiMapList().then(res => {
      setState({
        loading: false,
        maps: res.data.maps,
      })
    })
  }, [])

  function createMap(e) {
    e.preventDefault()
    if(!window.confirm('Create a new map?')) {
      return
    }
    apiMapCreate(userToken.token).then(res => {
      if(res.data.err_msg === '') {
        alert(`Created map with id ${res.data.map_id}`)
        history.push(`/map/${res.data.map_id}`)
      } else {
        alert(`Error: ${res.data.err_msg}`)
      }
    }).catch(err => {
      alert(err)
    })
  }

  return (
    <div>
      <div>
        <h1>Maps</h1>
        {loggedIn ?
          <Button theme="hollow" small={true}>
            <div onClick={createMap}>Create a new map</div>
          </Button>
          : null}
      </div>
      {state.loading ? <NormalLoadingSpinner /> : null}
      <div className="card-deck">
        {state.maps.map((map, i) => <MapCard key={i} map={map} />)}
      </div>
    </div>
  )
}

export default MapList
