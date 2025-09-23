// content-creator.js

// Navigate to other pages
function navigateTo(page) {
    window.location.href = page;
}


// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../../index.html';
    }
}

// Example: dynamically populate recent activity
const activities = [
    { title: "Uploaded Image: Taj Mahal", desc: "Added high-res images for the virtual tour", time: "2 hours ago", icon: "fas fa-image" },
    { title: "Uploaded Video: Jaipur Fort Tour", desc: "360° video ready for virtual tour", time: "1 day ago", icon: "fas fa-video" }
];

function populateActivities() {
    const container = document.querySelector(".activity-timeline");
    if (!container) return;
    container.innerHTML = "";
    activities.forEach(act => {
        const item = document.createElement("div");
        item.classList.add("timeline-item");
        item.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="activity-icon">
                    <i class="${act.icon}"></i>
                </div>
                <div class="activity-details">
                    <h4>${act.title}</h4>
                    <p>${act.desc}</p>
                    <span class="activity-time">${act.time}</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateActivities();
});
