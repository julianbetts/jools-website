// Slideshow functionality
let currentSlideIndex = 0;
let slides = [];
let indicators = [];
let autoSlideInterval;

// Initialize the slideshow when the page loads
document.addEventListener('DOMContentLoaded', function() {
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    
    // Start automatic slideshow only on desktop
    if (window.innerWidth > 768) {
        startAutoSlide();
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleAutoSlide();
        }
    });
    
    // Add touch/swipe support for mobile - simple carousel style
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    slideshowContainer.addEventListener('touchstart', function(e) {
        if (window.innerWidth <= 768) {
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
            
            // Disable all transitions during drag
            slides.forEach(slide => {
                slide.style.transition = 'none';
            });
        }
    });
    
    slideshowContainer.addEventListener('touchmove', function(e) {
        if (isDragging && window.innerWidth <= 768) {
            e.preventDefault();
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            const percentage = diff / slideshowContainer.offsetWidth;
            
            // Move all slides together as one carousel
            slides.forEach((slide, index) => {
                const slideOffset = (index - currentSlideIndex) * 100;
                slide.style.transform = `translateX(${slideOffset + percentage * 100}%)`;
            });
        }
    });
    
    slideshowContainer.addEventListener('touchend', function(e) {
        if (isDragging && window.innerWidth <= 768) {
            isDragging = false;
            const diff = startX - currentX;
            const percentage = diff / slideshowContainer.offsetWidth;
            const threshold = 0.2; // 20% threshold to trigger slide change
            
            if (Math.abs(percentage) > threshold) {
                // Complete the slide change
                if (percentage > 0) {
                    // Swipe left - next slide
                    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                } else {
                    // Swipe right - previous slide
                    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                }
            }
            
            // Reset all slides to their correct positions
            slides.forEach((slide, index) => {
                slide.style.transition = '';
                slide.style.transform = '';
                if (index === currentSlideIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentSlideIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    });
    
    // Pause auto-slide on hover (desktop only)
    slideshowContainer.addEventListener('mouseenter', function() {
        if (window.innerWidth > 768) {
            pauseAutoSlide();
        }
    });
    slideshowContainer.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) {
            startAutoSlide();
        }
    });
});

// Function to change slides
function changeSlide(direction) {
    const isMobile = window.innerWidth <= 768;
    const currentSlide = slides[currentSlideIndex];
    
    // Calculate new slide index
    let newSlideIndex = currentSlideIndex + direction;
    
    // Handle wrap-around
    if (newSlideIndex >= slides.length) {
        newSlideIndex = 0;
    } else if (newSlideIndex < 0) {
        newSlideIndex = slides.length - 1;
    }
    
    const newSlide = slides[newSlideIndex];
    
    if (isMobile) {
        // Mobile: Instant switch, no animations
        currentSlide.classList.remove('active');
        indicators[currentSlideIndex % indicators.length].classList.remove('active');
        
        newSlide.classList.add('active');
        indicators[newSlideIndex % indicators.length].classList.add('active');
    } else {
        // Desktop: Use fade transition
        currentSlide.classList.remove('active');
        indicators[currentSlideIndex % indicators.length].classList.remove('active');
        
        newSlide.classList.add('active');
        indicators[newSlideIndex % indicators.length].classList.add('active');
    }
    
    currentSlideIndex = newSlideIndex;
    
    // Reset auto-slide timer (desktop only)
    if (window.innerWidth > 768) {
        resetAutoSlide();
    }
}

// Function to go to a specific slide
function currentSlide(slideNumber) {
    // Convert to 0-based index
    const targetIndex = slideNumber - 1;
    const isMobile = window.innerWidth <= 768;
    
    if (targetIndex >= 0 && targetIndex < slides.length && targetIndex !== currentSlideIndex) {
        const currentSlide = slides[currentSlideIndex];
        const newSlide = slides[targetIndex];
        
        if (isMobile) {
            // Mobile: Instant switch, no animations
            currentSlide.classList.remove('active');
            indicators[currentSlideIndex % indicators.length].classList.remove('active');
            
            newSlide.classList.add('active');
            indicators[targetIndex % indicators.length].classList.add('active');
        } else {
            // Desktop: Use fade transition
            currentSlide.classList.remove('active');
            indicators[currentSlideIndex % indicators.length].classList.remove('active');
            
            newSlide.classList.add('active');
            indicators[targetIndex % indicators.length].classList.add('active');
        }
        
        currentSlideIndex = targetIndex;
        
        // Reset auto-slide timer (desktop only)
        if (window.innerWidth > 768) {
            resetAutoSlide();
        }
    }
}

// Auto-slide functionality
function startAutoSlide() {
    autoSlideInterval = setInterval(function() {
        changeSlide(1);
    }, 4000); // Change slide every 4 seconds
}

function pauseAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

function resetAutoSlide() {
    pauseAutoSlide();
    startAutoSlide();
}

function toggleAutoSlide() {
    if (autoSlideInterval) {
        pauseAutoSlide();
    } else {
        startAutoSlide();
    }
}

// Preload images for better performance
function preloadImages() {
    const imagePaths = [
        'assets/jools-art/CPG_Jools rothblatt_cheff.jpg',
        'assets/jools-art/CPG_Jools rothblatt_green olive.jpg',
        'assets/jools-art/CPG_jools rothblatt_kissers.jpg',
        'assets/jools-art/CPG_jools rothblatt_nuns.jpg',
        'assets/jools-art/CPG_jools rothblatt_powerpuff gorl.jpg',
        'assets/jools-art/CPG_jools rothblatt_red.jpg',
        'assets/jools-art/CPG_Jools Rothblatt_Ringside L.jpg',
        'assets/jools-art/CPG_jools rothblatt_the valley.jpg',
        'assets/jools-art/CPG_jools rothblatt_underdogs.jpg',
        'assets/jools-art/CPG_Joools rothblatt_night clubbing.jpg'
    ];
    
    imagePaths.forEach(function(path) {
        const img = new Image();
        img.src = path;
    });
}

// Start preloading images
preloadImages();

// Add some visual feedback for interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('control-btn') || e.target.classList.contains('indicator')) {
        // Add a subtle ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        
        e.target.appendChild(ripple);
        
        setTimeout(function() {
            ripple.remove();
        }, 600);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
