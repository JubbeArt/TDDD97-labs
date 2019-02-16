function ID(id) {
  return document.getElementById(id)
}

function getToken() {
  const storedToken = localStorage.getItem('TOKEN')
  return storedToken ? storedToken : undefined
}

function removeToken() {
  localStorage.removeItem('TOKEN')
}

function isLoggedIn() {
  return getToken() != undefined
}

function feedback(message, isError = true) {
  ID('feedback').innerHTML = message
  ID('feedback').style.background = isError ? 'red' : 'green'
  ID('feedback').style.display = 'block'
}

function clearFeedback() {
  ID('feedback').style.display = 'none'
}

function getFormInput(event) {
  const values = {}

  event.target.querySelectorAll('input').forEach(input => {
    if (input.type !== 'submit') {
      values[input.name] = input.value
    }
  })

  // for gender selecter
  event.target.querySelectorAll('select').forEach(input => {
    values[input.name] = input.value
  })
  
  return values
}


const requests = {
  post: function post(url, data, expectResponse = true) {
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('TOKEN'),
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok)
          return expectResponse ? response.json() : ''
        throw new Error(response.statusText)
      })
  }
  ,
  get: function get(url, expectResponse = true) {
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('TOKEN'),
      },
      method: 'GET',
    })
      .then(response => {
        if (response.ok)
          return expectResponse ? response.json() : ''
        throw new Error(response.statusText)
      })
  }
}
