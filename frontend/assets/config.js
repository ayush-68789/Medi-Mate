const CONFIG = {
    // This will automatically switch between local and production
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://medi-mate-backend.onrender.com' // Replace with your Render URL later
};

// Export for use in other files
window.CONFIG = CONFIG;
