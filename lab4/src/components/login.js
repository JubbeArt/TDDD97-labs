import React from 'react'
import { requests, getFormInput } from '../helpers'

export default class extends React.Component {
  async handleLogin (event) {
    const { email, password } = getFormInput(event)

    try {
      const result = await requests.post('/sign_in', { email, password })
      this.props.setToken(result.token)
      this.props.clearFeedback()
    } catch (err) {
      this.props.feedback(err.toString())
    }
  }

  async handleSignUp (event) {
    const input = getFormInput(event)

    if (input.password !== input.password2) {
      this.props.feedback('Passwords needs to match')
      return
    }

    try {
      await requests.post('/sign_up', input, false)
      this.props.feedback('Successfully created account!', false)
    } catch (err) {
      this.props.feedback(err.toString())
    }
  }

  render () {
    return (
      <div id='bigboy'>
        <div id='logo-slogan'>
          <img src='./static/wimage.png' />
        </div>
        <div id='smallboy'>
          <div id='login'>
            <form onSubmit={(event) => this.handleLogin(event)}>
              <div className='input-field'>Email: <input name='email' type='text' required /></div>
              <div className='input-field'>Password: <input name='password' type='password' length='10' pattern='.{8,}' required /></div>
              <div className='input-buttom'><input type='submit' value='login' /></div>
            </form>

          </div>
          <div id='signup'>
            <h2>Sign up here</h2>
            <form onSubmit={(event) => this.handleSignUp(event)}>
              <div className='input-field'>First name: <input name='firstname' type='text' required defaultValue='a' /></div>
              <div className='input-field'>Family name: <input name='familyname' type='text' required defaultValue='a' /></div>
              <div className='input-field'>Gender:
                <select name='gender'>
                  <option defaultValue='male'>Male</option>
                  <option defaultValue='female'>Female</option>
                </select>
              </div>
              <div className='input-field'>City: <input name='city' type='text' required defaultValue='a' /></div>
              <div className='input-field'>Country: <input name='country' type='text' required defaultValue='a' /></div>
              <div className='input-field'>Email: <input name='email' type='email' required defaultValue='a@a' /></div>
              <div className='input-field'>Password: <input type='password' name='password' required minLength='8' defaultValue='aaaaaaaa' /></div>
              <div className='input-field'>Repeat PW: <input type='password' name='password2' required minLength='8' defaultValue='aaaaaaaa' /></div>
              <div className='input-buttom'><input type='submit' value='SignUp' /></div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
