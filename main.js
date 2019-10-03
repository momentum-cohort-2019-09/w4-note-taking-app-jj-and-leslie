/*globals fetch, FormData, btoa, sessionStorage */

const uuidv4 = require('uuid/v4')
const baseApiUrl = 'https://notes-api.glitch.me/api'


// const app = {
//     data: {
//         credentials: {
//             username: sessionStorage.getItem('username'),
//             password: sessionStorage.getItem('password')
//         }
//     },

//     setCredentials: function(username, password) {
//         this.data.credentials = {
//             username: username,
//             password: password
//         }
//         sessionStorage.setItem('username', username)
//         sessionStorage.setItem('password', password)
//     },

//     createUser: function (username, password) {
//         fetch('${baseApiUrl}/users', {
//             headers: {
//                 Method: 'POST',
//                 body: JSON.stringify({'username': username, 'password': password}),
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then(response => {
//                 if (response.ok){
//                     this.setCredentials(username, password)
//                 } else {
//                     document.getElementById('login-error').innerText= 'There has been an error'
//                 }
//             })
//     }
// } 




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


