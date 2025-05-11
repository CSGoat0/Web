import { showToast } from './notification.js';

let currentUserEmail = localStorage.getItem('currentUserEmail');
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = users[currentUserEmail] || null;

document.addEventListener('DOMContentLoaded', () => { 
    if (currentUserEmail) {
        document.getElementById('full-name').value = currentUser.username || '';
        document.getElementById('email').value = currentUserEmail || '';
        document.getElementById('birth-date').value = currentUser.birthDate || '';
        document.getElementById('phone-number').value = currentUser.phoneNumber || '';
    } else {
        showToast('User not found. Please log in again.', 'error');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
    }
    
    document.getElementById('edit').addEventListener('click', () => {
        const newEmail = document.getElementById('email').value.trim();

        // Check if email changed
        if (newEmail !== currentUserEmail) {
            if (users[newEmail]) {
                showToast('Email already exists!', 'error');
                return;
            }
            users[newEmail] = { ...users[currentUserEmail] };
            delete users[currentUserEmail];
            currentUserEmail = newEmail;
        }

        // Update user details
        users[newEmail].username = document.getElementById('full-name').value;
        users[newEmail].birthDate = document.getElementById('birth-date').value;
        users[newEmail].phoneNumber = document.getElementById('phone-number').value;

        // Save changes
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUserEmail', currentUserEmail);
        showToast('Details updated successfully!', 'success');
    });
});






