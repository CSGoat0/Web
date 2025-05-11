import { showToast } from './notification.js';

let selectedBook = null;

// Load books from localStorage
const books = JSON.parse(localStorage.getItem("books")) || {};

// Render all books initially
function loadBooks() {
    const secondaryWindow = document.getElementById("secondary_window");
    secondaryWindow.innerHTML = "";

    for (const id in books) {
        const book = books[id];
        createBookCard(id, book);
    }
}
loadBooks();

function createBookCard(id, book) {
    const element = document.createElement("div");
    element.className = "element";
    element.dataset.id = id;

    element.innerHTML = `
        <img class="book_cover" src="data:image/jpeg;base64,${book.cover}" alt="${book.title} cover">
        <div class="text_area">
            <h2>${book.title}</h2>
            <p>${book.summary || "No summary available."}</p>
        </div>
    `;

    // Handle selection
    element.addEventListener("click", () => {
        // Deselect others
        document.querySelectorAll(".element").forEach(el => el.style = "");
        selectedBook = {
            element: element,
            id: id
        };
        element.style.boxShadow = "0 0 15px rgba(0, 0, 255, 0.3)";
        enableActions();
    });

    document.getElementById("secondary_window").appendChild(element);
}

// Handle "Edit" button
document.getElementById("edit").addEventListener("click", () => {
    // Save to session and redirect
    sessionStorage.setItem("bookToEdit", JSON.stringify(Number(selectedBook.id)));
    window.location.href = "edit_book.html";
});

// Handle "Delete" button
document.getElementById("delete").addEventListener("click", () => {
    if (!confirm(`Delete "${books[selectedBook.id].title}"?`)) return;

    // Delete from storage and re-render
    delete books[selectedBook.id];
    localStorage.setItem("books", JSON.stringify(books));

    // Remove from user's borrowed books
    const users = JSON.parse(localStorage.getItem("users")) || {};
    for (const userEmail in users) {
        if (users[userEmail].borrowedBooks) {
            users[userEmail].borrowedBooks = users[userEmail].borrowedBooks.filter(bookId => bookId != selectedBook.id);
        }
    }
    localStorage.setItem("users", JSON.stringify(users));


    // Remove from UI
    selectedBook.element.remove();
    selectedBook = null;
    disableActions();

    showToast("Book deleted",'success');
});

// Enable/disable Actions buttons
function enableActions() {
    document.getElementById("edit").disabled = false;
    document.getElementById("delete").disabled = false;
}

function disableActions() {
    document.getElementById("edit").disabled = true;
    document.getElementById("delete").disabled = true;
}

// Search books (added to the search form)
document.querySelector(".main_form").addEventListener("submit", (e) => {
    e.preventDefault();
    const term = document.getElementById("bar").value.toLowerCase().trim();

    if (!term) {
        loadBooks(); // Reset if empty
        return;
    }

    // TODO: 
    const filteredBooks = {};
    for (const id in books) {
        const book = books[id];
        if (book.title.toLowerCase().includes(term)) {
            filteredBooks[id] = book;
        }
    }

    // Clear and redraw with filtered results
    document.getElementById("secondary_window").innerHTML = ""
    for (const id in filteredBooks) {
        createBookCard(id, filteredBooks[id]);
    }
});
