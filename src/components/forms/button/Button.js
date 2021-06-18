import React from 'react'
import PropTypes from 'prop-types'
import './Button.css'

function Button(props) {
  let className = 'Button '
  switch (props.theme) {
    case 'fill':
      className += 'Button--fill'
      break
    case 'hollow':
      className += 'Button--hollow'
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
