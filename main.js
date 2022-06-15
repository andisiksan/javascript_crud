const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'book_APPS';


function generateId() {
    return +new Date();
}

function generatebookObject(id, title, author, years, isCompleted) {
    return {
        id,
        title,
        author,
        years,
        isCompleted
    }
}


function findbook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findbookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makebook(bookObject) {
    const texttitle = document.createElement('h3');
    texttitle.innerText = bookObject.title;

    const textauthor = document.createElement('p');
    textauthor.innerText = 'Penulis : ' + bookObject.author;

    const textyears = document.createElement('p');
    textyears.innerText = 'Tahun : ' + bookObject.years;

    const button_green = document.createElement('button');
    button_green.classList.add('green');
    if (bookObject.isCompleted) {
        button_green.innerHTML = 'Belum Selesai dibaca';
        button_green.addEventListener('click', function () {
            undoTaskFromCompleted(bookObject.id);
        })
    } else {
        button_green.innerHTML = 'Selesai dibaca';
        button_green.addEventListener('click', function () {
            addTaskToCompleted(bookObject.id);
        })
    }

    const button_red = document.createElement('button');
    button_red.classList.add('red');
    button_red.innerHTML = 'Hapus buku';
    button_red.addEventListener('click', function () {
        tanya = confirm('Apakah anda yakin ingin menghapus data?');
        if (tanya == true) {
            return removeTaskFromCompleted(bookObject.id);
        }
        else return false;
    })

    const action = document.createElement('div');
    action.classList.add('action');
    action.append(button_green, button_red);

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(texttitle, textauthor, textyears, action);
    article.setAttribute('id', `book-${bookObject.id}`);

    return article;
}

function addbook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const years = document.getElementById('inputBookYear').value;
    const chexbox = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generatebookObject(generatedID, title, author, years, chexbox);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(bookId) {
    const bookTarget = findbook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findbookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function undoTaskFromCompleted(bookId) {
    const bookTarget = findbook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addbook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});
document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});


document.addEventListener(RENDER_EVENT, function () {
    const incomplete = document.getElementById('incompleteBookshelfList');
    incomplete.innerHTML = '';
    const complete = document.getElementById('completeBookshelfList');
    complete.innerHTML = '';


    for (const bookItem of books) {
        const bookElement = makebook(bookItem);
        if (!bookItem.isCompleted)
            incomplete.append(bookElement);
        else
            complete.append(bookElement);
    }
});

const searchbook = document.getElementById('searchBook');
const searchBookTitle = document.getElementById("searchBookTitle");
searchbook.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.id == "searchSubmit") {
        const keyword = searchBookTitle.value.toLowerCase();
        search(keyword);
    }
})

function search(keyword) {
    const incomplete = document.getElementById('incompleteBookshelfList');
    incomplete.innerHTML = '';
    const complete = document.getElementById('completeBookshelfList');
    complete.innerHTML = '';

    for (const index in books) {
        if (books[index].title.toLowerCase().includes(keyword)) {
            makebook(books[index]);
            const bookElement = makebook(books[index]);
            if (!books[index].isCompleted)
                incomplete.append(bookElement);
            else
                complete.append(bookElement);
        }
    }
}

