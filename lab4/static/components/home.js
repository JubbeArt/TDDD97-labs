import React from 'react'
import { requests, getFormInput, postsToHTML, userDataToHTML } from '../helpers'

export default class Home extends React.Component {
  constructor (props) {
    super()

    this.state = {
      data: {},
      posts: []
    }
  }

  async componentDidMount () {
    await this.getUserData()
    await this.getUserPosts()
  }

  async getUserData () {
    const data = await requests.get('/get_user_data_by_token')
    this.setState({ data })
  }

  async getUserPosts () {
    const posts = await requests.get('/get_user_messages_by_token')
    this.setState({ posts })
  }

  async sendPost (event) {
    const { message } = getFormInput(event)
    const email = (await requests.get('/get_user_data_by_token')).email
    await requests.post('/post_message', { message, email }, false)
    this.getUserPosts()
  }

  render () {
    return (
      <div id='home'>
        <h2>User info</h2>
        <div id='home-user-data'>
          {userDataToHTML(this.state.data)}
        </div>
        <hr />

        <h2>New message</h2>
        <form onSubmit={(event) => this.sendPost(event)}>
          <textarea name='message' cols='50' rows='5' required />
          <input type='submit' defaultValue='Post message' />
        </form>
        <hr />

        <h2>All messages</h2>
        <button onClick={() => this.getUserPosts()}>Reload</button>
        <div id='post-container'>
          {postsToHTML(this.state.posts).reverse()}
        </div>
      </div>
    )
  }
}
