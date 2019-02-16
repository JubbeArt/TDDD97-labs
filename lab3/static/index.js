function displayView() {
    if(!isLoggedIn()) {
        ID('root').innerHTML = ID('welcome-view').innerHTML
        return
    }

    ID('root').innerHTML = ID('profile-view').innerHTML
    clearFeedback()
    getUserData()
    getUserPosts()
}

window.onload = () => displayView()

// ------------------- WELCOME VIEW -------------------------

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

async function handleSignUp(event) {
    event.preventDefault()
    const input = getFormInput(event)

    if(input.password !== input.password2) {
        feedback('Passwords needs to match')
        return
    }

    try {
        await requests.post('/sign_up', input, false)
        feedback('Successfully created account!', false)
    } catch(err) {
        feedback(err)
    }
}

// ---------------------- TABS -----------------------

function handleNav(id) {
    ID('home').style.display = 'none'
    ID('browse').style.display = 'none'
    ID('account').style.display = 'none'
    ID(id).style.display = 'block' 
    clearFeedback()
}

// -------------------- HOME ------------------------

async function getUserData() {
    const data = await requests.get('/get_user_data_by_token')
    ID('home-user-data').innerHTML = userDataToHTML(data)
}    
    

async function getUserPosts() {
    const posts =  await requests.get('/get_user_messages_by_token')
    ID('post-container').innerHTML = postsToHTML(posts)
}


function userDataToHTML({firstname, familyname, gender, city, country, email}) {
    return `
        <ul>
            <li>First name: ${firstname}</li> 
            <li>Family name: ${familyname}</li>
            <li>Gender: ${gender}</li>
            <li>City: ${city}</li>
            <li>Country: ${country}</li>
            <li>Email: ${email}</li>
        </ul>
    `
}

function postsToHTML(posts) {
    let html = ''

    posts.forEach(post => {
        html += `<div class="post">${post.message}</div>`
    })

    return html
}

// ----------------------- BROWSE ----------------------

async function loadUserData(email) {
        return await requests.post('/get_user_data_by_email', {email})
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
        postContainer.innerHTML += ``
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


// ----------------------- PROFILE ----------------------------

async function handleResetPassword(event) {
    event.preventDefault()
    const { oldPassword, newPassword, newPassword2 } = getFormInput(event)
    
    if(newPassword !== newPassword2) {
        feedback('Passwords needs to match')
        return
    }

    try {
        await requests.post('/change_password', {newPassword, oldPassword}, false)
        feedback('Successfully changed password', false)
    } catch(err) {
        feedback(err)
    }
}

async function signOut() {
    await requests.get('/sign_out', false)
    removeToken()
    displayView()
}