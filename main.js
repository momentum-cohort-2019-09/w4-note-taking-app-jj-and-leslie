/*globals fetch, FormData, btoa, sessionStorage */

const uuidv4 = require('uuid/v4')
const baseApiUrl = 'https://notes-api.glitch.me/api'


let credentials = {
    username: sessionStorage.getItem('username'),
    password: sessionStorage.getItem('password')
}

function basicAuthCreds (username, password) {
    return 'Basic' + btoa(`${username}:${password}`)
}

const loginForm =document.querySelector('#login-form') 
document.querySelector('#create-account').addEventListener('click', function(evt){
    evt.preventDefault()
    let userName = document.getElementById('uname').value
    let passWord = document.getElementById('psw').value
console.log(userName)
    fetch(`${baseApiUrl}/users`, {
        method: 'POST',
        body: JSON.stringify({'username': userName, 'password': passWord}),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    .then(response=> {
        if (response.ok){
            console.log(response.body)
        }
    })

})


