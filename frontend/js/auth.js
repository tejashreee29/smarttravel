// Authentication utility functions

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user info
function getCurrentUser() {
    return {
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName'),
        isLoggedIn: isAuthenticated()
    };
}

// Protect page - redirect to login if not authenticated
function protectPage() {
    if (!isAuthenticated()) {
        // Replace page content with login prompt
        document.body.innerHTML = `
            <nav class="topnav">
                <div class="brand">
                    <a href="index.html">TravelPlan</a>
                </div>
                <div class="nav-actions">
                    <a href="login.html">Sign In</a>
                </div>
            </nav>
            <div class="container">
                <div class="protected-message">
                    <h2><i class="fas fa-lock"></i> Access Restricted</h2>
                    <p>Please sign in to access this page.</p>
                    <a href="login.html" class="btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </a>
                </div>
            </div>
        `;
        return false;
    }
    return true;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    }
}

// Update navigation with user info
function updateNavigation() {
    const user = getCurrentUser();
    if (user.isLoggedIn) {
        // Find navigation elements and update them
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            // Add welcome message and logout button
            const welcomeSpan = document.createElement('span');
            welcomeSpan.style.color = '#667eea';
            welcomeSpan.style.marginRight = '15px';
            welcomeSpan.textContent = `Welcome, ${user.name}!`;
            
            // Update sign out link
            const signOutLink = navActions.querySelector('a[href="index.html"]');
            if (signOutLink && signOutLink.textContent.includes('Sign Out')) {
                signOutLink.href = '#';
                signOutLink.onclick = logout;
                signOutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
                
                // Insert welcome message before sign out link
                navActions.insertBefore(welcomeSpan, signOutLink);
            }
        }
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is a protected page (has dashboard in URL or specific protected pages)
    const currentPage = window.location.pathname.toLowerCase();
    const protectedPages = ['dashboard', 'weather', 'currency', 'wallet', 'destination', 'itinerary', 'culture', 'language', 'transport', 'chatbot'];
    
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    
    if (isProtectedPage) {
        if (protectPage()) {
            updateNavigation();
        }
    }
});
