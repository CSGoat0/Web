// Book Details Page JavaScript
import { isUserLoggedIn, getCurrentUserEmail, getCurrentUserRole } from './login.js';
import { showToast } from './notification.js';

// DOM elements
const bookLoading = document.getElementById('book-loading');
const bookDetailsContent = document.getElementById('book-details-content');
const bookError = document.getElementById('book-error');

// Book details elements
const bookCover = document.getElementById('book-cover');
const bookGenre = document.getElementById('book-genre');
const bookTitle = document.getElementById('book-title');
const bookAuthor = document.getElementById('book-author');
const bookYear = document.getElementById('book-year');
const bookPages = document.getElementById('book-pages');
const availabilityBadge = document.getElementById('availability-badge');
const borrowBtn = document.getElementById('borrow-btn');
const bookDescription = document.getElementById('book-description');
const bookIsbn = document.getElementById('book-isbn');
const bookPublisher = document.getElementById('book-publisher');
const bookPubDate = document.getElementById('book-pub-date');
const bookPagesDetail = document.getElementById('book-pages-detail');
const bookGenreDetail = document.getElementById('book-genre-detail');
const relatedBooksContainer = document.getElementById('related-books-container');

// Get book ID from URL
function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get('id'));
}

// Find book by ID
function findBookById(id) {
    // Access the global books variable from search.js
    const booksData = JSON.parse(localStorage.getItem('books')) || {};
    console.log("Book data for ID", id, ":", booksData[id]); // Debug log
    return booksData[id] || null;
}

// Check if book is borrowed
function isBookBorrowed(id) {
    // First check if the book is directly marked as borrowed
    if (localStorage.getItem(`book_${id}`) === "borrowed") {
        return true;
    }
    
    // Then check if the current user has borrowed this book
    if (isUserLoggedIn()) {
        const userEmail = getCurrentUserEmail();
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[userEmail] && users[userEmail].borrowedBooks) {
            return users[userEmail].borrowedBooks.includes(Number(id));
        }
    }
    
    return false;
}

// Display book details
function displayBookDetails(book) {
    console.log("Displaying book details:", book); // Debug log
    
    // Set book cover
    if (book.cover) {
        bookCover.src = `data:image/jpeg;base64,${book.cover}`;
    } else {
        bookCover.src = 'assets/placeholder-book.jpg';
    }
    
    // Set basic info
    bookGenre.textContent = book.genre || 'Uncategorized';
    bookTitle.textContent = book.title;
    bookAuthor.textContent = `by ${book.author}`;
    
    // Extract year from publication_date if available
    let year = 'Unknown';
    if (book.publication_date) {
        const dateMatch = book.publication_date.match(/\d{4}/);
        if (dateMatch) {
            year = dateMatch[0];
        }
    }
    bookYear.textContent = year;
    
    // Make sure to use the correct property name for page count and convert to string if needed
    const pageCount = book.page_count !== undefined && book.page_count !== null ? String(book.page_count) : null;
    bookPages.textContent = pageCount ? `${pageCount} pages` : 'Unknown pages';
    
    // Check if user is logged in and is not an admin
    const userRole = isUserLoggedIn() ? getCurrentUserRole() : null;
    const canBorrow = userRole && userRole !== 'admin';
    
    if (!canBorrow) {
        // Hide or disable borrowing UI for admins or not logged in users
        availabilityBadge.textContent = 'Login to Borrow';
        availabilityBadge.className = 'badge info';
        borrowBtn.disabled = false;
        borrowBtn.textContent = 'Login to Borrow';
        
        // Change the borrow button to redirect to login page
        borrowBtn.removeEventListener('click', borrow);
        borrowBtn.addEventListener('click', () => {
            window.location.href = 'log_in_page.html';
        });
    } else {
        // Check if book is borrowed
        const bookId = getBookIdFromUrl();
        const borrowed = isBookBorrowed(bookId);
        
        // Set availability - only check if borrowed, ignore book.availability
        if (borrowed) {
            availabilityBadge.textContent = 'Borrowed';
            availabilityBadge.className = 'badge unavailable';
            borrowBtn.disabled = true;
            borrowBtn.textContent = 'Borrowed';
        } else {
            // All books are available unless borrowed
            availabilityBadge.textContent = 'Available';
            availabilityBadge.className = 'badge available';
            borrowBtn.disabled = false;
            borrowBtn.textContent = 'Borrow Book';
            
            // Make sure the borrow button has the borrow event listener
            borrowBtn.removeEventListener('click', () => {
                window.location.href = 'log_in_page.html';
            });
            borrowBtn.addEventListener('click', borrow);
        }
    }
    
    // Set description
    bookDescription.textContent = book.summary || 'No description available.';
    
    // Set details - ensure proper type conversion for all fields
    const isbnValue = book.isbn !== undefined && book.isbn !== null && book.isbn !== '' ? String(book.isbn) : null;
    const pageCountValue = book.page_count !== undefined && book.page_count !== null ? String(book.page_count) : null;
    
    bookIsbn.textContent = isbnValue || 'N/A';
    bookPublisher.textContent = book.publisher || 'N/A';
    bookPubDate.textContent = book.publication_date || 'N/A';
    bookPagesDetail.textContent = pageCountValue || 'N/A';
    bookGenreDetail.textContent = book.genre || 'N/A';
    
    // Display related books
    displayRelatedBooks(book);
}

