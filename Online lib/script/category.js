let books = [];

function fillBooksArray() {
  const raw = localStorage.getItem("books") || "{}";
  console.log("Raw books data from localStorage:", raw);
  
  const booksData = JSON.parse(raw);
  console.log("Parsed books data:", booksData);
  
  books.length = 0;
  
  // Check if the structure is as expected (an object with book IDs as keys)
  if (Object.keys(booksData).length === 0) {
    console.warn("No books found in localStorage");
    return;
  }
/**
 * Category navigation functionality
 * - Smooth scrolling to category sections on click
 * - Visual indication of active category
 */

// Function to scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Smooth scroll to the section
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active state in the navigation
        updateActiveCategory(sectionId);
    }
}

// Function to update the active category in the navigation
function updateActiveCategory(activeSectionId) {
    // Remove active class from all navigation links
    const navLinks = document.querySelectorAll('.categories-nav-links .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find the button that corresponds to the active section and add active class
    navLinks.forEach(link => {
        // Check the onclick attribute to identify which section this button navigates to
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${activeSectionId}'`)) {
            link.classList.add('active');
        }
    });
}

// Add intersection observer to update active category based on scroll position
document.addEventListener('DOMContentLoaded', function() {
    const categorySections = document.querySelectorAll('.category-section');
    
    // Set up the Intersection Observer
    const observerOptions = {
        root: null, // viewport is the root
        rootMargin: '-100px 0px -80% 0px', // trigger near the top of the viewport
        threshold: 0 // trigger as soon as any part is visible
    };
    
    const categoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveCategory(entry.target.id);
            }
        });
    }, observerOptions);
    
    // Observe all category sections
    categorySections.forEach(section => {
        categoryObserver.observe(section);
    });
    
    // Initial highlight of the first category
    if (categorySections.length > 0) {
        updateActiveCategory(categorySections[0].id);
    }
});
  // Process each book entry
  for (const [bookId, bookInfo] of Object.entries(booksData)) {
    console.log(`Processing book ID: ${bookId}, Genre: ${bookInfo.genre}`);
    
    if (!bookInfo.genre) {
      console.warn(`Book ${bookId} has no genre, skipping`);
      continue;
    }
    
    books.push({
      id: bookId,
      title: bookInfo.title || "Unknown Title",
      img: `data:image/jpeg;base64,${bookInfo.cover}`,
      category: bookInfo.genre.trim().toLowerCase(),
      alt: `${bookInfo.title || "Unknown"} cover`,
      borrowed: isBorrowed(bookId)
    });
  }
  
  console.log("Final books array:", books);
}

function isBorrowed(id) {
  return localStorage.getItem(`book_${id}`) === "borrowed";
}

// This function creates or updates the grid for a specific category
function ensureCategoryGrid(category) {
  // First check if grid exists with exact ID
  let grid = document.getElementById(`${category}-grid`);
  
  if (!grid) {
    console.log(`Grid not found with ID: ${category}-grid, checking category section...`);
    
    // Try to find the section by ID and then locate the grid inside it
    const section = document.getElementById(category);
    if (section) {
      grid = section.querySelector('.books-grid');
      console.log(`Found section #${category}, grid inside:`, grid);
    }
  }
  
  if (!grid) {
    console.warn(`Could not find grid for category: ${category}`);
    
    // Create fallback section and grid if missing
    const main = document.querySelector('main');
    if (main) {
      console.log(`Creating new section for category: ${category}`);
      const newSection = document.createElement('section');
      newSection.id = category;
      newSection.className = 'category-section';
      
      const header = document.createElement('h2');
      header.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
      
      grid = document.createElement('div');
      grid.id = `${category}-grid`;
      grid.className = 'books-grid';
      
      newSection.appendChild(header);
      newSection.appendChild(grid);
      main.appendChild(newSection);
    }
  }
  
  return grid;
}

function renderCategory(category) {
  console.log(`Attempting to render category: ${category}`);
  
  // Ensure the grid exists
  const grid = ensureCategoryGrid(category);
  
  if (!grid) {
    console.error(`Cannot render category ${category}: grid element not found and could not be created`);
    return;
  }
  
  grid.innerHTML = "";
  
  const categoryBooks = books.filter(book => book.category === category);
  console.log(`Rendering ${categoryBooks.length} books for category: ${category}`);
  
  if (categoryBooks.length === 0) {
    grid.innerHTML = '<p class="no-books">No books available in this category</p>';
    return;
  }

  categoryBooks.forEach(book => {
    const item = document.createElement("div");
    item.className = "book-item";
    item.innerHTML = `
      <img src="${book.img}" alt="${book.alt}">
      <p>${book.title}</p>
    `;

    grid.appendChild(item);
  });
}

// Ensure DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing books display");
  
  // Wait a small moment to ensure all elements are properly initialized
  setTimeout(() => {
    fillBooksArray();
    
    if (books.length === 0) {
      console.warn("No books loaded, check localStorage");
      // Find any category grid and display a message
      const anyGrid = document.querySelector('.books-grid');
      if (anyGrid) {
        anyGrid.innerHTML = '<p style="color:red;font-weight:bold;">No books found in localStorage. Please make sure books are loaded correctly.</p>';
      }
      return;
    }
    
    const categories = [...new Set(books.map(b => b.category))];
    console.log("Found categories:", categories);
    
    if (categories.length === 0) {
      console.warn("No categories found");
      return;
    }
    
    // First log all existing grid elements
    document.querySelectorAll('.books-grid').forEach(grid => {
      console.log(`Found grid with ID: ${grid.id}`);
    });
    
    // Then render each category
    categories.forEach(cat => renderCategory(cat));
  }, 100); // Short delay to ensure DOM is fully processed
});