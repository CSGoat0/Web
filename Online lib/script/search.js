/**
 * Advanced Search Modal Functionality
 * - Searches books from localStorage
 * - Filters by title, author, and category
 * - Displays all books if no filters are selected
 */

// Book data structure and display functions
let books = {};
let filteredBooks = [];

// DOM Elements
let searchModal;
let searchModalBackdrop;
let titleFilter;
let authorFilter;
let categoryFilter;
let activeTags;
let resultsContainer;
let noResultsMessage;

// Initialize the search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    searchModalBackdrop = document.getElementById('searchModalBackdrop');
    searchModal = searchModalBackdrop?.querySelector('.search-modal');
    titleFilter = document.getElementById('title-filter');
    authorFilter = document.getElementById('author-filter');
    categoryFilter = document.getElementById('category-filter');
    activeTags = document.getElementById('activeTags');
    resultsContainer = document.getElementById('searchResults');
    noResultsMessage = document.getElementById('noResultsMessage');
    
    // Exit if required elements don't exist
    if (!searchModalBackdrop || !searchModal) {
        console.warn('Search modal elements not found');
        return;
    }
    
    // Get books from localStorage
    loadBooks();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize category filter options
    populateCategoryOptions();
});

// Load books from localStorage
function loadBooks() {
    try {
        books = JSON.parse(localStorage.getItem('books')) || {};
        console.log('Books loaded:', Object.keys(books).length);
    } catch (error) {
        console.error('Error loading books:', error);
        books = {};
    }
}

// Set up event listeners for the search modal
function setupEventListeners() {
    // Open search modal button
    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', openSearchModal);
    }
    
    // Close search modal button
    const closeSearchModal = document.getElementById('closeSearchModal');
    if (closeSearchModal) {
        closeSearchModal.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    searchModalBackdrop.addEventListener('click', function(e) {
        if (e.target === searchModalBackdrop) {
            closeModal();
        }
    });
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Live search as user types (with debounce)
    let debounceTimeout;
    [titleFilter, authorFilter, categoryFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('input', function() {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    updateActiveTags();
                }, 300);
            });
            
            // For select elements
            if (filter.tagName === 'SELECT') {
                filter.addEventListener('change', updateActiveTags);
            }
        }
    });
}

// Populate category options based on available books
function populateCategoryOptions() {
    if (!categoryFilter) return;
    
    // Clear existing options except the first one (All Categories)
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Get unique categories from books
    const categories = new Set();
    Object.values(books).forEach(book => {
        if (book.genre) {
            categories.add(book.genre.trim().toLowerCase());
        }
    });
    
    // Add options for each category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize
        categoryFilter.appendChild(option);
    });
}

// Open the search modal
function openSearchModal() {
    // Reload books in case they've changed
    loadBooks();
    
    // Show the modal
    searchModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Reset filters and results
    resetFilters();
    
    // Focus on the title filter
    if (titleFilter) {
        setTimeout(() => titleFilter.focus(), 100);
    }
}

// Close the search modal
function closeModal() {
    searchModalBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Update active filter tags
function updateActiveTags() {
    if (!activeTags) return;
    
    // Clear existing tags
    activeTags.innerHTML = '';
    
    // Add tags for active filters
    const filters = [
        { element: titleFilter, label: 'Title' },
        { element: authorFilter, label: 'Author' },
        { element: categoryFilter, label: 'Category' }
    ];
    
    filters.forEach(filter => {
        if (filter.element && filter.element.value) {
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            
            // For select elements, use the selected option text
            let displayValue = filter.element.value;
            if (filter.element.tagName === 'SELECT') {
                displayValue = filter.element.options[filter.element.selectedIndex].text;
            }
            
            tag.innerHTML = `
                ${filter.label}: ${displayValue}
                <button class="filter-tag-remove" data-filter="${filter.label.toLowerCase()}" aria-label="Remove ${filter.label} filter">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add click handler to remove tag
            const removeBtn = tag.querySelector('.filter-tag-remove');
            removeBtn.addEventListener('click', function() {
                filter.element.value = '';
                updateActiveTags();
                applyFilters();
            });
            
            activeTags.appendChild(tag);
        }
    });
}

// Apply filters to search books
function applyFilters() {
    const title = titleFilter?.value.toLowerCase().trim() || '';
    const author = authorFilter?.value.toLowerCase().trim() || '';
    const category = categoryFilter?.value.toLowerCase().trim() || '';
    
    // If no filters are applied, show all books
    if (!title && !author && !category) {
        filteredBooks = Object.entries(books).map(([id, book]) => ({
            id,
            ...book
        }));
    } else {
        // Filter books based on criteria
        filteredBooks = Object.entries(books)
            .filter(([id, book]) => {
                const matchesTitle = !title || (book.title && book.title.toLowerCase().includes(title));
                const matchesAuthor = !author || (book.author && book.author.toLowerCase().includes(author));
                const matchesCategory = !category || (book.genre && book.genre.toLowerCase() === category);
                
                return matchesTitle && matchesAuthor && matchesCategory;
            })
            .map(([id, book]) => ({
                id,
                ...book
            }));
    }
    
    // Display results
    displayResults();
}

// Reset all filters
function resetFilters() {
    if (titleFilter) titleFilter.value = '';
    if (authorFilter) authorFilter.value = '';
    if (categoryFilter) categoryFilter.value = '';
    
    // Clear active tags
    if (activeTags) activeTags.innerHTML = '';
    
    // Show all books
    filteredBooks = Object.entries(books).map(([id, book]) => ({
        id,
        ...book
    }));
    
    // Display results
    displayResults();
}

// Display search results
function displayResults() {
    if (!resultsContainer) return;
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Show/hide no results message
    if (noResultsMessage) {
        noResultsMessage.style.display = filteredBooks.length === 0 ? 'block' : 'none';
    }
    
    // If no books found, return
    if (filteredBooks.length === 0) return;
    
    // Create results grid
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'books-grid';
    
    // Add each book to the grid
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        resultsGrid.appendChild(bookCard);
    });
    
    // Add grid to results container
    resultsContainer.appendChild(resultsGrid);
}

// Create a book card element
function createBookCard(book) {
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.dataset.id = book.id;
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'book-item-image-container';
    
    // Create image
    const image = document.createElement('img');
    image.className = 'book-item-image';
    image.src = book.cover ? `data:image/jpeg;base64,${book.cover}` : 'assets/placeholder-book.jpg';
    image.alt = book.title || 'Book cover';
    imageContainer.appendChild(image);
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'book-item-content';
    
    // Add title
    const title = document.createElement('h3');
    title.className = 'book-item-title';
    title.textContent = book.title || 'Unknown Title';
    content.appendChild(title);
    
    // Add author
    if (book.author) {
        const author = document.createElement('p');
        author.className = 'book-item-author';
        author.textContent = book.author;
        content.appendChild(author);
    }
    
    // Add category badge
    if (book.genre) {
        const category = document.createElement('span');
        category.className = 'book-category';
        category.textContent = book.genre;
        imageContainer.appendChild(category);
    }
    
    // Add action button
    const actionBtn = document.createElement('button');
    actionBtn.className = 'action-btn';
    actionBtn.textContent = 'View Details';
    actionBtn.addEventListener('click', () => {
        // Navigate to book details page or show details modal
        window.location.href = `book-details.html?id=${book.id}`;
    });
    content.appendChild(actionBtn);
    
    // Assemble the card
    bookItem.appendChild(imageContainer);
    bookItem.appendChild(content);
    
    return bookItem;
}

// Export functions for use in other scripts
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeModal;
