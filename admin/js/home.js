// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadAdminData();
    initializeDashboard();
});

// Check if user has admin access
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = '../../index.html';
        return;
    }
    
    if (currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        redirectToUserDashboard(currentUser.role);
        return;
    }
    
    // Display admin info
    document.getElementById('adminName').textContent = currentUser.name;
}

// Load admin data
function loadAdminData() {
    // Simulate loading data from API
    setTimeout(() => {
        updateStats();
        loadRecentActivity();
    }, 1000);
}

// Update dashboard statistics
function updateStats() {
    // In a real app, this would come from an API
    const stats = {
        sites: Math.floor(Math.random() * 50) + 40,
        users: Math.floor(Math.random() * 500) + 1000,
        questions: Math.floor(Math.random() * 30) + 60,
        answers: Math.floor(Math.random() * 100) + 200
    };
    
    document.querySelectorAll('.stat-info h3')[0].textContent = stats.sites;
    document.querySelectorAll('.stat-info h3')[1].textContent = stats.users.toLocaleString();
    document.querySelectorAll('.stat-info h3')[2].textContent = stats.questions;
    document.querySelectorAll('.stat-info h3')[3].textContent = stats.answers;
}

// Load recent activity
function loadRecentActivity() {
    const activities = [
        {
            icon: '➕',
            text: 'New heritage site added: Konark Sun Temple',
            time: '5 minutes ago'
        },
        {
            icon: '👤',
            text: 'User account activated: Amit Sharma',
            time: '25 minutes ago'
        },
        {
            icon: '✅',
            text: 'Discussion thread approved: "Ancient Indian Architecture"',
            time: '1 hour ago'
        },
        {
            icon: '⚠️',
            text: 'System backup completed successfully',
            time: '2 hours ago'
        }
    ];
    
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-details">
                <p>${activity.text}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Initialize dashboard functionality
function initializeDashboard() {
    // Add real-time updates (simulated)
    setInterval(() => {
        updateLiveStats();
    }, 30000); // Update every 30 seconds
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Update live statistics
function updateLiveStats() {
    const questionsElement = document.querySelectorAll('.stat-info h3')[2];
    const currentQuestions = parseInt(questionsElement.textContent);
    
    // Simulate small changes
    const change = Math.random() > 0.5 ? 1 : -1;
    const newCount = Math.max(0, currentQuestions + change);
    questionsElement.textContent = newCount;
    
    // Add visual feedback
    questionsElement.style.color = change > 0 ? '#e74c3c' : '#27ae60';
    setTimeout(() => {
        questionsElement.style.color = '#2c3e50';
    }, 1000);
}

// Keyboard shortcuts for admin
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                window.location.href = 'answers.html';
                break;
            case '2':
                e.preventDefault();
                window.location.href = 'sites.html';
                break;
            case '3':
                e.preventDefault();
                window.location.href = 'users.html';
                break;
            case '4':
                e.preventDefault();
                window.location.href = 'discussions.html';
                break;
            case 'l':
                e.preventDefault();
                logout();
                break;
        }
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../../index.html';
    }
}

// Redirect to user dashboard based on role
function redirectToUserDashboard(role) {
    const dashboards = {
        'cultural_enthusiast': '../../cultural-enthusiast/html/home.html',
        'content_creator': '../../content-creator/html/home.html',
        'tour_guide': '../../tour-guide/html/home.html'
    };
    
    window.location.href = dashboards[role] || '../../index.html';
}

// Export data function (for future use)
function exportData(type) {
    alert(`Exporting ${type} data... This would download a CSV file in a real application.`);
    // Implementation would involve generating and downloading CSV/Excel files
}

// System maintenance functions
function runSystemCheck() {
    const checkItems = [
        'Database Connection',
        'File Storage',
        'User Authentication',
        'API Endpoints',
        'Email Service'
    ];
    
    let results = '<h3>System Check Results</h3><ul>';
    checkItems.forEach(item => {
        const status = Math.random() > 0.2 ? '✅ Operational' : '⚠️ Issues';
        results += `<li>${item}: ${status}</li>`;
    });
    results += '</ul>';
    
    showModal('System Health Check', results);
}

// Modal utility function
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
            <h2>${title}</h2>
            <div>${content}</div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Add to global scope for modal close functionality
window.showModal = showModal;
window.logout = logout;

console.log('Admin dashboard initialized. Keyboard shortcuts:');
console.log('Ctrl+1: Answers Inbox');
console.log('Ctrl+2: Heritage Sites');
console.log('Ctrl+3: User Management');
console.log('Ctrl+4: Discussions');
console.log('Ctrl+L: Logout');