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
/**
 * @param {Event} event 
 */
function handeResetPassword(event) {
    event.preventDefault()
    
    const oldPassword = document.getElementById("old-password").value 
    const pw1 = document.getElementById("reset-password1").value
    const pw2 = document.getElementById("reset-password2").value

    if(pw1 !== pw2) {
        displayFeedback('Passwords needs to match', 'error-password-box')
        return
    }

    console.log(oldPassword)
    console.log(pw1, pw2)

    const results = serverstub.changePassword(token, oldPassword, pw1)
    console.log(results);
    
    if(!results.success) {
        displayFeedback(results.message, 'error-password-box')
    }

}
