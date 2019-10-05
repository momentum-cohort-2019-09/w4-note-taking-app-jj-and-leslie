/*globals fetch, FormData, btoa, sessionStorage */

const uuidv4 = require('uuid/v4')
const baseApiUrl = 'https://notes-api.glitch.me/api'


let credentials = {
    username: sessionStorage.username,
    password: sessionStorage.password
}

function basicAuthCreds(username, password) {
    return 'Basic ' + btoa(`${username}:${password}`)
}

function main(){
    renderPage()

    const loginForm = document.querySelector('#login-form')
    loginForm.addEventListener('submit', function(evt){
        evt.preventDefault()
        const formData = new FormData(loginForm)
        const username = formData.get('uname')
        const password = formData.get('psw')  
        fetch(`${baseApiUrl}/notes`, {
            headers: {
                'Authorization': basicAuthCreds(username, password)
            }
        })
        .then(response=> {
            if (response.ok){
                credentials.username = username
                credentials.password = password
                sessionStorage.setItem('username', username)
                sessionStorage.setItem('password', password)
                renderPage()
            } else {
                document.getElementById('login-error').innerText = 'something went wrong'
            }
        })
    })
}


function renderNotes () {
    fetch(`${baseApiUrl}/notes`, {
        headers: {
            'Authorization': basicAuthCreds(credentials.username, credentials.password)
        }
    })
    .then(response=> {
        if (response.ok){
            return response.json()
        } else {
            document.getElementById('login-error').innerText = 'something went wrong'
        }
    })
    .then(data =>{
        console.log(data)
        document.getElementById('notes').innerHTML = data.notes.map(renderNote).join('\n')
        console.log(data.notes.map(renderNote).join('\n'))
    })
}

function renderNote(note){
    return `<div class="note">
        <p>${note.title}</p>
        <p>${note.text}</p>
        <p>${note.tags}</p>
        <p>${note.updated}</p>
        </div>
    ` 
}


function showLoginForm(){
    document.getElementById('login-form').classList.remove('hidden')
    document.getElementById('notes').classList.add('hidden')
}

function hideLoginForm () {
    document.getElementById('login-form').classList.add('hidden')
    document.getElementById('notes').classList.remove('hidden')
}


function renderPage(){
    if(!credentials.username || !credentials.password){
        showLoginForm()

    } else {
        hideLoginForm()
        renderNotes()
    }
}
main()
