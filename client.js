var token = localStorage.getItem('TOKEN')
var isLoggedIn = token === null || !token ? false : true

displayView = function () {
    // the code required to display a view
    
    const root = document.getElementById('root')
    let toView = !isLoggedIn ? "welcome-view" : "profile-view" 
    root.innerHTML = document.getElementById(toView).textContent
}

window.onload = function () {
    displayView()
}



function displayError(errorMessage) {
    const errorBox = document.getElementById('error-box')
    errorBox.innerHTML = errorMessage
    errorBox.style.display = 'block'   
}

function displayLoginError(errorMessage) {
    const errorBox = document.getElementById('error-login-box')
    errorBox.innerHTML = errorMessage
    errorBox.style.display = 'block'   
}

function handleLogin(event)  {
    event.preventDefault()
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
   
    const results = serverstub.signIn(email, password)
    console.log(results)    

    if(!results.success) {
        displayLoginError(results.message)        
    } else {
        token = results.data
        isLoggedIn = true
        localStorage.setItem('TOKEN', results.data)
        displayView()
    }
}

function handleSignUp(event) {
    event.preventDefault()
    const pw1 = document.getElementById("pw1").value
    const pw2 = document.getElementById("pw2").value

    if(pw1 !== pw2) {
        displayError('Passwords needs to match' )
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

    if(!results.success) {
        displayError(results.message)  
    }
}
