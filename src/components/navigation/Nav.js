import React from 'react'
import PropTypes from 'prop-types'
import './Navigation.css'

function Nav(props) {
  if(!props.show) {
    return null
  }

  if(props.small) {
    return (
        <div className="navbar__navs__nav nav--small">
          {props.children}
        </div>
    )
  }

  return (
    <div className="navbar__navs__nav">
      {props.children}
    </div>
  )
}

Nav.propTypes = {
  show: PropTypes.bool.isRequired,
  small: PropTypes.bool,
}

export default Nav
