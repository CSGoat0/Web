import { showToast } from './notification.js';

// Helper function to check if user is logged in
export function isUserLoggedIn() {
    return localStorage.getItem('currentUserEmail') !== null;
}

// Function to get current user email
export function getCurrentUserEmail() {
    return localStorage.getItem('currentUserEmail');
}

// Function to get user data by email
export function getUserByEmail(email) {
    if (!email) return null;
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return users[email];
}

// Function to get current user role
export function getCurrentUserRole() {
    const email = getCurrentUserEmail();
    const user = getUserByEmail(email);
    
    if (!user) return null;
    
    // Map the role values from signup to the expected values in the system
    if (user.role === 'owner') return 'admin';
    if (user.role === 'customer') return 'user';
    
    return user.role; // Return original role as fallback
}

// Function to log out current user
export function logoutUser() {
    localStorage.removeItem('currentUserEmail');
    showToast('Successfully logged out.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) return; // Only proceed if on login page

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const users = JSON.parse(localStorage.getItem('users')) || {};

        if (!users[email]) {
            showToast('User not found. Please sign up.', 'error');
            return;
        }

        const user = users[email];

        if (user.password !== password) {
            showToast('Incorrect password.', 'error');
            return;
        }

        showToast(`Welcome back, ${user.username}!`, 'success');
        // Store logged-in user in localStorage
        localStorage.setItem('currentUserEmail', email);

        setTimeout(() => {
            // Map roles from signup to the expected page redirects
            if (user.role === 'owner') {
                window.location.href = 'primary_user_control_panel_page.html';
            } else if (user.role === 'customer') {
                window.location.href = 'secondary_user_control_panel_page.html';
            } else {
                // Fallback for any other roles
                showToast('Unknown role detected. Redirecting to home page.', 'warning');
                window.location.href = 'index.html';
            }
        }, 2000);
    });
});
