import React from 'react'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

function buildHeaders() {
  const authToken = localStorage.getItem('phoenixAuthToken')

  return { ...defaultHeaders, Authorization: authToken }
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function parseJSON(response) {
  return response.json()
}

export function httpGet(url) {

  return fetch(url, {
    headers: buildHeaders(),
  })
  .then(checkStatus)
  .then(parseJSON)
}

export function httpPost(url, data) {
  const body = JSON.stringify(data)

  return fetch(url, {
    method: 'post',
    headers: buildHeaders(),
    body: body,
  })
  .then(checkStatus)
  .then(parseJSON)
}

export function httpDelete(url) {

  return fetch(url, {
    method: 'delete',
    headers: buildHeaders(),
  })
  .then(checkStatus)
  .then(parseJSON)
}

export function setDocumentTitle(title) {
  document.title = `${title} | Конструктор Образов.`
}

export function renderErrorFor(errors, ref) {
  if (!errors) return false

  return errors.map((error, i) => {
    if (error[ref]) {
      return (
        <div key={i} className="error">
          {error[ref]}
        </div>
      )
    }
  })
}

export const makeAuthHeader = (token) => ( 
  // return authorization header with token
  token 
    ? ({ 'Authorization': `Bearer ${token}`})
    : ({})
)

export const isEmpty = objectInput => {
   for ( name in objectInput) {
     return false;
   }
   return true;
}

export const postData = (url = '', data = {}, access_token = null) => {
  return fetch(url, { 
    method: 'POST', 
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...makeAuthHeader(access_token)
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}