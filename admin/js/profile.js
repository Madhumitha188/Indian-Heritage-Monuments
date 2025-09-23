let userProfile = {};
let activityLog = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadProfileData();
    initializeProfile();
});

function loadProfileData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Load profile data from localStorage or use defaults
    userProfile = JSON.parse(localStorage.getItem('adminProfile') || JSON.stringify({
        name: currentUser.name || 'Admin User',
        email: currentUser.email || 'admin@heritage.com',
        phone: '+91 9876543210',
        bio: 'System administrator for Indian Heritage Monuments platform.',
        joinDate: new Date('2024-01-01'),
        avatar: null,
        preferences: {
            theme: 'light',
            resultsPerPage: 25,
            notifications: {
                email: true,
                answers: true,
                reports: true,
                system: false
            }
        },
        security: {
            twoFactor: false,
            lastPasswordChange: new Date()
        }
    }));

    // Load activity log
    activityLog = JSON.parse(localStorage.getItem('adminActivityLog') || JSON.stringify([
        {
            action: 'Login',
            description: 'Successful login to admin panel',
            type: 'login',
            timestamp: new Date(),
            ip: '192.168.1.100',
            device: 'Chrome on Windows'
        },
        {
            action: 'User Management',
            description: 'Updated user role for Rajesh Kumar',
            type: 'moderation',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            ip: '192.168.1.100',
            device: 'Chrome on Windows'
        },
        {
            action: 'Site Approval',
            description: 'Approved new heritage site: Hampi Temple',
            type: 'moderation',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            ip: '192.168.1.100',
            device: 'Chrome on Windows'
        }
    ]));

    displayProfile();
    loadActivityLog();
    loadSessions();
}

function displayProfile() {
    // Personal Info
    document.getElementById('fullName').value = userProfile.name;
    document.getElementById('email').value = userProfile.email;
    document.getElementById('phone').value = userProfile.phone || '';
    document.getElementById('bio').value = userProfile.bio || '';
    
    // Avatar
    document.getElementById('avatarInitials').textContent = userProfile.name.charAt(0).toUpperCase();
    
    // Profile card
    document.getElementById('profileName').textContent = userProfile.name;
    document.getElementById('profileEmail').textContent = userProfile.email;
    document.getElementById('profileRole').textContent = 'Administrator';
    document.getElementById('profileJoined').textContent = `Member since ${userProfile.joinDate ? new Date(userProfile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}`;
    
    // Stats
    document.getElementById('statSites').textContent = '45';
    document.getElementById('statAnswers').textContent = '128';
    document.getElementById('statUsers').textContent = '1,234';
    document.getElementById('statLastActive').textContent = '2 hours ago';
    
    // Preferences
    document.getElementById('themeSelect').value = userProfile.preferences.theme;
    document.getElementById('resultsPerPage').value = userProfile.preferences.resultsPerPage;
    document.getElementById('notifEmail').checked = userProfile.preferences.notifications.email;
    document.getElementById('notifAnswers').checked = userProfile.preferences.notifications.answers;
    document.getElementById('notifReports').checked = userProfile.preferences.notifications.reports;
    document.getElementById('notifSystem').checked = userProfile.preferences.notifications.system;
    
    // Security
    document.getElementById('twoFactorToggle').checked = userProfile.security.twoFactor;
}

function initializeProfile() {
    // Form submissions
    document.getElementById('personalForm').addEventListener('submit', savePersonalInfo);
    document.getElementById('passwordForm').addEventListener('submit', changePassword);
    
    // Password strength indicator
    document.getElementById('newPassword').addEventListener('input', checkPasswordStrength);
    
    // Theme change
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    changeTheme(savedTheme);
    document.getElementById('themeSelect').value = savedTheme;
}

// Tab functionality
function openTab(tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected pane and activate button
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Personal Info Form
function savePersonalInfo(e) {
    e.preventDefault();
    
    userProfile.name = document.getElementById('fullName').value;
    userProfile.email = document.getElementById('email').value;
    userProfile.phone = document.getElementById('phone').value;
    userProfile.bio = document.getElementById('bio').value;
    
    // Update localStorage
    localStorage.setItem('adminProfile', JSON.stringify(userProfile));
    localStorage.setItem('currentUser', JSON.stringify({
        ...JSON.parse(localStorage.getItem('currentUser') || '{}'),
        name: userProfile.name,
        email: userProfile.email
    }));
    
    // Update display
    displayProfile();
    
    // Log activity
    addActivity('Profile Update', 'Updated personal information', 'settings');
    
    showNotification('Profile updated successfully!', 'success');
}

function resetForm() {
    if (confirm('Reset all changes?')) {
        displayProfile();
    }
}

// Password Management
function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match!', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long!', 'error');
        return;
    }
    
    // Simulate password change
    userProfile.security.lastPasswordChange = new Date();
    localStorage.setItem('adminProfile', JSON.stringify(userProfile));
    
    // Clear form
    document.getElementById('passwordForm').reset();
    document.getElementById('passwordStrength').className = 'password-strength';
    
    // Log activity
    addActivity('Security', 'Changed account password', 'settings');
    
    showNotification('Password updated successfully!', 'success');
}

function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('passwordStrength');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    strengthBar.className = 'password-strength ' + [
        'strength-weak',
        'strength-weak',
        'strength-medium',
        'strength-strong',
        'strength-very-strong'
    ][strength];
}

