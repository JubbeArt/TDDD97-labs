async function displayView() {
    if(!isLoggedIn()) {
        ID('root').innerHTML = ID('welcome-view').innerHTML
        return
    }

    ID('root').innerHTML = ID('profile-view').innerHTML
    clearFeedback()
    await getUserData()
    await getUserPosts()
}

window.onload = displayView

// ------------------- WELCOME VIEW -------------------------

async function handleLogin(event)  {
    const { email, password } = getFormInput(event)
   
    try {
        const result = await requests.post('/sign_in', {email, password}) 
        localStorage.setItem('TOKEN', result.token)
        displayView()
    } catch(err) {
        feedback(err)  
    }   
}

async function handleSignUp(event) {
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

    posts.reverse().forEach(post => {
        html += `<div class="post">${post.message}</div>`
    })

    return html
}

async function sendPost(event) {
    const { message } = getFormInput(event)
    console.log(message)
    const email = (await requests.get('get_user_data_by_token')).email
    await requests.post('/post_message', {message, email}, false)
    getUserPosts()
}

// ----------------------- BROWSE ----------------------

let lastEmail

async function browseUser(event) {
    const input = getFormInput(event)

    try {
        const data = await requests.post('/get_user_data_by_email', input)
        const posts = await requests.post('/get_user_messages_by_email', input)
        lastEmail = input.email
        
        ID('user-page').style.display = 'block'
        ID('other-user-data').innerHTML = userDataToHTML(data)
        ID('other-user-posts').innerHTML = postsToHTML(posts)
        clearFeedback()
    } catch(err) {
        feedback(err)
    }
}

function reloadUserData() {
    // lel
    ID('user-lookup').click()
}

async function postMessageToUser(event) {
    const {message} = getFormInput(event)
    await requests.post('/post_message', {message, email: lastEmail}, false)
    // fetch other users posts
    const posts = await requests.post('/get_user_messages_by_email', {email: lastEmail})
    ID('other-user-posts').innerHTML = postsToHTML(posts)
 }


// ----------------------- PROFILE ----------------------------

async function handleResetPassword(event) {
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