// Display related books (books in the same genre)
function displayRelatedBooks(currentBook) {
    relatedBooksContainer.innerHTML = '';
    
    const booksData = JSON.parse(localStorage.getItem('books')) || {};
    const currentBookId = getBookIdFromUrl();
    
    // Filter books in the same genre, excluding the current book
    const relatedBooks = [];
    for (const id in booksData) {
        const book = booksData[id];
        if (book.genre === currentBook.genre && Number(id) !== currentBookId) {
            // Add the id to the book object for reference
            book.id = id;
            relatedBooks.push(book);
        }
    }
    
    // Limit to 4 related books
    const booksToShow = relatedBooks.slice(0, 4);
    
    if (booksToShow.length === 0) {
        const noRelated = document.createElement('p');
        noRelated.className = 'no-related';
        noRelated.textContent = 'No related books found.';
        relatedBooksContainer.appendChild(noRelated);
        return;
    }
    
    booksToShow.forEach(book => {
        const bookCard = createBookCard(book);
        relatedBooksContainer.appendChild(bookCard);
    });
}

// Create a book card for related books
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.dataset.id = book.id;
    
    const coverImg = document.createElement('img');
    coverImg.className = 'book-card-cover';
    coverImg.src = book.cover ? `data:image/jpeg;base64,${book.cover}` : 'assets/placeholder-book.jpg';
    coverImg.alt = book.title;
    
    const bookInfo = document.createElement('div');
    bookInfo.className = 'book-card-info';
    
    const title = document.createElement('h3');
    title.className = 'book-card-title';
    title.textContent = book.title;
    
    const author = document.createElement('p');
    author.className = 'book-card-author';
    author.textContent = book.author;
    
    bookInfo.appendChild(title);
    bookInfo.appendChild(author);
    
    bookCard.appendChild(coverImg);
    bookCard.appendChild(bookInfo);
    
    // Add click event to navigate to the book details
    bookCard.addEventListener('click', () => {
        window.location.href = `book-details.html?id=${book.id}`;
    });
    
    return bookCard;
}

// Handle tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Handle borrow button click
function setupBorrowButton() {
    if (borrowBtn) {
        // Check if user is logged in and is not an admin
        const userRole = isUserLoggedIn() ? getCurrentUserRole() : null;
        const canBorrow = userRole && userRole !== 'admin';
        
        if (!canBorrow) {
            // Hide or disable borrowing UI for admins or not logged in users
            availabilityBadge.textContent = 'Login to Borrow';
            availabilityBadge.className = 'badge info';
            borrowBtn.disabled = false;
            borrowBtn.textContent = 'Login to Borrow';
            
            // Change the borrow button to redirect to login page
            borrowBtn.removeEventListener('click', borrow);
            borrowBtn.addEventListener('click', () => {
                window.location.href = 'log_in_page.html';
            });
        } else {
            // Check if user is logged in
            if (!isUserLoggedIn()) {
                // Show login prompt if not logged in
                showLoginPrompt();
                return;
            }

            const bookId = getBookIdFromUrl();
            if (!bookId) return;

            // Check if the book is already borrowed by this user
            if (isBookBorrowed(bookId)) {
                // Book is already borrowed, update UI
                availabilityBadge.textContent = 'Borrowed';
                availabilityBadge.className = 'badge unavailable';
                borrowBtn.disabled = true;
                borrowBtn.textContent = 'Borrowed';
            } else {
                // Book is available for borrowing
                borrowBtn.addEventListener('click', borrow);
            }
        }
    }
}

function borrow() {
    const bookId = getBookIdFromUrl();
    if (!bookId) return;
    console.log('Borrowing book with ID:', bookId);

    // Update UI
    availabilityBadge.textContent = 'Borrowed';
    availabilityBadge.className = 'badge unavailable';
    borrowBtn.disabled = true;
    borrowBtn.textContent = 'Borrowed';
    
    // Add book to user's borrowed books
    const users = JSON.parse(localStorage.getItem('users')); 
    users[getCurrentUserEmail()].borrowedBooks.push(Number(bookId));
    localStorage.setItem('users', JSON.stringify(users));

    // Mark the book as borrowed in localStorage
    localStorage.setItem(`book_${bookId}`, "borrowed");

    // increment borrowed books count in localStorage
    incrementBorrowedBooksCount(bookId);

    // Show success toast notification
    showToast('Book has been borrowed successfully!', 'success');
}

