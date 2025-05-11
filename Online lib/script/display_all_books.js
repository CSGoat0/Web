import { showToast } from './notification.js';

// Load books from localStorage
const books = JSON.parse(localStorage.getItem("books")) || {};

// Render all books initially
function loadBooks() {
    const secondaryWindow = document.getElementById("secondary_window");
    if (!secondaryWindow) return;
    
    secondaryWindow.innerHTML = "";

    // Check if there are any books
    if (Object.keys(books).length === 0) {
        displayNoBooks(secondaryWindow);
        return;
    }

    for (const id in books) {
        const book = books[id];
        createBookCard(id, book);
    }
}

function displayNoBooks(container) {
    const noBooks = document.createElement("div");
    noBooks.className = "no-results";
    noBooks.innerHTML = `
        <i class="fas fa-book-open"></i>
        <p>No books available. Check back later!</p>
    `;
    container.appendChild(noBooks);
}

function createBookCard(id, book) {
    const element = document.createElement("div");
    element.className = "element";
    element.dataset.id = id;

    // Create image container
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";
    
    // Create image element
    const imgElement = document.createElement("img");
    imgElement.className = "book_cover";
    imgElement.src = book.cover ? `data:image/jpeg;base64,${book.cover}` : "images/default-book-cover.jpg";
    imgElement.alt = `${book.title} cover`;
    imgElement.onerror = function() {
        this.src = "images/default-book-cover.jpg";
        this.onerror = null;
    };
    
    // Add image to container
    imageContainer.appendChild(imgElement);
    
    // Create text area
    const textArea = document.createElement("div");
    textArea.className = "text_area";
    
    // Create title
    const title = document.createElement("h2");
    title.textContent = book.title;
    
    // Create author
    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = book.author || "Unknown author";
    
    // Create summary
    const summary = document.createElement("p");
    summary.className = "book-summary";
    summary.textContent = book.summary || "No summary available.";
    
    // Append elements to text area
    textArea.appendChild(title);
    textArea.appendChild(author);
    textArea.appendChild(summary);
    
    // Append image container and text area to card
    element.appendChild(imageContainer);
    element.appendChild(textArea);

    // Add click event to view book details
    element.addEventListener("click", () => {
        window.location.href = `book-details.html?id=${id}`;
    });

    document.getElementById("secondary_window").appendChild(element);
}

// Load books when the DOM is ready
document.addEventListener('DOMContentLoaded', loadBooks);