// Preferences
function savePreferences() {
    userProfile.preferences.theme = document.getElementById('themeSelect').value;
    userProfile.preferences.resultsPerPage = document.getElementById('resultsPerPage').value;
    userProfile.preferences.notifications = {
        email: document.getElementById('notifEmail').checked,
        answers: document.getElementById('notifAnswers').checked,
        reports: document.getElementById('notifReports').checked,
        system: document.getElementById('notifSystem').checked
    };
    
    localStorage.setItem('adminProfile', JSON.stringify(userProfile));
    changeTheme(userProfile.preferences.theme);
    
    addActivity('Preferences', 'Updated account preferences', 'settings');
    showNotification('Preferences saved!', 'success');
}

function changeTheme(theme) {
    localStorage.setItem('adminTheme', theme);
    
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Activity Log
function loadActivityLog() {
    const container = document.getElementById('activityLog');
    const filteredActivities = filterActivities(activityLog);
    
    if (filteredActivities.length === 0) {
        container.innerHTML = '<p class="empty-state">No activities found</p>';
        return;
    }
    
    container.innerHTML = filteredActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-details">
                <div class="activity-action">${activity.action}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-meta">
                    ${formatDate(activity.timestamp)} • ${activity.ip} • ${activity.device}
                </div>
            </div>
        </div>
    `).join('');
}

function filterActivities(activities) {
    const typeFilter = document.getElementById('activityTypeFilter').value;
    const dateFilter = document.getElementById('activityDateFilter').value;
    
    let filtered = activities;
    
    if (typeFilter !== 'all') {
        filtered = filtered.filter(activity => activity.type === typeFilter);
    }
    
    if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filtered = filtered.filter(activity => 
            new Date(activity.timestamp).toDateString() === filterDate.toDateString()
        );
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function filterActivity() {
    loadActivityLog();
}

function addActivity(action, description, type) {
    const activity = {
        action,
        description,
        type,
        timestamp: new Date(),
        ip: '192.168.1.100', // Simulated IP
        device: navigator.userAgent.split(' ')[0] + ' on ' + (navigator.platform || 'Unknown')
    };
    
    activityLog.unshift(activity);
    localStorage.setItem('adminActivityLog', JSON.stringify(activityLog));
    
    if (document.getElementById('activity').classList.contains('active')) {
        loadActivityLog();
    }
}

function getActivityIcon(type) {
    const icons = {
        'login': '🔐',
        'moderation': '⚖️',
        'settings': '⚙️',
        'system': '🖥️'
    };
    return icons[type] || '📝';
}

// Sessions Management
function loadSessions() {
    const sessions = [
        {
            device: 'Chrome on Windows',
            location: 'Mumbai, India',
            lastActive: new Date(),
            current: true
        },
        {
            device: 'Safari on iPhone',
            location: 'Delhi, India',
            lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
    ];
    
    const container = document.getElementById('sessionsList');
    container.innerHTML = sessions.map(session => `
        <div class="session-item">
            <div class="session-info">
                <div class="session-device">${session.device}</div>
                <div class="session-details">
                    ${session.location} • Last active: ${formatDate(session.lastActive)}
                    ${session.current ? ' • <strong>Current Session</strong>' : ''}
                </div>
            </div>
            ${!session.current ? `
                <div class="session-actions">
                    <button onclick="revokeSession('${session.device}')">Revoke</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function revokeSession(device) {
    if (confirm(`Revoke session for ${device}?`)) {
        showNotification('Session revoked successfully!', 'success');
        // In real app, this would call an API to invalidate the session
    }
}

// Avatar Upload
function triggerAvatarUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleAvatarUpload;
    input.click();
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification('Image size must be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            userProfile.avatar = e.target.result;
            localStorage.setItem('adminProfile', JSON.stringify(userProfile));
            
            // Update avatar display
            const avatar = document.getElementById('avatarInitials');
            avatar.style.backgroundImage = `url(${e.target.result})`;
            avatar.style.backgroundSize = 'cover';
            avatar.textContent = '';
            
            addActivity('Profile', 'Updated profile picture', 'settings');
            showNotification('Avatar updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Account Management
function exportData() {
    const dataStr = JSON.stringify(userProfile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `admin-profile-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    addActivity('Data Export', 'Exported profile data', 'system');
    showNotification('Data exported successfully!', 'success');
}

function showDeleteModal() {
    document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

function deleteAccount() {
    if (confirm('This action cannot be undone. Are you absolutely sure?')) {
        // Clear all admin data
        localStorage.removeItem('adminProfile');
        localStorage.removeItem('adminActivityLog');
        localStorage.removeItem('adminTheme');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        
        showNotification('Account deleted successfully!', 'success');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 2000);
    }
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 5px;
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || '#3498db';
}

function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !currentUser || currentUser.role !== 'admin') {
        window.location.href = '../../index.html';
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../../index.html';
    }
}

// Add dark theme styles
const style = document.createElement('style');
style.textContent = `
    .dark-theme {
        background: #1a1a1a;
        color: #ffffff;
    }
    
    .dark-theme .sidebar {
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    }
    
    .dark-theme .main-content {
        background: #1a1a1a;
    }
    
    .dark-theme .content-section,
    .dark-theme .stat-card,
    .dark-theme .profile-card,
    .dark-theme .profile-stats {
        background: #2d2d2d;
        color: #ffffff;
    }
    
    .dark-theme .form-group input,
    .dark-theme .form-group textarea,
    .dark-theme .form-group select {
        background: #1a1a1a;
        border-color: #444;
        color: #ffffff;
    }
`;
document.head.appendChild(style);