import React from 'react'
import PropTypes from 'prop-types'
import './InputBox.css'

function SelectBox(props) {
  return (
    <div className="form__input-box">
      <select
        className="form__input-box__input form__input-box__input--select"
        {...props}
      >
        {props.children}
      </select>

      <span className="form__input-box__floating-label">{props.label}</span>
    </div>
  )
}

SelectBox.propTypes = {
  label: PropTypes.string,
}

export default SelectBox
