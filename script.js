// This file checks if choculaterie.com is reachable and updates the HTML accordingly.

// Base URL configuration
const BASE_URL = 'https://choculaterie.com'; // Change this for local testing
//const BASE_URL = 'https://localhost:7282'; // Uncomment for local development

const endpoints = {
    website: `${BASE_URL}`,
    api: `${BASE_URL}/api/StatusCheckerAPI`,
    database: `${BASE_URL}/api/StatusCheckerAPI/database`,
    dotnet: `${BASE_URL}/api/StatusCheckerAPI/dotnet`
};

function checkWebsite(service) {
    const indicator = document.getElementById(`${service}-indicator`);
    const result = document.getElementById(`${service}-result`);
    const startTime = performance.now();

    indicator.className = 'status-indicator loading';
    result.textContent = 'Checking...';

    fetch(endpoints[service])
        .then(response => {
            const responseTime = Math.round(performance.now() - startTime);
            if (response.ok) {
                result.textContent = 'Website is accessible';
                result.className = 'result success';
                indicator.className = 'status-indicator online';
                updateDetails(service, { responseTime });
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
            updateLastCheckedTime();
        })
        .catch(error => {
            result.textContent = 'Website unreachable';
            result.className = 'result error';
            indicator.className = 'status-indicator offline';
            updateLastCheckedTime();
        });
}

function checkDatabase(service) {
    const indicator = document.getElementById(`${service}-indicator`);
    const result = document.getElementById(`${service}-result`);

    indicator.className = 'status-indicator loading';
    result.textContent = 'Checking database...';

    fetch(endpoints[service])
        .then(response => response.json())
        .then(data => {
            if (data.status === 'healthy') {
                result.textContent = 'Database is connected';
                result.className = 'result success';
                indicator.className = 'status-indicator online';
                updateDetails(service, data);
            } else {
                throw new Error(data.error || 'Database check failed');
            }
            updateLastCheckedTime();
        })
        .catch(error => {
            result.textContent = 'Database error';
            result.className = 'result error';
            indicator.className = 'status-indicator offline';
            updateDetails(service, { details: { serverName: '-', isConnected: false } });
            updateLastCheckedTime();
        });
}

function checkServices(service) {
    const indicator = document.getElementById(`${service}-indicator`);
    const result = document.getElementById(`${service}-result`);

    indicator.className = 'status-indicator loading';
    result.textContent = 'Checking services...';

    fetch(endpoints[service])
        .then(response => response.json())
        .then(data => {
            if (data.status === 'healthy') {
                result.textContent = 'All services running';
                result.className = 'result success';
                indicator.className = 'status-indicator online';
            } else {
                // Use a concise message that doesn't list all services
                result.textContent = 'Service check failed';
                result.className = 'result error';
                indicator.className = 'status-indicator offline';
            }

            // Update individual service statuses
            if (data.details) {
                Object.entries(data.details).forEach(([serviceName, status]) => {
                    const element = document.getElementById(`service-${serviceName.toLowerCase()}`);
                    if (element) {
                        const statusElement = element.querySelector('.service-status');
                        if (statusElement) {
                            statusElement.textContent = status ? 'Running' : 'Stopped';
                            statusElement.className = `service-status ${status ? 'online' : 'offline'}`;
                        }
                    }
                });
            }
            updateLastCheckedTime();
        })
        .catch(error => {
            result.textContent = 'Service check failed';
            result.className = 'result error';
            indicator.className = 'status-indicator offline';
            updateLastCheckedTime();
        });
}

function checkApiHealth(service) {
    const indicator = document.getElementById(`${service}-indicator`);
    const result = document.getElementById(`${service}-result`);
    const startTime = performance.now();

    indicator.className = 'status-indicator loading';
    result.textContent = 'Checking API...';

    fetch(endpoints[service])
        .then(response => response.json())
        .then(data => {
            const responseTime = Math.round(performance.now() - startTime);
            if (data.status === 'healthy') {
                result.textContent = 'API is responding';
                result.className = 'result success';
                indicator.className = 'status-indicator online';
                updateDetails(service, { responseTime });
            } else {
                throw new Error('API health check failed');
            }
            updateLastCheckedTime();
        })
        .catch(error => {
            result.textContent = 'API error';
            result.className = 'result error';
            indicator.className = 'status-indicator offline';
            updateLastCheckedTime();
        });
}

function checkService(service) {
    switch (service) {
        case 'website':
            checkWebsite(service);
            break;
        case 'database':
            checkDatabase(service);
            break;
        case 'dotnet':
            checkServices(service);
            break;
        case 'api':
            checkApiHealth(service);
            break;
    }
}

function checkAllServices() {
    Object.keys(endpoints).forEach(service => checkService(service));
}

document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('check-button');

    // Initial check of all services
    Object.keys(endpoints).forEach(checkService);

    // Check all services when button is clicked
    checkButton.addEventListener('click', () => {
        Object.keys(endpoints).forEach(checkService);
    });

    // Theme toggle functionality
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = themeToggleButton.querySelector('i');

    // Check for saved theme in cookies or default to light theme
    const currentTheme = getCookie('theme') || 'light';

    // Apply correct theme on page load
    if (currentTheme === 'light') {
        document.body.classList.remove('lightStoneBackground');
        themeIcon.classList.add('fa-moon');
        themeIcon.classList.remove('fa-sun');
    } else {
        document.body.classList.add('lightStoneBackground');
        themeIcon.classList.add('fa-sun');
        themeIcon.classList.remove('fa-moon');
    }

    // Toggle theme on button click
    themeToggleButton.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('lightStoneBackground');

        // Toggle theme class
        document.body.classList.toggle('lightStoneBackground');

        // Toggle icon
        themeIcon.classList.toggle('fa-moon');
        themeIcon.classList.toggle('fa-sun');

        // Add rotation animation
        themeIcon.classList.add('rotate');

        // Store preference
        setCookie('theme', isDarkMode ? 'light' : 'dark', 365);
    });

    // Remove animation class after it completes
    themeIcon.addEventListener('animationend', () => {
        themeIcon.classList.remove('rotate');
    });
});