function unborrow() {
    const bookId = getBookIdFromUrl();
    if (!bookId) return;

    // Update UI
    availabilityBadge.textContent = 'Available';
    availabilityBadge.className = 'badge available';
    borrowBtn.disabled = false;
    borrowBtn.textContent = 'Borrow Book';
    
    // remove book from user's borrowed books
    const users = JSON.parse(localStorage.getItem('users')); 
    const userEmail = getCurrentUserEmail();
    const bookIdNum = Number(bookId);
    const index = users[userEmail].borrowedBooks.findIndex(id => id === bookIdNum);
    if (index !== -1) {
        users[userEmail].borrowedBooks.splice(index, 1);
    }
    localStorage.setItem('users', JSON.stringify(users));

    // Remove the borrowed mark from localStorage
    localStorage.removeItem(`book_${bookId}`);

    // decrement borrowed books count in localStorage
    decrementBorrowedBooksCount(bookId);

    // Show success toast notification
    showToast('Book has been returned successfully!', 'success');
}

// Increment borrowed books count
function incrementBorrowedBooksCount(bookId) {
    // Get books data
    const books = JSON.parse(localStorage.getItem('books'));
    
    // Increment borrowed books count
    books[bookId].borrow_count += 1;

    // Save updated user data
    localStorage.setItem('books', JSON.stringify(books));
}

function decrementBorrowedBooksCount(bookId) {
    // Get books data
    const books = JSON.parse(localStorage.getItem('books'));
    
    // Decrement borrowed books count
    books[bookId].borrow_count -= 1;

    // Save updated user data
    localStorage.setItem('books', JSON.stringify(books));
}

// Show login prompt
function showLoginPrompt() {
    // Show toast notification with login requirement
    showToast('You need to be logged in to borrow books. Please log in or sign up.', 'warning');
    
    // Create login/signup buttons container
    const actionContainer = document.createElement('div');
    actionContainer.className = 'toast-actions';
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '10px';
    actionContainer.style.marginTop = '10px';
    
    // Create login button
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Log In';
    loginButton.className = 'toast-action-btn login';
    loginButton.style.padding = '5px 10px';
    loginButton.style.backgroundColor = 'var(--primary-color)';
    loginButton.style.color = 'white';
    loginButton.style.border = 'none';
    loginButton.style.borderRadius = '4px';
    loginButton.style.cursor = 'pointer';
    loginButton.addEventListener('click', () => {
        window.location.href = 'log_in_page.html';
    });
    
    // Create signup button
    const signupButton = document.createElement('button');
    signupButton.textContent = 'Sign Up';
    signupButton.className = 'toast-action-btn signup';
    signupButton.style.padding = '5px 10px';
    signupButton.style.backgroundColor = 'var(--secondary-color)';
    signupButton.style.color = 'white';
    signupButton.style.border = 'none';
    signupButton.style.borderRadius = '4px';
    signupButton.style.cursor = 'pointer';
    signupButton.addEventListener('click', () => {
        window.location.href = 'sign_up_page.html';
    });
    
    // Add buttons to container
    actionContainer.appendChild(loginButton);
    actionContainer.appendChild(signupButton);
    
    // Add action container to the last toast notification
    const toastContainer = document.getElementById('toastContainer');
    if (toastContainer && toastContainer.lastChild) {
        toastContainer.lastChild.appendChild(actionContainer);
    }
}

// Initialize the page
function initBookDetailsPage() {
    const bookId = getBookIdFromUrl();

    if (!window.location.href.includes('book-details.html')) {
        return;
    }
    
    if (!bookId) {
        // No book ID provided
        bookLoading.classList.add('hidden');
        bookError.classList.remove('hidden');
        return;
    }
    
    const book = findBookById(bookId);
    
    if (!book) {
        // Book not found
        bookLoading.classList.add('hidden');
        bookError.classList.remove('hidden');
        return;
    }
    
    // Display book details
    displayBookDetails(book);
    
    // Setup interactive elements
    setupTabs();
    setupBorrowButton();
    
    // Show content
    bookLoading.classList.add('hidden');
    bookDetailsContent.classList.remove('hidden');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initBookDetailsPage);

// Make sure the search modal functionality is available
document.addEventListener('DOMContentLoaded', () => {
    // Open search modal when the advanced search button is clicked
    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    const searchModalBackdrop = document.getElementById('searchModalBackdrop');
    const closeSearchModalBtn = document.getElementById('closeSearchModal');
    
    if (advancedSearchBtn && searchModalBackdrop && closeSearchModalBtn) {
        // Use the global functions from search.js if available
        if (typeof window.openSearchModal === 'function') {
            advancedSearchBtn.addEventListener('click', window.openSearchModal);
        } else {
            // Fallback if the global function isn't available
            advancedSearchBtn.addEventListener('click', () => {
                searchModalBackdrop.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (typeof window.closeSearchModal === 'function') {
            closeSearchModalBtn.addEventListener('click', window.closeSearchModal);
        } else {
            // Fallback if the global function isn't available
            closeSearchModalBtn.addEventListener('click', () => {
                searchModalBackdrop.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
});
