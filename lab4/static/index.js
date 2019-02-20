import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import Browse from './components/browse'
import Account from './components/account'
import Home from './components/home'
import Login from './components/login'

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

function App () {
  const [token, setToken] = useState(localStorage.getItem('TOKEN'))

  const setToken2 = (token) => {
    localStorage.setItem('TOKEN', token)
    setToken(token)
  }

  const [message, setMessage] = useState(' ')
  const [isError, setIsError] = useState(false)

  function feedback (newMessage, newIsError = true) {
    setMessage(newMessage)
    setIsError(newIsError)
  }

  function clearFeedback () {
    setMessage('')
  }

  function removeToken () {
    localStorage.removeItem('TOKEN')
    setToken(null)
  }

  if (token !== null) {
    return (
      <>
        <Feedback isError={isError} message={message} />
        <div className='tabs'>
          <Link to={'home'} className='tab' style={{ background: 'yellow' }}>Home</Link>
          <Link to={'browse'} className='tab' style={{ background: 'darkgoldenrod' }} >Browse</Link>
          <Link to={'account'} className='tab' style={{ background: 'orange' }} >Account</Link>
        </div>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/home' />} />
          <Route path='/home' render={() => <Home feedback={feedback} clearFeedback={clearFeedback} />} />
          <Route path='/browse' render={() => <Browse feedback={feedback} clearFeedback={clearFeedback} />} />
          <Route path='/account' render={() => <Account feedback={feedback} clearFeedback={clearFeedback} removeToken={removeToken} />} />
        </Switch>
    </>
    )
  }

  return (
    <>
      <Feedback isError={isError} message={message} />
      <Login setToken={setToken2} feedback={feedback} clearFeedback={clearFeedback} />
    </>
  )
}

ReactDOM.render(
  <BrowserRouter basename={__dirname}>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('root')
)
