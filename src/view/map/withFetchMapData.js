import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {apiMapGet} from '../../modules/api/map'
import NormalLoadingSpinner from '../../components/loading/NormalLoadingSpinner'

/**
 * This HOC is to be used with the Map router. It needs to receive an `id` match url.
 *
 * The wrapped component has to be a top-level view component that doesn't need any props
 * other than a map object given by this HOC.
 *
 * @param WrappedComponent
 * @returns {function(*)}
 */
function withFetchMapData(WrappedComponent) {
  return function Wrapper() {
    const [map, setMap] = useState(null)
    const {id} = useParams()

    useEffect(() => {
      apiMapGet(id).then(res => {
        if(res.data.map) {
          setMap(res.data.map)
        }
      })

    }, [id])

    if(!map) {
      return (
        <div>
          <NormalLoadingSpinner />
        </div>
      )
    }

    return (
      <WrappedComponent map={map} />
    )
  }
}

export default withFetchMapData
