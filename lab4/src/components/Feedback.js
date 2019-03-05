import React from 'react'

const Feedback = (props) => {
  const { isError, message } = props

  if (message !== '' && message !== ' ') {
    return (
      <div id='feedback' style={{ background: isError ? 'red' : 'green' }}>{message}</div>
    )
  } else {
    return null
  }
}

export default Feedback
