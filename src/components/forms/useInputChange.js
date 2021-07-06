import {useState} from 'react'

/**
 * Use this hook for handling input change in forms.
 *
 * Set the defaultInput to an object where its props are the default input values.
 *
 * Returns the input state and the handle change function
 *
 * @param {Object} defaultInput
 */
function useInputChange(defaultInput) {
  const [input, setInput] = useState(defaultInput)

  const handleInputChange = (e) => setInput({
    ...input,
    [e.currentTarget.name]: e.currentTarget.value,
  })

  return [input, handleInputChange]
}

export default useInputChange
