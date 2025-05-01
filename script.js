// This file checks if choculaterie.com is reachable and updates the HTML accordingly.

document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('check-button');
    const resultDiv = document.getElementById('result');
    const statusIndicator = document.getElementById('status-indicator');
    const websiteUrl = 'https://choculaterie.com';

    function checkWebsite() {
        // Show loading state
        resultDiv.textContent = 'Checking website...';
        resultDiv.className = 'result loading';
        statusIndicator.className = 'status-indicator loading';

        fetch(websiteUrl)
            .then(response => {
                if (response.ok) {
                    resultDiv.textContent = 'choculaterie.com is reachable!';
                    resultDiv.className = 'result success';
                    statusIndicator.className = 'status-indicator online';
                } else {
                    let errorMessage = 'The website is having issues. ';
                    switch (response.status) {
                        case 404:
                            errorMessage += 'The page cannot be found.';
                            break;
                        case 500:
                            errorMessage += 'The server is experiencing internal problems.';
                            break;
                        case 503:
                            errorMessage += 'The service is temporarily unavailable, possibly due to maintenance.';
                            break;
                        case 403:
                            errorMessage += 'Access to this website is currently restricted.';
                            break;
                        default:
                            errorMessage += `Status code ${response.status} received.`;
                    }
                    resultDiv.textContent = errorMessage;
                    resultDiv.className = 'result error';
                    statusIndicator.className = 'status-indicator offline';
                }
            })
            .catch(error => {
                let errorMessage = 'Unable to reach the website. ';
                if (error.message.includes('Failed to fetch')) {
                    errorMessage += 'This could be due to network issues or the server being down.';
                } else if (error.message.includes('NetworkError')) {
                    errorMessage += 'Please check your internet connection.';
                } else {
                    errorMessage += error.message;
                }
                resultDiv.textContent = errorMessage;
                resultDiv.className = 'result error';
                statusIndicator.className = 'status-indicator offline';
            });
    }

    // Check website on page load
    checkWebsite();

    // Check website when button is clicked
    checkButton.addEventListener('click', checkWebsite);

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