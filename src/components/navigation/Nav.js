import React from 'react'
import PropTypes from 'prop-types'
import './Navigation.css'

function Nav(props) {
  if(!props.show) {
    return null
  }

  return (
    <div className="navbar__navs__nav">
      {props.children}
    </div>
  )
}

Nav.propTypes = {
  show: PropTypes.bool.isRequired,
}

export default Nav
