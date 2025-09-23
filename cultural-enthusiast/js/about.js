// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserAccess();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize animations
    initAnimations();
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

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (validateContactForm(name, email, message)) {
                // Simulate form submission
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.reset();
                
                // In a real application, you would send the data to a server
                console.log('Contact form submitted:', { name, email, message });
            } else {
                showNotification('Please fill in all fields correctly.', 'error');
            }
        });
    }
}

function validateContactForm(name, email, message) {
    if (!name.trim() || !email.trim() || !message.trim()) {
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    return true;
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
    const elementsToAnimate = document.querySelectorAll('.stat-item, .team-member, .value-card, .partner-logo');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .stat-item, .team-member, .value-card, .partner-logo {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .stat-item.animate-in, .team-member.animate-in, 
    .value-card.animate-in, .partner-logo.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .stat-item:nth-child(1) { transition-delay: 0.1s; }
    .stat-item:nth-child(2) { transition-delay: 0.2s; }
    .stat-item:nth-child(3) { transition-delay: 0.3s; }
    .stat-item:nth-child(4) { transition-delay: 0.4s; }
    
    .team-member:nth-child(1) { transition-delay: 0.1s; }
    .team-member:nth-child(2) { transition-delay: 0.2s; }
    .team-member:nth-child(3) { transition-delay: 0.3s; }
    
    .value-card:nth-child(1) { transition-delay: 0.1s; }
    .value-card:nth-child(2) { transition-delay: 0.2s; }
    .value-card:nth-child(3) { transition-delay: 0.3s; }
    .value-card:nth-child(4) { transition-delay: 0.4s; }
`;
document.head.appendChild(style);