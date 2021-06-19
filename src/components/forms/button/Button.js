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
  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

Button.propTypes = {
  theme: PropTypes.oneOf(['fill', 'hollow']).isRequired,
}

export default Button
