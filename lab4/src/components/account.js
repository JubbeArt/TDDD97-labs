import React from 'react'
import { requests, getFormInput } from '../helpers'

export default class extends React.Component {
  async handleResetPassword (event) {
    const { oldPassword, newPassword, newPassword2 } = getFormInput(event)

    if (newPassword !== newPassword2) {
      this.props.feedback('Passwords needs to match')
      return
    }

    try {
      await requests.post('/change_password', { newPassword, oldPassword }, false)
      this.props.feedback('Successfully changed password', false)
    } catch (err) {
      this.props.feedback(err.toString())
    }
  }

  async signOut () {
    await requests.get('/sign_out', false)
    this.props.removeToken()
  }

  render () {
    return (
      <div id='account'>
        <h2>Change password</h2>
        <form id='reset-password-form' onSubmit={() => this.handleResetPassword(event)}>
          <div className='input-field'>
              Old password: <input name='oldPassword' type='password' length='10' pattern='.{8,}' required />
          </div>
          <div className='input-field'>
              Password: <input name='newPassword' type='password' length='10' pattern='.{8,}' required />
          </div>
          <div className='input-field'>
              Repeat password: <input name='newPassword2' type='password' length='10' pattern='.{8,}' required />
          </div>
          <div className='input-buttom'>
            <input type='submit' defaultValue='Change password' />
          </div>
        </form>
        <button onClick={() => this.signOut()}>Sign-out</button>
      </div>
    )
  }
}
