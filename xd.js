function loadUserData() {
    const token = localStorage.getItem("TOKEN")
    const result = serverstub.getUserDataByToken(token)
    const data = result.data

    document.getElementById('home-first-name').innerText = data.firstname
    document.getElementById('home-family-name').innerText = data.familyname
    document.getElementById('home-gender').innerText = data.gender
    document.getElementById('home-city').innerText = data.city
    document.getElementById('home-country').innerText = data.country
    document.getElementById('home-email').innerText = data.email
} 


loadUserData()