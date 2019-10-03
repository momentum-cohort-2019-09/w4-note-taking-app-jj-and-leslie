/*globals fetch, FormData, btoa, sessionStorage */

const uuidv4 = require('uuid/v4')
const baseApiUrl = 'https://notes-api.glitch.me/api'


let credentials = {
    username: sessionStorage.getItem('username'),
    password: sessionStorage.getItem('password')
}

function basicAuthCreds (credentials) {
    console.log(credentials)
    return 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
}

const loginForm =document.querySelector('#login-form') 
document.querySelector('#create-account').addEventListener('click', function(evt){
    evt.preventDefault()
    let userName = document.getElementById('uname').value
    let passWord = document.getElementById('psw').value
    fetch(`${baseApiUrl}/users`, {
        method: 'POST',
        body: JSON.stringify({'username': userName, 'password': passWord}),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    .then(response=> {
        if (response.ok){
            credentials.username = username
            credentials.password = password
            sessionStorage.setItem('username', username)
            sessionStorage.setItem('password', password)
        } else {
            console.log(response.body)
            document.getElementById('login-error').innerText = 'something went wrong'
        }
    })
})

function renderPage(){
    if(!credentials.username || !credentials.password){
        showLoginForm()
    } else {
        hideLoginForm()
        getNotes()
    }
}

function showLoginForm(){
    document.getElementById('login-form').classList.remove('hidden')
    document.getElementById('notes').classList.add('hidden')
}

function hideLoginForm () {
    document.getElementById('login-form').classList.add('hidden')
    document.getElementById('notes').classList.remove('hidden')
}

function renderNotes (notes) {
    document.getElementById('notes').innerHTML = notes.map(note=>
        `<div class="note">
         <p>${note.title}</p>
         <p>${note.text}</p>
         <p>${note.tags}</p>
         <p>${note.updated}</p>
        </div>`
    ).join('\n')
}


function getNotes() {
    fetch(`${baseApiUrl}/notes`, {
        method: 'GET',
        headers: {
            'Authorization': basicAuthCreds(credentials)
        }
    }) 
    .then(response=> {
        if (response.ok){
            return response.json()
        } else {
            console.log(response);
            document.getElementById('login-error').innerText = 'Invalid credentials'
        }
    })
    .then(data=> {
        renderNotes(data.notes)
    })
}

renderPage()
