import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import Browse from './components/browse'
import Account from './components/account'
import Home from './components/home'
import Login from './components/login'
import Stats from './components/stats';

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
  const [concurrentUsers, setConcurrentUsers] = useState(0)
  const [viewers, setViewers] = useState(0)
  const [numberOfPosts, setNumberOfPosts] = useState(0)

  function removeToken () {
    localStorage.removeItem('TOKEN')
    setToken(null)
  }

  useEffect(() => {
    console.log('token changed')
    if(!token) {
      return
    }

    const connection = new WebSocket('ws://localhost:5000/log_in')

    connection.onopen = () => connection.send(token)
    connection.onmessage = (message) => {
      message = JSON.parse(message.data)
      const {type, data} = message

      if(type === 'logout') {
        removeToken()
      } else if (type === 'stats') {
        setConcurrentUsers(data.concurrent_users)
        setViewers(data.viewers)
        setNumberOfPosts(data.number_of_posts)
        console.log('GOT NEW STATS FROM SERVER', data)
      }
      // 
      // displayView()
    }
    
  }, [token])

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


  if (token !== null) {
    return (
      <>
        <Feedback isError={isError} message={message} />
        <div className='tabs'>
          <Link to={'home'} className='tab' style={{ background: 'yellow' }}>Home</Link>
          <Link to={'browse'} className='tab' style={{ background: 'darkgoldenrod' }} >Browse</Link>
          <Link to={'account'} className='tab' style={{ background: 'orange' }} >Account</Link>
          <Link to={'stats'} className='tab' style={{ background: 'hotpink' }} >Stats</Link>
        </div>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/home' />} />
          <Route path='/home' render={() => <Home feedback={feedback} clearFeedback={clearFeedback} />} />
          <Route path='/browse' render={() => <Browse feedback={feedback} clearFeedback={clearFeedback} />} />
          <Route path='/account' render={() => <Account feedback={feedback} clearFeedback={clearFeedback} removeToken={removeToken} />} />
          <Route path='/stats' render={() => <Stats 
            concurrentUsers={concurrentUsers}
            viewers={viewers}
            feedback={feedback} 
            numberOfPosts={numberOfPosts}
            clearFeedback={clearFeedback} />} />
        </Switch>
    </>
    )
  }

  return (
    <div id='stats'>
      <Feedback isError={isError} message={message} />
      <Login setToken={setToken2} feedback={feedback} clearFeedback={clearFeedback} />
    </div>
  )
}

ReactDOM.render(
  <BrowserRouter basename={__dirname}>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('root')
)
