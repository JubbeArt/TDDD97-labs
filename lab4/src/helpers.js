import React from 'react'

export function getToken () {
  const storedToken = localStorage.getItem('TOKEN')
  return storedToken || undefined
}

export function isLoggedIn () {
  return getToken() !== undefined
}

export function getFormInput (event) {
  event.preventDefault()
  const values = {}

  event.target.querySelectorAll('input').forEach(input => {
    if (input.type !== 'submit') {
      values[input.name] = input.value
    }
  })

  // for gender selecter
  event.target.querySelectorAll('select').forEach(input => {
    values[input.name] = input.value
  })

  event.target.querySelectorAll('textarea').forEach(input => {
    values[input.name] = input.value
  })

  return values
}

export function userDataToHTML ({ firstname, familyname, gender, city, country, email }) {
  if (!firstname) {
    return null
  }

  return (
    <ul>
      <li>First name: {firstname}</li>
      <li>Family name: {familyname}</li>
      <li>Gender: {gender}</li>
      <li>City: {city}</li>
      <li>Country: {country}</li>
      <li>Email: {email}</li>
    </ul>
  )
}

export function postsToHTML (posts) {
  return posts.map((post, i) => (
    <div className='post' key={i}>{post.message}</div>
  ))
}

export const requests = {
  post: function post (url, data, expectResponse = true) {
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('TOKEN')
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) { return expectResponse ? response.json() : '' }
        throw new Error(response.statusText)
      })
  },
  get: function get (url, expectResponse = true) {
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('TOKEN')
      },
      method: 'GET'
    })
      .then(response => {
        if (response.ok) { return expectResponse ? response.json() : '' }
        throw new Error(response.statusText)
      })
  }
}
