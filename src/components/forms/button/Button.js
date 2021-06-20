import React from 'react'
import PropTypes from 'prop-types'
import './Button.css'

function Button(props) {
  let className = 'button '
  switch (props.theme) {
    case 'fill':
      className += 'button--fill'
      break
    case 'hollow':
      className += 'button--hollow'
      break
    default:
      // impossible lol
  }

  if(props.small) {
    className += ' button--small'
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

Button.propTypes = {
  theme: PropTypes.oneOf(['fill', 'hollow']).isRequired,
  small: PropTypes.bool,
}

export default Button
