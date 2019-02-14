function post(url, data) {
    return fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('TOKEN'), 
          },
        method: 'POST', 
        body: JSON.stringify(data)  
    })
        .then( response => {
            if(response.ok) 
                return response.json()  
            throw new Error(response.statusText, response.status) 
        })
}

function get(url, expectResponse = true) {
    // console.log(localStorage.getItem('TOKEN'))
    return fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('TOKEN'), 
          },
        method: 'GET', 
    })
        .then( response => {
            if(response.ok)
                    return expectResponse ? response.json() : ''
            throw new Error(response.statusText, response.status) 
        })
}

export default {
    post, get
}