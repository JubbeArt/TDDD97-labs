import React from 'react'

export default class Media extends React.Component {
  constructor () {
    super()

    this.doShit = this.doShit.bind(this)
  }

  doShit (event) {
    event.preventDefault()
    let formData = new FormData()
    event.target.querySelectorAll('input').forEach(input => {
      if (input.type === 'file') {
        formData.append('file', input.files[0])
      }
    })

    fetch('http://localhost:5000/upload_file', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': localStorage.getItem('TOKEN')
      }
    })
      .then(response => {
        if (response.ok) {
          this.props.feedback('File uploaded :D ^_^ 🐎', false)
        } else {
          this.props.feedback(response.statusText)
        }
      })
  }

  render () {
    return (
      <>
        <div id='media' onSubmit={this.doShit}>
          <form encType='multipart/form-data'>
            <input type='file' />
            <input type='submit' />
          </form>
        </div>
      </>
    )
  }
}
