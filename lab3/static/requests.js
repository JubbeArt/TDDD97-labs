const requests = {
  post: function post(url, data, expectResponse = true) {
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
                  return expectResponse ? response.json() : ''
              throw new Error(response.statusText, response.status) 
          })
  }
  , 
  get: function get(url, expectResponse = true) {
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
}
