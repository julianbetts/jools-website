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
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    slideshowContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    slideshowContainer.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
    
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
    // Remove active class from current slide and indicator
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex % indicators.length].classList.remove('active');
    
    // Calculate new slide index
    currentSlideIndex += direction;
    
    // Handle wrap-around
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Add active class to new slide and indicator
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex % indicators.length].classList.add('active');
    
    // Reset auto-slide timer (desktop only)
    if (window.innerWidth > 768) {
        resetAutoSlide();
    }
}

// Function to go to a specific slide
function currentSlide(slideNumber) {
    // Convert to 0-based index
    const targetIndex = slideNumber - 1;
    
    if (targetIndex >= 0 && targetIndex < slides.length) {
        // Remove active class from current slide and indicator
        slides[currentSlideIndex].classList.remove('active');
        indicators[currentSlideIndex % indicators.length].classList.remove('active');
        
        // Set new current slide
        currentSlideIndex = targetIndex;
        
        // Add active class to new slide and indicator
        slides[currentSlideIndex].classList.add('active');
        indicators[currentSlideIndex % indicators.length].classList.add('active');
        
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
        'assets/jools-art/CPG_jools rothblatt_the valley(1).jpg',
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
