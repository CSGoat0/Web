import { showToast } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value.trim(),
            confirmPassword: document.getElementById('confirm_password').value.trim(),
            role: document.getElementById('role').value
        };

        if (!validateForm(formData)) return;

        processSignup(formData);
    });

    function validateForm({ username, email, password, confirmPassword }) {
        if (!username || !email || !password || !confirmPassword) {
            showToast('Please fill out all fields.', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return false;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'warning');
            return false;
        }

        return true;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function processSignup(formData) {
        const users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[formData.email]) {
            showToast('User already exists! Please log in.', 'warning');
        } else {
            users[formData.email] = {
                username: formData.username,
                password: formData.password,
                role: formData.role,
                birthDate: "",
                phoneNumber: "",
                borrowedBooks: []
            };

            localStorage.setItem('users', JSON.stringify(users));
            showToast('Sign up successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'log_in_page.html';
            }, 2000);
        }
    }
});
