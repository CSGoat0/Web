const params = new URLSearchParams(window.location.search);

// Redirect if no book is selected (maybe user accessed this page directly)
if (!params.has('id')) {
    window.location.href = 'index.html'; 
}

const id = decodeURIComponent(params.get('id'));

//  fetch the selected book's data
const books = JSON.parse(localStorage.getItem('books'));

 // Redirect to the main page if book not found
if (!books || !books[id]) {
    window.location.href = 'index.html';
}

const bookData = books[id];

// Populate the form with the selected book's data
document.getElementById('id').value = id;
document.getElementById('title').value = bookData.title;
document.getElementById('book_cover_preview').src = `data:image/jpeg;base64,${bookData.cover}`;
document.getElementById('genre').value = bookData.genre;
document.getElementById('author').value = bookData.author;
document.getElementById('isbn').value = bookData.isbn;
document.getElementById('publisher').value = bookData.publisher;
document.getElementById('publication_date').value = bookData.publication_date;
document.getElementById('edition').value = bookData.edition;
document.getElementById('summary').value = bookData.summary;
document.getElementById('page_count').value = bookData.page_count;
