const addItem = document.querySelector('#liveToastBtn')
const todoList = document.querySelector('#list')
const doneList = document.querySelector('#doneList')
const todoText = document.querySelector('#task')
const btnReset = document.querySelector('#cleanList')
const btnMove = document.querySelector('#allMove')
const btnAll = document.querySelector('#allDone')

let todoArray = localStorage.getItem('todoList') ? JSON.parse(localStorage.getItem('todoList')) : []
localStorage.setItem('todoList', JSON.stringify(todoArray))
const todoItems = JSON.parse(localStorage.getItem('todoList'));


let doneArray = localStorage.getItem('doneList') ? JSON.parse(localStorage.getItem('doneList')) : []
localStorage.setItem('doneList', JSON.stringify(doneArray))
const doneItems = JSON.parse(localStorage.getItem('doneList'));

window.onload = (event)=>{
    todoText.value="";
    todoText.focus()
}


function enterKeyPressed(event) {
    if (event.keyCode == 13) {
        newElement()
    }
}

function spaceKeyPressed(event) {
    if (event.keyCode == 32 || event.keyCode == 13) {
        newElement()
    }
}


function newElement() {
    if (todoText.value === "" || todoText.value.match(/^\s+$/)) {
        $('.error').toast('show');
        todoText.focus()
        todoText.value="";
    }

    else {
        const li = document.createElement("li")
        const span = document.createElement("span")
        li.textContent = todoText.value;
        li.setAttribute('onclick', 'todoLi(this)')
        span.classList.add('close')
        span.setAttribute('onclick', 'todoSpany(this)')
        span.innerHTML = "✕"
        li.append(span)
        todoList.prepend(li)
        todoArray.unshift(todoText.value.trim())
        localStorage.setItem('todoList', JSON.stringify(todoArray))
        todoText.value = "";
        $('.success').toast('show');
        todoText.focus()
    }

}

todoItems.forEach((item) => {
    const li = document.createElement("li")
    const span = document.createElement("span")
    li.textContent = item
    li.setAttribute('onclick', 'todoLi(this)')
    span.classList.add('close')
    span.setAttribute('onclick', 'todoSpany(this)')
    span.innerText = "✕"
    li.append(span)
    todoList.append(li)
    todoText.focus()
})

const extract = (node) => {
    const text = [...node.childNodes].find(child => child.nodeType === Node.TEXT_NODE);
    return text && text.textContent.trim();
}

function todoSpany(item) {
    let itemText = extract(item.parentElement)
    todoList.removeChild(item.parentElement)
    todoArray.splice(todoArray.indexOf(itemText), 1)
    localStorage.setItem('todoList', JSON.stringify(todoArray))
}

function todoLi(item) {
    item.classList.toggle('checked')
}

function doneSpany(item) {
    let itemText = extract(item.parentElement)
    doneList.removeChild(item.parentElement)
    doneArray.splice(doneArray.indexOf(itemText), 1)
    localStorage.setItem('doneList', JSON.stringify(doneArray))
}

function doneLi(item) {
    const li = document.createElement("li")
    const span = document.createElement("span")
    let itemText = item.textContent.slice(0, -1)
    let liIndex = doneArray.indexOf(itemText)
    li.innerText = itemText
    li.setAttribute('onclick', 'todoLi(this)')
    span.classList.add('close')
    span.setAttribute('onclick', 'todoSpany(this)')
    span.innerText = "✕"
    li.append(span)
    todoList.prepend(li)
    todoArray.unshift(itemText)
    doneList.removeChild(item)
    doneArray.splice(liIndex, 1)
    localStorage.setItem('todoList', JSON.stringify(todoArray))
    localStorage.setItem('doneList', JSON.stringify(doneArray))
}

doneItems.forEach((item) => {
    const li = document.createElement("li")
    const span = document.createElement("span")

    li.textContent = item
    li.setAttribute('onclick', 'doneLi(this)')
    li.classList.toggle('checked')
    span.classList.add('close')
    span.setAttribute('onclick', 'doneSpany(this)')
    span.innerText = "✕"
    li.append(span)
    doneList.append(li)
    todoText.focus()
})


btnReset.addEventListener('click', function () {

    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild)
    }

    localStorage.removeItem('todoList')
    todoArray = []
    todoText.focus()

})

btnAll.addEventListener('click', function (e) {
    const children = todoList.children
    Array.from(children).forEach(li => {
        if (!li.classList.contains('checked')) {
            li.classList.add('checked')
        }
        else if (li.classList == 'checked' && e.target.innerText == 'Geri Al') {
            li.classList.remove('checked')
        }
    })
    if (todoList.childElementCount) {
        e.target.innerText == "Tümünü İşaretle" ? e.target.innerText = "Geri Al" : e.target.innerText = "Tümünü İşaretle"
    }
})

btnMove.addEventListener('click', function (e) {
    btnAll.innerText = "Tümünü İşaretle"
    const children = todoList.children

    Array.from(children).forEach(li => {
        if (li.classList.contains('checked')) {
            todoList.removeChild(li)
            let liText = li.textContent.slice(0, -1)
            let liIndex = todoArray.indexOf(liText)
            todoArray.splice(liIndex, 1)
            li.setAttribute('onclick', 'doneLi(this)')
            li.firstElementChild.setAttribute('onclick', 'doneSpany(this)')
            doneList.prepend(li)
            doneArray.unshift(li.textContent.slice(0, -1))
            localStorage.setItem('todoList', JSON.stringify(todoArray))
            localStorage.setItem('doneList', JSON.stringify(doneArray))
        }
    })

    if (todoList.childElementCount) {
        e.target.value == "İşaretlenenleri Taşı" ? e.target.value = "Geri Al" : e.target.value = "İşaretlenenleri Taşı"
    }
})