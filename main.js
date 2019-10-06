/*globals fetch, FormData, btoa, sessionStorage */

import moment from 'moment'
const baseApiUrl = 'https://notes-api.glitch.me/api'


let credentials = {
    username: sessionStorage.username,
    password: sessionStorage.password
}

function basicAuthCreds(username, password) {
    return 'Basic ' + btoa(`${username}:${password}`)
}

function main(){
    // render page so that the show/hide functionality is properly expressed.
    renderPage()
    const loginForm = document.querySelector('#login-form')
    loginForm.addEventListener('submit', function(evt){
        evt.preventDefault()
        const formData = new FormData(loginForm)
        const username = formData.get('uname')
        const password = formData.get('psw')  
        //validate that credentials are correct
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
    // TO DO: Add Event listener and functionality for delete note
    //  1. add delete button or link to  each notecard.
    // 2. add eventlistener for that link or button.
    // 3. eventlistener should get note _id and call delete api endpoint 
    // 4. if api endpoint returns response.ok add js to remove notecard from the DOM 
    const addNoteForm = document.querySelector('#add-note-form')
    addNoteForm.addEventListener('submit', function(evt){
        evt.preventDefault()
        const title = addNoteForm.querySelector('#title').value
        const text = addNoteForm.querySelector('#text').value 
        const tags = addNoteForm.querySelector('#tags').value.split(',')  

        fetch(`${baseApiUrl}/notes`, {
            method: 'POST',
            body: JSON.stringify({'title': title, 'text': text, 'tags': tags}),
            headers: {
                'Authorization': basicAuthCreds(credentials.username, credentials.password),
                'Content-Type': 'application/json'
            }
        })
        .then(response=> {
            if (response.ok){
                renderPage()
                addNoteForm.reset()
            } else {
                document.getElementById('add-note-error').innerText = 'something went wrong'
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
        document.getElementById('notes').innerHTML = data.notes.map(renderNote).join('\n')
        let editables = document.querySelectorAll('[contenteditable]');
        for(let editable of editables){
            editable.addEventListener('keydown', function(evt){
                if (evt.code === 'Enter'){
                    evt.preventDefault()
                    return evt.code = 'Tab'
                }
            })
            
            editable.addEventListener('focusout', function(event) {
                let note = event.target.closest(".note")
                let body = prepareBody(note)
                updateNote(note.id, body)
            })
        }
        
    })
}

function prepareBody(note) {
    return { 
        'title': note.querySelector('.note-title').innerHTML,
        'text': note.querySelector('.note-text').innerHTML,
        'tags': note.querySelector('.note-tags').innerHTML.split(',')
    }
}

function updateNote(id, body) {
    fetch(`${baseApiUrl}/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Authorization': basicAuthCreds(credentials.username, credentials.password),
            'Content-Type': 'application/json'
        }
    })
    .then(response=> {
        if (response.ok){
            renderPage()
        } else {
            document.getElementById('add-note-error').innerText = 'something went wrong'
        }
    })

}

const deleteFromNotes = document.querySelectorAll('notes.delete')
deleteFromNotes.addEventListener('click', function(event) {
        event.preventDefault()
        let note = event.target.closest(".note")
        fetch(`${baseApiUrl}/notes/${note.id}`, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: {
                'Authorization': basicAuthCreds(credentials.username, credentials.password)
            }
        })
        .then(response => {
            if (response.ok) {
                renderPage()
            } else {
                document.getElementById('login-error').innerText = 'something went wrong'
            }
            // let elementGone = document.getElementsByClassName('note');
            // elementGone.parentNode.removeChild('note');
        })
    })

function renderNote(note){
    let newDate = note.updated
    return `<div class="note" id=${note._id}>
        <h2 class='note-title' contenteditable="true">${note.title}</h2>
        <p class='note-text' contenteditable="true">${note.text}</p>
        <p> Tags: <span class='note-tags'contenteditable="true">${note.tags || 'None'}</span></p>
        <p>Date: ${moment(newDate).format('LLLL')}</p>
        <button class="delete">Delete
            <i class="fas fa-trash-alt"></i>
        </button>
        </div>
    ` 
}


function showLoginForm(){
    document.getElementById('login-form').classList.remove('hidden')
    document.getElementById('notes-container').classList.add('hidden')
}

function hideLoginForm () {
    document.getElementById('login-form').classList.add('hidden')
    document.getElementById('notes-container').classList.remove('hidden')
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
