import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import Browse from './components/browse'
import Account from './components/account'
import Home from './components/home'
import Login from './components/login'
import Stats from './components/stats'
import { requests } from './helpers'
import Feedback from './components/Feedback'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      token: localStorage.getItem('TOKEN'),
      // stats page
      concurrentUsers: 0,
      viewers: 0,
      numberOfPosts: 0,
      // feedback
      message: '',
      isError: false
    }

    this.removeToken = this.removeToken.bind(this)
    this.setToken = this.setToken.bind(this)
    this.feedback = this.feedback.bind(this)
    this.clearFeedback = this.clearFeedback.bind(this)
  }

  async componentDidMount () {
    if (this.state.token == null) {
      return
    }

    // validate token on mount
    try {
      await requests.get('/validate_token', false)
      this.setUpSocket()
    } catch (err) {
      this.removeToken()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // user logged in => setup socket
    if (prevState.token == null && this.state.token != null) {
      this.setUpSocket()
    }
  }

  removeToken () {
    localStorage.removeItem('TOKEN')
    this.setState({ token: null })

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  setToken (token) {
    localStorage.setItem('TOKEN', token)
    this.setState({ token })
  }

  setUpSocket () {
    console.log('doing socket stuff...')
    this.socket = new WebSocket('wss://localhost:5000/log_in')
    this.socket.onopen = () => this.socket.send(this.state.token)

    this.socket.onmessage = (message) => {
      message = JSON.parse(message.data)
      const { type, data } = message

      if (type === 'logout') {
        this.removeToken()
      } else if (type === 'stats') {
        this.setState({
          concurrentUsers: data.concurrent_users,
          viewers: data.viewers,
          numberOfPosts: data.number_of_posts
        })
        console.log('GOT NEW STATS FROM SERVER', type)
        console.log(message.data)
      }
    }
  }

  feedback (message, isError = true) {
    this.setState({ message, isError })
  }

  clearFeedback () {
    this.setState({ message: '' })
  }

  render () {
    const feedbackProps = {
      feedback: this.feedback,
      clearFeedback: this.clearFeedback
    }

    if (this.state.token == null) {
      return (
        <>
          <Feedback isError={this.state.isError} message={this.state.message} />
          <Login setToken={this.setToken} {...feedbackProps} />
        </>
      )
    }

    return (
      <>
        <Feedback isError={this.state.isError} message={this.state.message} />
        <div className='tabs'>
          <Link to={'home'} className='tab' style={{ background: 'yellow' }}>Home</Link>
          <Link to={'browse'} className='tab' style={{ background: 'darkgoldenrod' }} >Browse</Link>
          <Link to={'account'} className='tab' style={{ background: 'orange' }} >Account</Link>
          <Link to={'stats'} className='tab' style={{ background: 'hotpink' }} >Stats</Link>
        </div>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/home' />} />
          <Route path='/home' render={() => <Home {...feedbackProps} />} />
          <Route path='/browse' render={() => <Browse {...feedbackProps} />} />
          <Route path='/account' render={() => <Account {...feedbackProps} removeToken={this.removeToken} />} />
          <Route path='/stats' render={() => (
            <Stats
              concurrentUsers={this.state.concurrentUsers}
              numberOfPosts={this.state.numberOfPosts}
              viewers={this.state.viewers}
              {...feedbackProps} />
          )}
          />
        </Switch>
    </>
    )
  }
}

ReactDOM.render(
  <BrowserRouter basename={__dirname}>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
