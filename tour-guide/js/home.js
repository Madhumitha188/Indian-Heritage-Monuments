// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
});

// Main Initialization Function
function initializeHomePage() {
    loadUserData();
    loadFeaturedSites();
    setupEventListeners();
    checkUserFirstVisit();
}

// Load User Data
function loadUserData() {
    const username = localStorage.getItem('username') || 'Explorer';
    document.getElementById('username').textContent = `Welcome, ${username}!`;
    
    // Update last visit time
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = new Date().toLocaleDateString();
    localStorage.setItem('lastVisit', currentTime);
}

// Load Featured Sites
function loadFeaturedSites() {
    const sitesGrid = document.getElementById('sitesGrid');
    const featuredSites = [
        {
            id: 1,
            name: "Machu Picchu",
            location: "Peru",
            image: "https://images.unsplash.com/photo-1585504238212-67b67ef35c38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Ancient Inca citadel high in the Andes Mountains",
            category: "ancient",
            rating: 4.9,
            reviews: 1247
        },
        {
            id: 2,
            name: "Taj Mahal",
            location: "India",
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Iconic white marble mausoleum and symbol of love",
            category: "medieval",
            rating: 4.8,
            reviews: 1893
        },
        {
            id: 3,
            name: "Great Wall of China",
            location: "China",
            image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Series of fortifications built across historical northern borders",
            category: "ancient",
            rating: 4.7,
            reviews: 2156
        },
        {
            id: 4,
            name: "Colosseum",
            location: "Italy",
            image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Ancient Roman amphitheater and engineering marvel",
            category: "ancient",
            rating: 4.9,
            reviews: 1789
        },
        {
            id: 5,
            name: "Pyramids of Giza",
            location: "Egypt",
            image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Ancient Egyptian pyramids and Sphinx monument",
            category: "ancient",
            rating: 4.8,
            reviews: 1672
        },
        {
            id: 6,
            name: "Eiffel Tower",
            location: "France",
            image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Iron lattice tower on the Champ de Mars in Paris",
            category: "unesco",
            rating: 4.6,
            reviews: 2341
        }
    ];

    sitesGrid.innerHTML = featuredSites.map(site => `
        <div class="site-card" data-category="${site.category}">
            <div class="site-image">
                <img src="${site.image}" alt="${site.name}">
            </div>
            <div class="site-content">
                <h3>${site.name}</h3>
                <span class="site-location">${site.location}</span>
                <p class="site-description">${site.description}</p>
                <div class="site-meta">
                    <span><i class="fas fa-star"></i> ${site.rating}</span>
                    <span><i class="fas fa-comment"></i> ${site.reviews} reviews</span>
                </div>
                <div class="site-actions">
                    <button class="btn-primary" onclick="viewSite(${site.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-secondary" onclick="addToFavorites(${site.id})">
                        <i class="fas fa-heart"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterSites(this.dataset.filter);
        });
    });

    // Newsletter form
    const emailInput = document.querySelector('.email-input');
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            subscribeNewsletter();
        }
    });
}

// Filter Sites by Category
function filterSites(category) {
    const sites = document.querySelectorAll('.site-card');
    
    sites.forEach(site => {
        if (category === 'all' || site.dataset.category === category) {
            site.style.display = 'block';
        } else {
            site.style.display = 'none';
        }
    });
}

// Check if it's user's first visit
function checkUserFirstVisit() {
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
        setTimeout(() => {
            showQuickTour();
        }, 2000);
        localStorage.setItem('firstVisit', 'true');
    }
}

// Navigation Functions
function navigateTo(page) {
    window.location.href = page;
}

function exploreSites() {
    navigateTo('heritage-sites.html');
}

function takeTour() {
    showQuickTour();
}

// Modal Functions
function showQuickTour() {
    const modal = document.getElementById('quickTourModal');
    modal.classList.add('active');
    resetTourSteps();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

function resetTourSteps() {
    const steps = document.querySelectorAll('.tour-step');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTourStep');
    const nextBtn = document.getElementById('nextTourStep');
    
    steps.forEach(step => step.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    steps[0].classList.add('active');
    dots[0].classList.add('active');
    
    prevBtn.disabled = true;
    nextBtn.textContent = 'Next <i class="fas fa-arrow-right"></i>';
    document.getElementById('currentStep').textContent = '1';
}

function nextTourStep() {
    const currentStep = parseInt(document.getElementById('currentStep').textContent);
    const totalSteps = 3;
    
    if (currentStep < totalSteps) {
        showTourStep(currentStep + 1);
    } else {
        closeModal('quickTourModal');
        // Redirect to virtual tours after tutorial
        setTimeout(() => {
            navigateTo('virtual-tours.html');
        }, 500);
    }
}

function prevTourStep() {
    const currentStep = parseInt(document.getElementById('currentStep').textContent);
    if (currentStep > 1) {
        showTourStep(currentStep - 1);
    }
}

function showTourStep(stepNumber) {
    const steps = document.querySelectorAll('.tour-step');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTourStep');
    const nextBtn = document.getElementById('nextTourStep');
    
    steps.forEach(step => step.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    steps[stepNumber - 1].classList.add('active');
    dots[stepNumber - 1].classList.add('active');
    
    document.getElementById('currentStep').textContent = stepNumber;
    
    prevBtn.disabled = stepNumber === 1;
    
    if (stepNumber === 3) {
        nextBtn.innerHTML = 'Get Started <i class="fas fa-rocket"></i>';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

// Site Interaction Functions
function viewSite(siteId) {
    // In a real application, this would redirect to the site detail page
    console.log(`Viewing site with ID: ${siteId}`);
    showNotification(`Opening ${getSiteName(siteId)} details...`);
}

function addToFavorites(siteId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(siteId)) {
        favorites.push(siteId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification(`${getSiteName(siteId)} added to favorites!`);
    } else {
        showNotification(`${getSiteName(siteId)} is already in your favorites!`);
    }
}

function getSiteName(siteId) {
    const sites = {
        1: "Machu Picchu",
        2: "Taj Mahal",
        3: "Great Wall of China",
        4: "Colosseum",
        5: "Pyramids of Giza",
        6: "Eiffel Tower"
    };
    return sites[siteId] || "Heritage Site";
}

// Event Functions
function joinEvent(eventId) {
    showNotification(`Joining ${eventId} event...`);
    // In a real application, this would integrate with a calendar/event system
}

// Article Functions
function readArticle(articleId) {
    showNotification(`Loading article: ${articleId}`);
    // In a real application, this would open the article page
}

// Newsletter Function
function subscribeNewsletter() {
    const emailInput = document.querySelector('.email-input');
    const email = emailInput.value.trim();
    
    if (email && validateEmail(email)) {
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            showNotification('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            showNotification('This email is already subscribed!');
        }
    } else {
        showNotification('Please enter a valid email address!');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../../index.html';
    }
}

// Export functions for global access
window.navigateTo = navigateTo;
window.exploreSites = exploreSites;
window.takeTour = takeTour;
window.viewSite = viewSite;
window.addToFavorites = addToFavorites;
window.joinEvent = joinEvent;
window.readArticle = readArticle;
window.subscribeNewsletter = subscribeNewsletter;
window.showQuickTour = showQuickTour;
window.closeModal = closeModal;
window.nextTourStep = nextTourStep;
window.prevTourStep = prevTourStep;
window.logout = logout;