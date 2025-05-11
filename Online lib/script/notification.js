// Toast Notification System
const toastContainer = document.getElementById('toastContainer');

export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    const icon = document.createElement('i');
    icon.className = getIconClass(type);
    toast.appendChild(icon);
    
    // Add message text
    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);

    toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300); // Wait for fade-out animation
    }, 4000);
}

function getIconClass(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-info-circle';
}