import requests from './requests.js';

var token = localStorage.getItem('TOKEN')
var fucking = ''
var isLoggedIn = token === null || !token || token === `unde${fucking}fined` ? false : true

/*

1. Ta token från localStorage
2. Validera tokenet

*/

// TODO: FIXA catcha:rna

const displayView = function () {    
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

async function handleLogin(event)  {
    event.preventDefault()
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
   
    try {
        const result = await requests.post('/sign_in', {email, password}) 
        token = result.token
        console.log(token)
        isLoggedIn = true
        localStorage.setItem('TOKEN', token)
        displayView()
        console.log('result ', result)
    } catch(e) {
        console.log('Ehrohr', e)
        displayFeedback(e, 'feedback-login-box', true)  
    }   
}

async function signOut() {
    await requests.get('/sign_out', false)
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

    const results = requests.post.signUp('/sign_up', {
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

async function handleResetPassword(event) {
    event.preventDefault()
    
    const oldPassword = document.getElementById("old-password").value 
    const pw1 = document.getElementById("reset-password1").value
    const pw2 = document.getElementById("reset-password2").value

    if(pw1 !== pw2) {
        displayFeedback('Passwords needs to match', 'feedback-password-box', true)
        return
    }
    const newPassword = pw1
    console.log({oldPassword, newPassword})
    try {
        const results =await requests.post('/change_password', {newPassword, oldPassword})
    } catch(e) {
        console.log('Fail', e)
    }
    displayFeedback(results, 'feedback-password-box', !results.success)
}

// ----------------HomeView---------------------

// TODO: Skriv skit i catcharna
async function loadUserData(prefix, email) {
    let result
    if(email) {
        try {
            result = await requests.post('get_user_data_by_email', {email})
        } catch(e) {
            console.log('Fail', e)
        }
    } else {
        try {
            result = await requests.get('get_user_data_by_token')
        } catch(e) {
            console.log('Fail', e)
        }
    }
    document.getElementById(prefix+'-first-name').innerText = result.firstname ? result.firstname : ''
    document.getElementById(prefix+'-family-name').innerText = result.familyname ? result.familyname : ''
    document.getElementById(prefix+'-gender').innerText = result.gender ? result.gender : ''
    document.getElementById(prefix+'-city').innerText = result.city ? result.city : ''
    document.getElementById(prefix+'-country').innerText = result.country ? result.country : ''
    document.getElementById(prefix+'-email').innerText = result.email ? result.email : ''
} 



function sendPost() {
    const message = document.getElementById("msnbs").value
    const email = serverstub.getUserDataByToken(token).data.email
    serverstub.postMessage(token, message, email)
    getAllPosts('post-container')
}

async function getAllPosts(id, email) {
    let result

    // Get other user
    if(email) {
        try{
            result = await requests.post('/get_user_messages_by_email', {email})
        } catch(e) {
            console.log('Fail', e)
        }

        if(!result.success) {
            displayFeedback(result.message, 'feedback-user-box')
            return false
        } else {
            hideFeedback('feedback-user-box')
        }
    } else { // Get own posts
        try {
        result = await requests.get('get_user_messages_by_token')
        } catch(e) {
            console.log('Fail', e)
        }
    }

    const postContainer = document.getElementById(id)
    postContainer.style.display = 'block'
    postContainer.innerHTML = ''

    result.forEach(msg => {
        postContainer.innerHTML += `<div class="post">
            ${msg.message}
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



// -------------- DONT LOOK BELOW THIS LINE ------------------











































window.handleLogin = handleLogin
window.signOut = signOut
window.handleNav = handleNav


window.handleResetPassword = handleResetPassword
// window.reloadUserData = reloadUserData
// window.sendPost = sendPost
// window.getAllPosts = getAllPosts
// window.sendUserPost = sendUserPost
// window.handleSignUp = handleSignUp
// window.browseUser = browseUser