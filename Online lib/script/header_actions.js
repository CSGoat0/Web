import { showToast } from './notification.js';
import { isUserLoggedIn, getCurrentUserRole, logoutUser } from './login.js';

// Make showToast available globally for other scripts
window.showToast = showToast;

// Initialize all header functionality when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeHeaderFunctionality();
});

// Main function to initialize all header functionality
function initializeHeaderFunctionality() {
    // Logo click action
    const logoLink = document.getElementById('logo-link');
    
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    // Advanced search modal setup
    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    const searchModalBackdrop = document.getElementById('searchModalBackdrop');
    const closeSearchModal = document.getElementById('closeSearchModal');
    
    if (advancedSearchBtn && searchModalBackdrop) {
        advancedSearchBtn.addEventListener('click', function() {
            searchModalBackdrop.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        closeSearchModal.addEventListener('click', function() {
            searchModalBackdrop.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside the content
        searchModalBackdrop.addEventListener('click', function(e) {
            if (e.target === searchModalBackdrop) {
                searchModalBackdrop.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update icon based on current theme
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Theme toggle click handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update theme attribute and save to localStorage
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            if (themeIcon) {
                themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }

    // Initialize hamburger menu
    initializeHamburgerMenu();
    
    // Initialize navigation
    updateNavigation();
}

// Separate function to initialize hamburger menu
function initializeHamburgerMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuDropdown = document.querySelector('.menu-dropdown');
    
    if (!hamburgerBtn || !menuDropdown) {
        console.error('Hamburger menu elements not found');
        return;
    }
    
    // Auth-related buttons
    const accountBtn = document.querySelector('.account-btn:nth-child(3)');
    const logoutBtn = document.querySelector('.account-btn:nth-child(4)');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const accountButtons = document.querySelectorAll('.account-btn');
    
    // Update visibility for all auth-related buttons
    const updateAuthVisibility = () => {
        const isLoggedIn = isUserLoggedIn();
        
        // Toggle account/logout buttons
        accountButtons.forEach(btn => {
            if (btn) btn.style.display = isLoggedIn ? 'flex' : 'none';
        });
        
        // Toggle login/signup buttons
        if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'flex';
        if (signupBtn) signupBtn.style.display = isLoggedIn ? 'none' : 'flex';
    };
    
    // Initial setting of button display
    updateAuthVisibility();
    
    // Initialize dropdown to be hidden
    menuDropdown.style.display = 'none';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    
    // Account button click handler
    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isUserLoggedIn()) {
                showToast('Please log in to access account settings.', 'error');
                return;
            }

            try {
                const role = getCurrentUserRole();
                
                if (role === 'admin') {
                    window.location.href = 'primary_user_control_panel_page.html';
                } else if (role === 'user') {
                    window.location.href = 'secondary_user_control_panel_page.html';
                } else {
                    showToast('Unknown user role detected. Please contact support.', 'warning');
                    window.location.href = 'index.html';
                }
            } catch (error) {
                showToast('Error accessing user information.', 'error');
                console.error('Error getting user role:', error);
            }
        });
    }

    // Logout button click handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
            updateAuthVisibility();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    // Click-only functionality for hamburger menu
    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = menuDropdown.style.display === 'flex';
        
        if (isOpen) {
            menuDropdown.style.display = 'none';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        } else {
            menuDropdown.style.display = 'flex';
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (menuDropdown.style.display === 'flex' && 
            !menuDropdown.contains(e.target) && 
            e.target !== hamburgerBtn) {
            menuDropdown.style.display = 'none';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Update navigation based on user role
function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    const isLoggedIn = isUserLoggedIn();
    const userRole = isLoggedIn ? getCurrentUserRole() : null;
    
    // Clear existing navigation links if empty
    if (navLinks.children.length === 0) {
        // Add default navigation links that should appear for all users
        addNavLink(navLinks, 'index.html', 'Home');
        addNavLink(navLinks, 'secondary_user_func2_page.html', 'All Books');
        
        // Add role-specific links
        if (isLoggedIn) {
            if (userRole === 'admin') {
                addNavLink(navLinks, 'primary_user_control_panel_page.html', 'Admin Panel', 'admin');
                addNavLink(navLinks, 'primary_user_func2_page.html', 'Manage Books', 'admin');
            } else if (userRole === 'user') {
                addNavLink(navLinks, 'secondary_user_control_panel_page.html', 'My Profile', 'user');
                addNavLink(navLinks, 'secondary_user_func1_page.html', 'My Borrowed Books', 'user');
            }
        } else {
            // Links for logged-out users
            addNavLink(navLinks, 'log_in_page.html', 'Login', 'logged-out');
            addNavLink(navLinks, 'sign_up_page.html', 'Sign Up', 'logged-out');
        }
    } else {
        // If links already exist, just update their visibility
        const allLinks = navLinks.querySelectorAll('a');
        
        // Show/hide links based on user role
        allLinks.forEach(link => {
            const linkRole = link.getAttribute('data-role');
            
            if (!linkRole) return; // No role restriction, show to all
            
            if (linkRole === 'logged-out' && isLoggedIn) {
                link.parentElement.style.display = 'none';
            } else if (linkRole === 'logged-in' && !isLoggedIn) {
                link.parentElement.style.display = 'none';
            } else if (linkRole === 'admin' && userRole !== 'admin') {
                link.parentElement.style.display = 'none';
            } else if (linkRole === 'user' && userRole !== 'user') {
                link.parentElement.style.display = 'none';
            } else {
                link.parentElement.style.display = 'flex';
            }
        });
    }
}

// Helper function to add navigation links
function addNavLink(container, href, text, role = null) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.className = 'nav-link';
    a.textContent = text;
    
    if (role) {
        a.setAttribute('data-role', role);
    }
    
    li.appendChild(a);
    container.appendChild(li);
}