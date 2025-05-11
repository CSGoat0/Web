import { showToast } from './notification.js';

export function askUserBeforLeave(event) {
    // Custom message for modern browsers
    const message = "Are you sure you want to leave this page?";
    event.returnValue = message; // Standard for most browsers
    return message; // For some older browsers
}

export function ifHas(all, part) {
    return Object.prototype.hasOwnProperty.call(all, part); // ? all[part] : null <auto complete put this>
}

export function fileToBase64(file)  {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove data:*/*;base64, prefix
            resolve(base64String);
        };
    
        reader.onerror = (error) => {
            reject(error);
        };
    
        reader.readAsDataURL(file);
    });
}

export function base64ToFile(base64) { // NOT TESTED
    var base64Parts = base64.split(",");
    var fileFormat = base64Parts[0].split(";")[1];
    var fileContent = base64Parts[1];
    var file = new File([fileContent], "file name here", {type: fileFormat});
    return file;
}

if (document.location.pathname === '/primary_user_func1_page.html') {
    // Reset file input and preview on page load
    document.getElementById('file-name').value = '';

    document.getElementById('add').addEventListener('click', async (e) => {
        // prevent refresh on submit to make the notication show
        e.preventDefault();

        // Fetch the books.json file
        let books = JSON.parse(localStorage.getItem("books")) || {};

        const id = Number(document.getElementById("id").value);
    
        if (!id) {
            showToast("Please fill out all required fields.", 'error');
            return;
        }

        // Check for duplicates
        if (books[id]) {
            showToast("That ID is already taken!", 'error');
            return;
        }

        // Must have Fields
        const title = document.getElementById("title").value.trim();
        const cover = await fileToBase64(document.getElementById("book_cover").files[0]);
        const genre = document.getElementById("genre").value.trim();
        const author = document.getElementById("author").value.trim();

        if (!title || !cover || !genre || !author) {
            showToast("Please fill out all required fields.", 'error');
            return;
        }

        // Optional Fields
        const isbn = document.getElementById("isbn").value;
        const publisher = document.getElementById("publisher").value.trim();
        const publication_date = document.getElementById("publication_date").value;
        const edition = document.getElementById("edition").value.trim();
        const summary = document.getElementById("summary").value.trim();
        const page_count = Number(document.getElementById("page_count").value);
        const available = document.getElementById("is_available").checked;

        // Add the book to the books object
        books[id] = {
            available: available,
            cover: cover,
            title: title,
            genre: genre,
            author: author,
            isbn: isbn,
            publisher: publisher,
            publication_date: publication_date,
            edition: edition,
            summary: summary,
            page_count: page_count
        };

        // Save the updated books object to localStorage
        localStorage.setItem('books', JSON.stringify(books));
        showToast("Book added successfully!", 'success');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    });

    // Function to show cover submission
    document.getElementById('book_cover').addEventListener('change', () => {
        const preview = document.getElementById('book_cover_preview');
        const fileNameField = document.getElementById('file-name');
        const fileInput = document.getElementById('book_cover');
        const file = fileInput.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.style.display = 'block';
                fileNameField.value = file.name; // Update file name field
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            fileNameField.value = ''; // Clear file name field
            fileInput.value = ''; // Clear actual file input
            showToast("Please upload a valid image file.", 'error');
        }
    });

    var today = new Date();
    document.getElementById("publication_date").setAttribute("max", today.getFullYear() + "-" + ((today.getMonth() + 1) + "").padStart(2, '0') + "-" + ("" + today.getDate()).padStart(2, '0'));

    document.getElementById("page_count").setAttribute("min", 1);
    var textarea = document.getElementById("summary");
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    });
}

if (document.location.pathname === '/edit_book.html') {
    const selectedBookId = JSON.parse(sessionStorage.getItem('bookToEdit')) || null;

    // Redirect if no book is selected (maybe user accessed this page directly)
    if (!selectedBookId) {
        window.location.href = 'index.html'; 
    }

    //  fetch the selected book's data
    const books = JSON.parse(localStorage.getItem('books'));
    const bookData = books[selectedBookId];

    // Populate the form with the selected book's data
    document.getElementById('title').value = bookData.title;
    document.getElementById('id').value = selectedBookId;
    document.getElementById('book_cover_preview').src = `data:image/jpeg;base64,${bookData.cover}`;
    document.getElementById('file-name').value = bookData.title + ".jpg";
    document.getElementById('genre').value = bookData.genre;
    document.getElementById('author').value = bookData.author;
    document.getElementById('isbn').value = bookData.isbn;
    document.getElementById('publisher').value = bookData.publisher;
    document.getElementById('publication_date').value = bookData.publication_date;
    document.getElementById('edition').value = bookData.edition;
    document.getElementById('summary').value = bookData.summary;
    document.getElementById('page_count').value = bookData.page_count;
    document.getElementById('is_available').checked = bookData.available;

    // prevent refresh 
    // TODO: When user try to refrsh the page, reset fields 
    // and when user leave delete the sessionStorage
    window.addEventListener('beforeunload', askUserBeforLeave);

    // sessionStorage.removeItem('bookToEdit'); TODO

    document.getElementById('add').addEventListener('click', async (e) => {
        // prevent refresh on submit to make the notication show
        e.preventDefault();

        // Fetch the books.json file
        let books = JSON.parse(localStorage.getItem("books"));
    
        const id = Number(document.getElementById("id").value);
    
        if (!id) {
            showToast("Please fill out all required fields.", 'error');
            return;
        }

        let cover;
        if (document.getElementById("book_cover").files[0]) {
            cover = await fileToBase64(document.getElementById("book_cover").files[0]) 
        } else {
            cover = bookData.cover;
        }

        // Must have Fields
        const title = document.getElementById("title").value.trim();
        const genre = document.getElementById("genre").value.trim();
        const author = document.getElementById("author").value.trim();

        if (!cover || !genre || !author) {
            showToast("Please fill out all required fields.", 'error');
            return;
        }

        // ARE YOU SURE YOU WANT TO EDIT THIS BOOK?
        // document.getElementById('dialog').showModal();

        // Optional Fields
        const isbn = document.getElementById("isbn").value;
        const publisher = document.getElementById("publisher").value.trim();
        const publication_date = document.getElementById("publication_date").value;
        const edition = document.getElementById("edition").value.trim();
        const summary = document.getElementById("summary").value.trim();
        const page_count = Number(document.getElementById("page_count").value);
        const available = document.getElementById("is_available").checked;

        if(selectedBookId !== id) {
            // Remove the old book entry if id has changed
            if (books[id]) {
                showToast("That ID is already taken!", 'error');
                return;
            }

            // change id in user's borrowed books
            const users = JSON.parse(localStorage.getItem("users")) || {};
            for (const userEmail in users) {
                if (users[userEmail].borrowedBooks) {
                    users[userEmail].borrowedBooks = users[userEmail].borrowedBooks.map(bookId => 
                        bookId === selectedBookId ? id : bookId
                    );
                }
            }
            localStorage.setItem("users", JSON.stringify(users));

            delete books[selectedBookId];
        }

        // Add the book to the books object
        books[id] = {
            available: available,
            cover: cover,
            title: title,
            genre: genre,
            author: author,
            isbn: isbn,
            publisher: publisher,
            publication_date: publication_date,
            edition: edition,
            summary: summary,
            page_count: page_count
        };

        // Save the updated books object to localStorage
        localStorage.setItem('books', JSON.stringify(books));
        showToast("Book edited successfully!", 'success');

        window.removeEventListener('beforeunload', askUserBeforLeave);
        sessionStorage.removeItem('bookToEdit');
        setTimeout(() => {
            window.location.href = '/primary_user_func2_page.html';
        }, 2000);
    });

    // Function to show cover submission
    document.getElementById('book_cover').addEventListener('change', () => {
        const preview = document.getElementById('book_cover_preview');
        const fileNameField = document.getElementById('file-name');
        const fileInput = document.getElementById('book_cover');
        const file = fileInput.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.style.display = 'block';
                fileNameField.value = file.name; // Update file name field
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            fileNameField.value = ''; // Clear file name field
            fileInput.value = ''; // Clear actual file input
            showToast("Please upload a valid image file.", 'error');
        }
    });

    let today = new Date();
    document.getElementById("publication_date").setAttribute("max", today.getFullYear() + "-" + ((today.getMonth() + 1) + "").padStart(2, '0') + "-" + ("" + today.getDate()).padStart(2, '0'));

    document.getElementById("page_count").setAttribute("min", 1);
    const textarea = document.getElementById("summary");
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    });
}

// Handle primary_user_func2_page.html (Manage Books page)
if (document.location.pathname.includes('primary_user_func2_page.html')) {
    const editBtn = document.getElementById('edit');
    const deleteBtn = document.getElementById('delete');
    const bookListContainer = document.getElementById('secondary_window');
    
    let selectedBook = null;
    
    // Function to display all books
    function displayBooks() {
        // Clear the container
        bookListContainer.innerHTML = '';
        
        // Get books from localStorage
        const books = JSON.parse(localStorage.getItem('books')) || {};
        
        // Check if there are any books
        if (Object.keys(books).length === 0) {
            bookListContainer.innerHTML = '<div class="no-books-message"><i class="fas fa-book-open"></i><p>No books available. Add some books to get started!</p></div>';
            return;
        }
        
        // Create and append book elements
        for (const id in books) {
            const book = books[id];
            
            // Create book element
            const bookElement = document.createElement('div');
            bookElement.className = 'element';
            bookElement.dataset.id = id;
            
            // Add click event to select book
            bookElement.addEventListener('click', function() {
                // Remove selected class from all books
                document.querySelectorAll('.element').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Add selected class to clicked book
                this.classList.add('selected');
                
                // Store selected book ID
                selectedBook = this.dataset.id;
                
                // Enable edit and delete buttons
                editBtn.disabled = false;
                deleteBtn.disabled = false;
            });
            
            // Create book content
            bookElement.innerHTML = `
                <div class="image-container">
                    <img src="data:image/jpeg;base64,${book.cover}" alt="${book.title}" class="book-cover">
                    ${!book.available ? '<div class="unavailable-badge">Borrowed</div>' : ''}
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">By ${book.author}</p>
                    <p class="book-genre">${book.genre}</p>
                    <div class="book-id">ID: ${id}</div>
                </div>
            `;
            
            // Append to container
            bookListContainer.appendChild(bookElement);
        }
    }
    
    // Handle edit button click
    editBtn.addEventListener('click', function() {
        if (selectedBook) {
            // Store the selected book ID in sessionStorage
            sessionStorage.setItem('bookToEdit', selectedBook);
            // Redirect to edit page
            window.location.href = 'edit_book.html';
        }
    });
    
    // Handle delete button click
    deleteBtn.addEventListener('click', function() {
        if (selectedBook) {
            if (confirm('Are you sure you want to delete this book?')) {
                // Get books from localStorage
                const books = JSON.parse(localStorage.getItem('books')) || {};
                
                // Delete the selected book
                delete books[selectedBook];
                
                // Save updated books to localStorage
                localStorage.setItem('books', JSON.stringify(books));
                
                // Reset selected book
                selectedBook = null;
                
                // Disable buttons
                editBtn.disabled = true;
                deleteBtn.disabled = true;
                
                // Refresh the book list
                displayBooks();
                
                // Show success message
                showToast('Book deleted successfully!', 'success');
            }
        }
    });
    
    // Display books when page loads
    displayBooks();
}