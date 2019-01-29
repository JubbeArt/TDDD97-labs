var token = localStorage.getItem('TOKEN')
var isLoggedIn = token === null || !token ? false : true

displayView = function () {
    // the code required to display a view
    console.log(isLoggedIn);
    
    
    const root = document.getElementById('root')
    let toView = !isLoggedIn ? "welcome-view" : "profile-view" 
    root.innerHTML = document.getElementById(toView).textContent
    if(toView === "profile-view") {
        loadUserData('home')  // d(^.^)b
        getAllPosts('post-container') // ~-~
    }
}

window.onload = function () {
    displayView()
    // loadUserData()  // d(^.^)b
    // getAllPosts() // ~-~
}

function displayFeedback(message, id, isError = true) {
    const feedbackBox = document.getElementById(id)
    feedbackBox.innerHTML = message
    feedbackBox.style.color = isError ? 'red' : 'green'    
    feedbackBox.style.display = 'block'    
}

function hideFeedback(id) {
    document.getElementById(id).style.display = 'none'
}

function handleLogin(event)  {
    event.preventDefault()
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
   
    const results = serverstub.signIn(email, password)
    console.log(results)    

    if(!results.success) {
        displayFeedback(results.message, 'feedback-login-box', true)        
    } else {
        token = results.data
        isLoggedIn = true
        localStorage.setItem('TOKEN', results.data)
        displayView()
    }
}

function signOut() {
    serverstub.signOut(token)
    isLoggedIn = false
    localStorage.removeItem("TOKEN")
    token = null
    displayView()
}

function handleSignUp(event) {
    event.preventDefault()
    const pw1 = document.getElementById("pw1").value
    const pw2 = document.getElementById("pw2").value

    if(pw1 !== pw2) {
        displayFeedback('Passwords needs to match',  'feedback-box', true)
        return
    }

    const results = serverstub.signUp({
        email: document.getElementById('email').value,
        password: document.getElementById('pw2').value,
        firstname: document.getElementById('firstname').value,
        familyname: document.getElementById('familyname').value,
        gender: document.getElementById('gender').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
    })

    displayFeedback(results.message, 'feedback-box', !results.success)
}


/*------------------------- profile-view -------------------------*/
function handleNav(button) {
    const homebutton = document.getElementById("homebutton")
    const browsebutton = document.getElementById("browsebutton")
    const accountbutton = document.getElementById("accountbutton")

    const homeview = document.getElementById("homeview")
    const browseview = document.getElementById("browseview")
    const accountview = document.getElementById("accountview")

    homeview.style.display = 'none'
    browseview.style.display = 'none'
    accountview.style.display = 'none'

    homebutton.className = ''
    browsebutton.className = ''
    accountbutton.className = ''

    button.className = 'selected'

    if(button === homebutton) {
        homeview.style.display = 'block'
    } else if(button === browsebutton) {
        browseview.style.display = 'block'
    } else {
        accountview.style.display = 'block'
    }
}

function handeResetPassword(event) {
    event.preventDefault()
    
    const oldPassword = document.getElementById("old-password").value 
    const pw1 = document.getElementById("reset-password1").value
    const pw2 = document.getElementById("reset-password2").value

    if(pw1 !== pw2) {
        displayFeedback('Passwords needs to match', 'feedback-password-box', true)
        return
    }

    const results = serverstub.changePassword(token, oldPassword, pw1)
    displayFeedback(results.message, 'feedback-password-box', !results.success)
}

// ----------------HomeView---------------------

function loadUserData(prefix, email) {
    const token = localStorage.getItem("TOKEN")
    let result
    if(email) {
        result = serverstub.getUserDataByEmail(token, email)
    } else {
        result = serverstub.getUserDataByToken(token)
    }
    const data = result.data

    document.getElementById(prefix+'-first-name').innerText = data.firstname
    document.getElementById(prefix+'-family-name').innerText = data.familyname
    document.getElementById(prefix+'-gender').innerText = data.gender
    document.getElementById(prefix+'-city').innerText = data.city
    document.getElementById(prefix+'-country').innerText = data.country
    document.getElementById(prefix+'-email').innerText = data.email
} 



function sendPost() {
    const message = document.getElementById("msnbs").value
    const email = serverstub.getUserDataByToken(token).data.email
    serverstub.postMessage(token, message, email)
    getAllPosts('post-container')
}

function getAllPosts(id, email) {
    let result

    // Get other user
    if(email) {
        result = serverstub.getUserMessagesByEmail(token, email)
        if(!result.success) {
            // console.log(result)
            displayFeedback(result.message, 'feedback-user-box')
            return false
        } else {
            hideFeedback('feedback-user-box')
        }
    } else { // Get own posts
        result = serverstub.getUserMessagesByToken(token)
    }

    const postContainer = document.getElementById(id)
    postContainer.style.display = 'block'
    postContainer.innerHTML = ''

    result.data.forEach(msg => {
        postContainer.innerHTML += `<div class="post">
            ${msg.content}
        </div>`
    })

    return true
}

let email

function browseUser(event) {
    event.preventDefault()
    email = event.target[0].value
    

    const userExists = getAllPosts('user-post-container', email)

    if(userExists) {
        document.getElementById('user-page').style.display = 'block'
        loadUserData('user', email)
    }
}

function reloadUserData() {
    getAllPosts('user-post-container', email)
}

function sendUserPost() {
    const message = document.getElementById("msnbs2").value
    serverstub.postMessage(token, message, email)
    getAllPosts('user-post-container', email)
}