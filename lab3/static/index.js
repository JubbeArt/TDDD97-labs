function displayView() {
    if(!isLoggedIn()) {
        ID('root').innerHTML = ID('welcome-view').innerHTML
        return
    }

    ID('root').innerHTML = ID('profile-view').innerHTML
    clearFeedback()
    loadUserData('home')
    getAllPosts('post-container')
}

window.onload = () => displayView()

async function handleLogin(event)  {
    event.preventDefault()   
    const { email, password } = getFormInput(event)
   
    try {
        const result = await requests.post('/sign_in', {email, password}) 
        localStorage.setItem('TOKEN', result.token)
        displayView()
    } catch(e) {
        feedback(e)  
    }   
}

async function signOut() {
    await requests.get('/sign_out', false)
    localStorage.removeItem("TOKEN")
    displayView()
}

function handleSignUp(event) {
    event.preventDefault()

    console.log(getFormInput(event))

    return
    const pw1 = document.getElementById("pw1").value
    const pw2 = document.getElementById("pw2").value

    if(pw1 !== pw2) {
        feedback('Passwords needs to match')
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

    feedback(results.message, !results.success)
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
        feedback('Passwords needs to match')
        return
    }
    const newPassword = pw1
    try {
        const results = await requests.post('/change_password', {newPassword, oldPassword})
    } catch(e) {
        console.error('Fail', e)
    }
    feedback(results, !results.success)
}

// ----------------HomeView---------------------

// TODO: Skriv skit i catcharna
async function loadUserData(prefix, email) {
    let result
    if(email) {
        try {
            result = await requests.post('/get_user_data_by_email', {email})
        } catch(e) {
            console.error('Fail', e)
        }
    } else {
        try {
            result = await requests.get('/get_user_data_by_token')
        } catch(e) {
            console.error('Fail', e)
        }
    }
    document.getElementById(prefix+'-first-name').innerText = result.firstname ? result.firstname : ''
    document.getElementById(prefix+'-family-name').innerText = result.familyname ? result.familyname : ''
    document.getElementById(prefix+'-gender').innerText = result.gender ? result.gender : ''
    document.getElementById(prefix+'-city').innerText = result.city ? result.city : ''
    document.getElementById(prefix+'-country').innerText = result.country ? result.country : ''
    document.getElementById(prefix+'-email').innerText = result.email ? result.email : ''
} 



async function sendPost() {
    const message = document.getElementById("msnbs").value
    try {
        const email = (await requests.get('get_user_data_by_token')).email
        await requests.post('/post_message', {message, email}, false)
    } catch(e) {
        console.error('Fail', e)
    }
    getAllPosts('post-container')
}

async function getAllPosts(id, email) {
    let result

    // Get other user
    if(email) {
        try{
            result = await requests.post('/get_user_messages_by_email', {email})
            clearFeedback()
        } catch(e) {
            feedback(e)
        }
    } else { // Get own posts
        try {
        result = await requests.get('/get_user_messages_by_token')
        } catch(e) {
            console.error('Fail', e)
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
    requests.post('/post_message', {message, email}, false)
    getAllPosts('user-post-container', email)
}
