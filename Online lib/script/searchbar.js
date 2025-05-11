let mainWindow = document.getElementById("main-content");
let books = JSON.parse(localStorage.getItem("books")) || {};

document.getElementById('search-button').addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-books').value.trim();

    if (!searchInput) {
        alert("Please enter a search term!");
        return;
    }

    // Clear current display
    mainWindow.innerHTML = '';
    let foundMatches = false;

    // 2. If no language found, search by title (case-insensitive)
    const searchTerm = searchInput.toLowerCase();

    for (const bookId in books) {
        if (bookId.title.toLowerCase().includes(searchTerm)) {
            if (!foundMatches) {
                // Clear results only when first match is found
                mainWindow.innerHTML = '';
                foundMatches = true;
            }
            displaySingleBook(bookId, books[bookId]);
        }
    }
    if (foundMatches === false) {
        let empty = document.createElement("div");
        empty.className = "center_empty";
        let c = document.createElement("p");
        c.textContent = "No Matches found!";
        empty.append(c);
        mainWindow.append(empty);
    }
});

// Helper function to display a single book
function displaySingleBook(id, book) {
    let element = document.createElement("div");
    element.className = "element";

    let img = document.createElement("img");
    img.src = `data:image/jpeg;base64,${book.cover}`;
    img.className = "book_cover";
    img.alt = `${book.title} cover`;

    let centerImg = document.createElement("div");
    centerImg.className = "center_img";
    centerImg.append(img);


    let textArea = document.createElement("div");
    textArea.className = "text_area";

    let header = document.createElement("h2");
    header.textContent = book.title;

    let summary = document.createElement("p");
    summary.textContent = book.summary || '';

    textArea.append(header, summary);
    element.append(centerImg, textArea);

    let center = document.createElement("div");
    center.className = "center_element";
    center.append(element);

    center.dataset.id = id;

    // Maintain selection functionality
    center.addEventListener('click', function () {
        document.querySelectorAll('.center_element').forEach(el => {
            el.style.backgroundColor = '';
        });
        this.style = "background: var(--bg-color); border-radius:5px;";
    });
    mainWindow.append(center);
    mainWindow.className = "main_window_";
}