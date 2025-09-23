// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserAccess();
    
    // Initialize animations
    initAnimations();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize newsletter form
    initNewsletter();
});

function checkUserAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !currentUser) {
        // Redirect to login page if not logged in
        window.location.href = '../../index.html';
        return;
    }
    
    // Update user info in header
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-info span');
    
    if (userAvatar && userName) {
        userName.textContent = `Welcome, ${currentUser.name || 'Explorer'}!`;
    }
}

function initAnimations() {
    // Add scroll animations for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.site-card, .category-card, .tour-card, .stat-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

function initSearch() {
    const heroSearch = document.querySelector('.hero-search');
    if (heroSearch) {
        const searchInput = heroSearch.querySelector('input');
        const searchButton = heroSearch.querySelector('button');
        
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

function performSearch(query) {
    if (query.trim() !== '') {
        // Save search query and redirect to heritage sites page
        localStorage.setItem('searchQuery', query);
        window.location.href = 'heritage-sites.html';
    }
}

function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                // In a real application, this would send the email to a server
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../../index.html';
    }
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .site-card, .category-card, .tour-card, .stat-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .site-card.animate-in, .category-card.animate-in, .tour-card.animate-in, .stat-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .site-card:nth-child(1) { transition-delay: 0.1s; }
    .site-card:nth-child(2) { transition-delay: 0.2s; }
    .site-card:nth-child(3) { transition-delay: 0.3s; }
    .category-card:nth-child(1) { transition-delay: 0.1s; }
    .category-card:nth-child(2) { transition-delay: 0.2s; }
    .category-card:nth-child(3) { transition-delay: 0.3s; }
    .category-card:nth-child(4) { transition-delay: 0.4s; }
`;
document.head.appendChild(style);