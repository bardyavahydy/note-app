const $ = document
const addBoxBtnElm = $.querySelector(".icon")
const popupBoxElm = $.querySelector('.popup-box')
const popupTitleElm = popupBoxElm.querySelector('.popup-box header p')
const closePoppup = popupBoxElm.querySelector('.uil-times')
const inputTitleElm = popupBoxElm.querySelector("#input-title")
const textareaElm = popupBoxElm.querySelector("#textarea")
const popupBtnElm = popupBoxElm.querySelector('.popup-box button')
const wrapperElm = $.querySelector('.wrapper')

let notes = []
let oldNote = null

// FUNCTIONS

const clearInputs = () =>{
    inputTitleElm.value = ''
    textareaElm.value = ''
}

const popupBoxHandler = (popupTitle, popupAddBtn) =>{
    popupTitleElm.innerText = popupTitle
    popupBtnElm.innerText = popupAddBtn
    inputTitleElm.focus()
    popupBoxElm.classList.add('show')
}

const getNote = () =>{
    let currDate = new Date()
    let noteInfos = {
        id: Math.floor(Math.random() * 300),
        title: inputTitleElm.value,
        desc: textareaElm.value,
        date: currDate.toLocaleDateString('fa-IR')
    }
    notes.push(noteInfos)
    storingNotesInLocalStorage(notes)
    clearInputs()
    addingNotesToDom(notes)
    popupBoxElm.classList.remove('show')
}

const addingNotesToDom = (notes) =>{
    wrapperElm.innerHTML = `
        <li class="add-box" onclick="popupBoxHandler('Add a new note', 'Add note')">
            <div class="icon"><i class="uil uil-plus"></i></div>
            <p>Add New Note</p>
        </li>
    `

    notes.forEach(note =>{
        wrapperElm.innerHTML += `
            <li class="note">
                <div class="details">
                    <p>${note.title}</p>
                    <span>${note.desc}</span>
                </div>
                <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings setting${note.id}">
                        <i class="uil uil-ellipsis-h" onclick="settingsHandler(${note.id})"></i>
                        <ul class="menu">
                            <li onclick="editNoteHandler(${note.id})">
                                <i class="uil uil-pen"></i>Edit
                            </li>
                            <li onclick="deleteNoteHandler(${note.id})">
                                <i class="uil uil-trash"></i>Delete
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        `
    })
}

const settingsHandler = (id) =>{
    if($.querySelector(`.settings.show`)){
        let oldSettingElm = $.querySelector(`.settings.show`)
        oldSettingElm.classList.remove('show')
    }
    let newSettingsElm = $.querySelector(`.setting${id}`)
    newSettingsElm.classList.add('show')
}

const deleteNoteHandler = (id) =>{
    let confirmed = confirm('Are you sure you want to delete this note')
    if(confirmed){
        let noteIndex = notes.findIndex(note => note.id == id)
        notes.splice(noteIndex, 1)
        addingNotesToDom(notes)
        storingNotesInLocalStorage(notes)
    }  
}

const editNoteHandler = (id) =>{
    popupBoxHandler('Update your note', 'Update note')
    oldNote = notes.find(note => note.id == id)
    inputTitleElm.value = oldNote.title
    textareaElm.value = oldNote.desc
}

const updateNote = () =>{
    oldNote.title = inputTitleElm.value
    oldNote.desc = textareaElm.value
    storingNotesInLocalStorage(notes)
    clearInputs()
    addingNotesToDom(notes)
    popupBoxElm.classList.remove('show')
}

const storingNotesInLocalStorage = () => localStorage.setItem('notes', JSON.stringify(notes))

const getOldNotes = () =>{
    let oldNotes = JSON.parse(localStorage.getItem('notes'))
    notes = oldNotes ?? []
}

// EVENTS

addBoxBtnElm.addEventListener('click', popupBoxHandler)

popupBtnElm.addEventListener('click', (e) =>{
    e.preventDefault()
    if(popupBtnElm.innerText === 'Update note') updateNote()
    else getNote()
})

closePoppup.addEventListener('click', () => popupBoxElm.classList.remove('show'))

$.addEventListener('click', (event) =>{
    if($.querySelector('.settings.show') && event.target.tagName !== 'I'){
        $.querySelector('.settings.show').classList.remove('show')
    }
})

window.addEventListener('load', () =>{
    getOldNotes()
    addingNotesToDom(notes)
})