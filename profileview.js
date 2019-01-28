function handleNav(id) {
    homeview = document.getElementById("homeview")
    browseview = document.getElementById("browseview")
    accountview = document.getElementById("accountview")

    if(id === 1) {
            homeview.style.display = 'block'
            browseview.style.display = 'none'
            accountview.style.display = 'none'
    } else if(id === 2) {
            homeview.style.display = 'none'
            browseview.style.display = 'block'
            accountview.style.display = 'none'
    } else {
            homeview.style.display = 'none'
            browseview.style.display = 'none'
            accountview.style.display = 'block'
    }
}