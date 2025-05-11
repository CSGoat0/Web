let selectedBook = null;

// Load books from localStorage
const books = JSON.parse(localStorage.getItem("books")) || {};
const users = JSON.parse(localStorage.getItem("users")) || {};
const currentUserEmail = localStorage.getItem("currentUserEmail") || null;
const userBooks = users[currentUserEmail].borrowedBooks || [];

// Render all books initially
function loadBooks() {
    const secondaryWindow = document.getElementById("secondary_window");
    secondaryWindow.innerHTML = "";

    for (let id in userBooks) {
        id = userBooks[id];
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
        selectedBook = id;
        element.style.boxShadow = "0 0 15px rgba(0, 0, 255, 0.3)";
        enableActions();
    });

    document.getElementById("secondary_window").appendChild(element);
}

// Enable/disable Actions buttons
function enableActions() {
    document.getElementById("view").disabled = false;
}

// eslint-disable-next-line no-unused-vars
function disableActions() {
    document.getElementById("view").disabled = false;
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
    for (let id in userBooks) {
        id = userBooks[id];
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

// 3. Edit button functionality
document.getElementById('view').addEventListener('click', () => {
    if (!selectedBook) {
        alert("Please select a book first!");
        return;
    }

    const params = new URLSearchParams({
        id: encodeURIComponent(selectedBook)
    });

    // Navigate to edit page
    window.location.href = '../book-details.html?' + params;

    /** How to decode the URL parameters in the next page:
     *
     * const params = new URLSearchParams(window.location.search);
     * const title = params.get('title'); // already decoded
     */
});
