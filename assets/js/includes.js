// HTML Include Utility - Load shared components
function loadHTMLIncludes() {
    // Load all elements with data-include attribute
    const includeElements = document.querySelectorAll('[data-include]');
    
    includeElements.forEach(element => {
        const file = element.getAttribute('data-include');
        
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
                
                // After loading header, initialize navigation if needed
                if (file.includes('header')) {
                    initializeNavigation();
                }
            })
            .catch(error => {
                console.error('Error loading include file:', file, error);
                element.innerHTML = `<!-- Error loading ${file} -->`;
            });
    });
}

// Initialize navigation functionality after header is loaded
function initializeNavigation() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Update active navigation link based on current page
    updateActiveNavLink();
}

// Update active navigation link
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href && (
            (currentPath.includes('customer-segmentation') && href.includes('#projects')) ||
            (currentPath.includes('predweather') && href.includes('#projects')) ||
            (currentPath.includes('opefb-finder') && href.includes('#projects')) ||
            (currentPath.endsWith('/') || currentPath.endsWith('index.html')) && href.includes('#home')
        )) {
            link.classList.add('active');
        }
    });
}

// Load includes when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadHTMLIncludes();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadHTMLIncludes, initializeNavigation, updateActiveNavLink };
}
