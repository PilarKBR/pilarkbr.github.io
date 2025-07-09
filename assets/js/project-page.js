// Project Page Shared JavaScript - Lightbox functionality

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxLoading = document.querySelector('.lightbox-loading');
    const imageCounter = document.getElementById('image-counter');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');
    const lightboxControls = document.querySelector('.lightbox-controls');
    const helpBtn = document.getElementById('help-btn');
    const lightboxHelp = document.getElementById('lightbox-help');
    
    // Check if lightbox elements exist
    if (!lightbox || !lightboxImage) {
        // If lightbox elements don't exist yet, wait and try again
        setTimeout(initializeLightbox, 100);
        return;
    }
    
    // Select gallery images - includes all clickable images across project pages
    const galleryImages = document.querySelectorAll('.gallery-image img, .dashboard-preview img, .poster-frame img, .poster-image img');
    let currentImageIndex = 0;
    let isZoomed = false;
    let zoomLevel = 1;
    let lastTouchTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;
    
    // Make gallery images clickable
    galleryImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            currentImageIndex = index;
            showLightbox(this.src, this.alt);
        });
    });
    
    function showLightbox(src, alt) {
        // Show loading indicator
        lightboxLoading.style.display = 'block';
        lightboxImage.style.display = 'none';
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Update image counter
        updateImageCounter();
        
        // Reset zoom state
        isZoomed = false;
        zoomLevel = 1;
        lightboxImage.classList.remove('zoomed');
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.transformOrigin = 'center center';
        
        // Load new image
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        
        // Hide loading and show image when loaded
        lightboxImage.onload = function() {
            lightboxLoading.style.display = 'none';
            lightboxImage.style.display = 'block';
            
            const aspectRatio = this.naturalWidth / this.naturalHeight;
            if (aspectRatio > 1.2) {
                // Landscape image
                this.classList.add('landscape');
                this.classList.remove('portrait');
            } else {
                // Portrait or square image
                this.classList.add('portrait');
                this.classList.remove('landscape');
            }
        };
        
        // Handle loading error
        lightboxImage.onerror = function() {
            lightboxLoading.style.display = 'none';
            lightboxImage.style.display = 'block';
            lightboxImage.alt = 'Image failed to load';
        };
    }
    
    function updateImageCounter() {
        if (galleryImages.length > 1) {
            imageCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
            imageCounter.style.display = 'block';
            lightboxControls.classList.remove('single-image');
        } else {
            imageCounter.style.display = 'none';
            lightboxControls.classList.add('single-image');
        }
    }
    
    function hideLightbox() {
        lightbox.style.display = 'none';
        lightboxLoading.style.display = 'none';
        lightboxHelp.style.display = 'none';
        document.body.style.overflow = 'auto';
        isZoomed = false;
        zoomLevel = 1;
        lightboxImage.classList.remove('zoomed', 'portrait', 'landscape');
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.transformOrigin = 'center center';
    }
    
    function getRelativePosition(event, element) {
        const rect = element.getBoundingClientRect();
        let clientX, clientY;
        
        if (event.touches && event.touches.length > 0) {
            // Touch event
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            // Mouse event
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        
        return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    }
    
    function zoomIn(event = null) {
        zoomLevel = Math.min(zoomLevel * 1.5, 4);
        
        if (event && zoomLevel > 1) {
            const pos = getRelativePosition(event, lightboxImage);
            lightboxImage.style.transformOrigin = `${pos.x}% ${pos.y}%`;
        }
        
        lightboxImage.style.transform = `scale(${zoomLevel})`;
        isZoomed = zoomLevel > 1;
        lightboxImage.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    }
    
    function zoomOut(event = null) {
        const prevZoomLevel = zoomLevel;
        zoomLevel = Math.max(zoomLevel / 1.5, 1);
        
        if (zoomLevel === 1) {
            lightboxImage.style.transformOrigin = 'center center';
        } else if (event && prevZoomLevel > zoomLevel) {
            const pos = getRelativePosition(event, lightboxImage);
            lightboxImage.style.transformOrigin = `${pos.x}% ${pos.y}%`;
        }
        
        lightboxImage.style.transform = `scale(${zoomLevel})`;
        isZoomed = zoomLevel > 1;
        lightboxImage.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    }
    
    function resetZoom() {
        zoomLevel = 1;
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.transformOrigin = 'center center';
        isZoomed = false;
        lightboxImage.style.cursor = 'zoom-in';
    }
    
    // Close lightbox
    lightboxClose.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            hideLightbox();
        }
    });
    
    // Zoom controls
    zoomInBtn.addEventListener('click', () => zoomIn());
    zoomOutBtn.addEventListener('click', () => zoomOut());
    
    // Help toggle
    helpBtn.addEventListener('click', function() {
        const isVisible = lightboxHelp.style.display === 'block';
        lightboxHelp.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', hideLightbox);
    
    // Hide help when clicking on lightbox content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightboxHelp.style.display = 'none';
            hideLightbox();
        }
    });
    
    // Double-click to zoom with position
    lightboxImage.addEventListener('dblclick', function(e) {
        e.preventDefault();
        if (isZoomed) {
            resetZoom();
        } else {
            zoomIn(e);
        }
    });
    
    // Mouse wheel zoom with position
    lightboxImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn(e);
        } else {
            zoomOut(e);
        }
    });
    
    // Click on image to toggle zoom with position
    lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isZoomed) {
            resetZoom();
        } else {
            zoomIn(e);
        }
    });
    
    // Touch events for mobile zoom and swipe
    lightboxImage.addEventListener('touchstart', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTouchTime;
        
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = false;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                e.preventDefault();
                if (isZoomed) {
                    resetZoom();
                } else {
                    zoomIn(e);
                }
            }
        }
        lastTouchTime = currentTime;
    });
    
    lightboxImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && !isZoomed) {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            // Check if horizontal swipe is dominant
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                isSwiping = true;
                e.preventDefault();
            }
        }
    });
    
    lightboxImage.addEventListener('touchend', function(e) {
        if (isSwiping && galleryImages.length > 1) {
            const touchEndX = e.changedTouches[0].clientX;
            const deltaX = touchEndX - touchStartX;
            
            if (deltaX > 50) {
                // Swipe right - previous image
                prevBtn.click();
            } else if (deltaX < -50) {
                // Swipe left - next image
                nextBtn.click();
            }
        }
        isSwiping = false;
    });
    
    // Pinch to zoom for mobile
    let initialDistance = 0;
    let initialZoom = 1;
    
    lightboxImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialZoom = zoomLevel;
        }
    });
    
    lightboxImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (initialDistance > 0) {
                const scale = currentDistance / initialDistance;
                zoomLevel = Math.max(1, Math.min(4, initialZoom * scale));
                
                // Set transform origin to center of pinch
                const centerX = (touch1.clientX + touch2.clientX) / 2;
                const centerY = (touch1.clientY + touch2.clientY) / 2;
                const rect = lightboxImage.getBoundingClientRect();
                const x = ((centerX - rect.left) / rect.width) * 100;
                const y = ((centerY - rect.top) / rect.height) * 100;
                
                lightboxImage.style.transformOrigin = `${x}% ${y}%`;
                lightboxImage.style.transform = `scale(${zoomLevel})`;
                isZoomed = zoomLevel > 1;
                lightboxImage.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
            }
        }
    });
    
    lightboxImage.addEventListener('touchend', function(e) {
        if (e.touches.length < 2) {
            initialDistance = 0;
            if (zoomLevel === 1) {
                lightboxImage.style.transformOrigin = 'center center';
            }
        }
    });
    
    // Previous image
    prevBtn.addEventListener('click', function() {
        if (galleryImages.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            const prevImg = galleryImages[currentImageIndex];
            showLightbox(prevImg.src, prevImg.alt);
        }
    });
    
    // Next image
    nextBtn.addEventListener('click', function() {
        if (galleryImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            const nextImg = galleryImages[currentImageIndex];
            showLightbox(nextImg.src, nextImg.alt);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    lightboxHelp.style.display = 'none';
                    hideLightbox();
                    break;
                case 'ArrowLeft':
                    if (galleryImages.length > 1) {
                        prevBtn.click();
                    }
                    break;
                case 'ArrowRight':
                    if (galleryImages.length > 1) {
                        nextBtn.click();
                    }
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                    zoomOut();
                    break;
                case '0':
                    resetZoom();
                    break;
                case 'h':
                case 'H':
                case '?':
                    helpBtn.click();
                    break;
            }
        }
    });
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for includes to load, then initialize
    setTimeout(initializeLightbox, 100);
});
