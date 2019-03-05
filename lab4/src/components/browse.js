import React from 'react'
import { requests, getFormInput, userDataToHTML, postsToHTML } from '../helpers'

export default class Browse extends React.Component {
  constructor () {
    super()

    this.state = {
      lastEmail: '',
      data: {},
      posts: []
    }
  }

  async browseUser (event) {
    const input = getFormInput(event)

    try {
      const data = await requests.get('/get_user_data_by_email?email=' + input.email)
      const posts = await requests.get('/get_user_messages_by_email?email=' + input.email)
      this.setState({ lastEmail: input.email, data: data, posts: posts })
      this.props.clearFeedback()
    } catch (err) {
      this.props.feedback(err.toString())
    }
  }

  // reloadUserData () {
  //   ID('user-lookup').click()
  // }

  async postMessageToUser (event) {
    const { message } = getFormInput(event)
    console.log(message)
    await requests.post('/post_message', { message, email: this.state.lastEmail }, false)
    // fetch other users posts
    const posts = await requests.get('/get_user_messages_by_email?email=' + this.state.lastEmail)
    this.setState({ posts: posts })
  }

  render () {
    return <>
      <div id='browse'>
        <h2>Look up users</h2>
        <form onSubmit={event => this.browseUser(event)}>
          <div className='input-field'>
                    Email: <input name='email' type='email' required />
          </div>
          <input type='submit' id='user-lookup' value='Look up user' />
        </form>

        <div id='user-page' style={{ display: this.state.data ? 'block' : 'none' }}>
          <h2>User info</h2>
          <div id='other-user-data'>
            { userDataToHTML(this.state.data) }
          </div>
          <hr />

          <h2>New message to user</h2>
          <form onSubmit={event => this.postMessageToUser(event)}>
            <textarea className='message' name='message' cols='50' rows='5' />
            <input type='submit' value='Post message' />
          </form>
          <hr />

          <h2>All messages</h2>
          <button onClick={this.reloadUserData}>Reload</button>
          <div id='other-user-posts'>
            {postsToHTML(this.state.posts).reverse()}
          </div>
        </div>
      </div>
        </>
  }
}
