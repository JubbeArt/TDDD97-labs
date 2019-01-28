function handleNav(button) {
    homebutton = document.getElementById("homebutton")
    browsebutton = document.getElementById("browsebutton")
    accountbutton = document.getElementById("accountbutton")

    homeview = document.getElementById("homeview")
    browseview = document.getElementById("browseview")
    accountview = document.getElementById("accountview")

    if(button === homebutton) {
            homeview.style.display = 'block'
            browseview.style.display = 'none'
            accountview.style.display = 'none'

            homebutton.className = 'selected'
            browsebutton.className = ''
            accountbutton.className = ''
    } else if(button === browsebutton) {
            homeview.style.display = 'none'
            browseview.style.display = 'block'
            accountview.style.display = 'none'

            homebutton.className = ''
            browsebutton.className = 'selected'
            accountbutton.className = ''
    } else {
            homeview.style.display = 'none'
            browseview.style.display = 'none'
            accountview.style.display = 'block'

            homebutton.className = ''
            browsebutton.className = ''
            accountbutton.className = 'selected'
    }
}