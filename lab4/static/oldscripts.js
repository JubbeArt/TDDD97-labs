let connection

function createSocket () {
  connection = new WebSocket('ws://localhost:5000/log_in')

  connection.onopen = () => {
    console.log('awdawsasadawerwa432')
    connection.send(getToken())
  }

  connection.onmessage = (message) => {
    console.log('Got message. GET OUT!', message)
    removeToken()
    displayView()
  }
}

async function displayView () {
  if (!isLoggedIn()) {
    ID('root').innerHTML = ID('welcome-view').innerHTML
    return
  }

  ID('root').innerHTML = ID('profile-view').innerHTML
  clearFeedback()
  try {
    await getUserData()
    await getUserPosts()
  } catch (err) {
    // not logged in
    removeToken()
    displayView()
  }
}

window.onload = () => {
  displayView()
  if (isLoggedIn() && !connection) { createSocket() }
}
