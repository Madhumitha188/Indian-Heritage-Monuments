// Background Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Change slide every 5 seconds
setInterval(nextSlide, 5000);

// Role Selection
let selectedRole = 'cultural_enthusiast';

function selectRole(role) {
    selectedRole = role;
    const roleName = formatRoleName(role);
    
    // Update form headers
    document.getElementById('login-role').textContent = roleName;
    document.getElementById('signup-role').textContent = roleName;
    
    // Show login form
    showLogin();
}

function showRoleSelection() {
    document.getElementById('role-selection').style.display = 'block';
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.remove('active');
}

function showLogin() {
    document.getElementById('role-selection').style.display = 'none';
    document.getElementById('login-form').classList.add('active');
    document.getElementById('signup-form').classList.remove('active');
}

function showSignup() {
    document.getElementById('role-selection').style.display = 'none';
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
}

// Demo account fillers
function fillDemoLogin(role) {
    const emails = {
        'cultural_enthusiast': 'enthusiast@heritageindia.com',
        'content_creator': 'creator@heritageindia.com',
        'tour_guide': 'guide@heritageindia.com',
        'admin': 'admin@heritageindia.com'
    };
    
    document.getElementById('login-email').value = emails[role];
    document.getElementById('login-password').value = 'demo123';
    selectedRole = role;
    document.getElementById('login-role').textContent = formatRoleName(role);
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    loginUser(email, password, rememberMe);
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const acceptTerms = document.getElementById('accept-terms').checked;
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    registerUser(name, email, password, selectedRole);
});

// Simulate user login
function loginUser(email, password, rememberMe) {
    const btn = document.querySelector('#loginForm .btn-primary');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;
    
    setTimeout(() => {
        const user = {
            name: email.split('@')[0].replace('.', ' '),
            email: email,
            role: selectedRole,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3498db&color=fff`
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            redirectToDashboard(selectedRole);
        }, 1000);
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

// Simulate user registration
function registerUser(name, email, password, role) {
    const btn = document.querySelector('#signupForm .btn-primary');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    btn.disabled = true;
    
    setTimeout(() => {
        const user = {
            name: name,
            email: email,
            role: role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e67e22&color=fff`,
            joinDate: new Date().toISOString()
        };
        
        // Save user data
        const users = JSON.parse(localStorage.getItem('heritageUsers')) || [];
        users.push(user);
        localStorage.setItem('heritageUsers', JSON.stringify(users));
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        showNotification('Account created successfully! Welcome to Heritage India.', 'success');
        
        setTimeout(() => {
            redirectToDashboard(role);
        }, 1500);
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

// Redirect to appropriate dashboard
function redirectToDashboard(role) {
    const rolePaths = {
        'cultural_enthusiast': 'cultural-enthusiast/html/home.html',
        'content_creator': 'content-creator/html/home.html',
        'tour_guide': 'tour-guide/html/home.html',
        'admin': 'admin/html/home.html'
    };
    
    window.location.href = rolePaths[role] || 'cultural-enthusiast/html/home.html';
}

// Format role names for display
function formatRoleName(role) {
    const roleNames = {
        'cultural_enthusiast': 'Cultural Enthusiast',
        'content_creator': 'Content Creator',
        'tour_guide': 'Tour Guide',
        'admin': 'Administrator'
    };
    return roleNames[role] || role;
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 400px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease;
            }
            .notification.success { background: #27ae60; }
            .notification.error { background: #e74c3c; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (isLoggedIn === 'true' && currentUser) {
        redirectToDashboard(currentUser.role);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Initialize slideshow
    slides[currentSlide].classList.add('active');
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to role cards
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease forwards';
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });
    
    // Add loading animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyles);
    
    console.log('Heritage India Platform Loaded Successfully');
    console.log('Demo accounts available for all roles');
});