// Function to preload images
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Preload both background images
preloadImages([
    './images/newLightStone.png',
    './images/newDarkStone.png'
]);

// Function to read a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function updateLastCheckedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    document.getElementById('last-check-time').textContent = `${dateString} ${timeString}`;

    // Update status images after status checks are complete
    updateStatusImages();
}

// Update this function to also update the OpenGraph title
function updateStatusImages() {
    // Check if any service is offline
    const indicators = document.querySelectorAll('.status-indicator');
    const hasError = Array.from(indicators).some(indicator =>
        indicator.classList.contains('offline'));

    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]');
    favicon.href = hasError
        ? 'https://status.choculaterie.com/images/server_logo_status_error.png'
        : 'https://status.choculaterie.com/images/server_logo_status_ok.png';

    // Update OpenGraph image
    const ogImage = document.querySelector('meta[property="og:image"]');
    ogImage.content = hasError
        ? 'https://status.choculaterie.com/images/server_logo_status_error.png'
        : 'https://status.choculaterie.com/images/server_logo_status_ok.png';

    // Create compact status summary for Discord banner
    const statusSummary = createStatusSummary();

    // Update OpenGraph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    ogTitle.content = statusSummary;
}

// New function to create a compact status summary
function createStatusSummary() {
    // Get status for each service
    const websiteStatus = document.getElementById('website-indicator').classList.contains('online');
    const apiStatus = document.getElementById('api-indicator').classList.contains('online');
    const dbStatus = document.getElementById('database-indicator').classList.contains('online');
    const servicesStatus = document.getElementById('dotnet-indicator').classList.contains('online');

    // Create status indicators (✓ for online, ✗ for offline)
    const webIndicator = websiteStatus ? '✓' : '✗';
    const apiIndicator = apiStatus ? '✓' : '✗';
    const dbIndicator = dbStatus ? '✓' : '✗';
    const svcIndicator = servicesStatus ? '✓' : '✗';

    // Format as compact row-based status
    return `Choc Status | Web:${webIndicator} API:${apiIndicator} DB:${dbIndicator} Svc:${svcIndicator}`;
}

function updateDetails(service, data) {
    switch (service) {
        case 'website':
            document.getElementById('website-url').textContent = BASE_URL;
            document.getElementById('website-response-time').textContent = `${data.responseTime}ms`;
            break;
        case 'api':
            document.getElementById('api-endpoint').textContent = endpoints.api;
            document.getElementById('api-response-time').textContent = `${data.responseTime}ms`;
            break;
        case 'database':
            if (data.details) {
                document.getElementById('database-server').textContent = data.details.serverName;
                document.getElementById('database-connection').textContent =
                    data.details.isConnected ? 'Connected' : 'Disconnected';
            }
            break;
    }
}