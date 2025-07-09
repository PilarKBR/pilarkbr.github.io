// Project Page Shared JavaScript - Lightbox functionality

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');
    
    // Select gallery images - includes both .gallery-image img and .dashboard-preview img for flexibility
    const galleryImages = document.querySelectorAll('.gallery-image img, .dashboard-preview img, .poster-frame img');
    let currentImageIndex = 0;
    let isZoomed = false;
    let zoomLevel = 1;
    let lastTouchTime = 0;
    
    // Make gallery images clickable
    galleryImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            currentImageIndex = index;
            showLightbox(this.src, this.alt);
        });
    });
    
    function showLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightbox.style.display = 'flex';
        isZoomed = false;
        zoomLevel = 1;
        lightboxImage.classList.remove('zoomed');
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.transformOrigin = 'center center';
        document.body.style.overflow = 'hidden';
        
        // Adjust image sizing based on aspect ratio
        lightboxImage.onload = function() {
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
    }
    
    function hideLightbox() {
        lightbox.style.display = 'none';
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
    
    // Touch events for mobile zoom
    lightboxImage.addEventListener('touchstart', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTouchTime;
        
        if (tapLength < 500 && tapLength > 0) {
            // Double tap detected
            e.preventDefault();
            if (isZoomed) {
                resetZoom();
            } else {
                zoomIn(e);
            }
        }
        lastTouchTime = currentTime;
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
            }
        }
    });
});
