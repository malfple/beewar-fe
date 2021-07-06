import React from 'react'
import PropTypes from 'prop-types'
import './InputBox.css'

function InputBox(props) {
  return (
    <div className="form__input-box">
      <input
        className="form__input-box__input"
        placeholder=" "
        {...props}
      />
      <span className="form__input-box__floating-label">{props.label}</span>
    </div>
  )
}

InputBox.propTypes = {
  label: PropTypes.string,
}

export default InputBox
