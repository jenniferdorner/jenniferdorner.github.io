// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Smooth scrolling for navigation links (backup for browsers that don't support scroll-behavior: smooth)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Adjust for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Update copyright year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Image lazy loading (for when images are added)
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Fade in animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in effect to sections
document.querySelectorAll('.project-section, .bio-section, .contact-section, .news-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(section);
});

// Gallery lightbox functionality (for when images are added)
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.image-grid img');
    
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });
}

function openLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
    
    // Close on click
    lightbox.addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });
    
    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(lightbox);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGalleryLightbox();
    initHorizontalScroll();
});

// Horizontal scroll functionality for project pages
function initHorizontalScroll() {
    const scrollContainer = document.querySelector('.horizontal-scroll-container');
    
    if (!scrollContainer) return;
    
    // Hide scroll hint after user scrolls
    let scrollHintHidden = false;
    scrollContainer.addEventListener('scroll', () => {
        if (!scrollHintHidden && scrollContainer.scrollLeft > 50) {
            scrollContainer.classList.add('scrolled');
            scrollHintHidden = true;
        }
        updateScrollCursor();
    });
    
    // Update cursor based on scroll position and mouse position
    function updateScrollCursor() {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;
        
        const canScrollLeft = currentScroll > 0;
        const canScrollRight = currentScroll < maxScrollLeft - 1;
        
        // Store scroll state
        scrollContainer.dataset.canScrollLeft = canScrollLeft;
        scrollContainer.dataset.canScrollRight = canScrollRight;
    }
    
    // Update cursor on mouse move
    scrollContainer.addEventListener('mousemove', (e) => {
        const rect = scrollContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const halfWidth = rect.width / 2;
        
        const canScrollLeft = scrollContainer.dataset.canScrollLeft === 'true';
        const canScrollRight = scrollContainer.dataset.canScrollRight === 'true';
        
        // Left side of window
        if (mouseX < halfWidth) {
            if (canScrollLeft) {
                scrollContainer.style.cursor = 'w-resize'; // Left arrow
            } else {
                scrollContainer.style.cursor = 'default';
            }
        } 
        // Right side of window
        else {
            if (canScrollRight) {
                scrollContainer.style.cursor = 'e-resize'; // Right arrow
            } else {
                scrollContainer.style.cursor = 'default';
            }
        }
    });
    
    // Reset cursor when mouse leaves
    scrollContainer.addEventListener('mouseleave', () => {
        scrollContainer.style.cursor = 'default';
    });
    
    // Click to scroll to next/previous image and center it
    scrollContainer.addEventListener('click', (e) => {
        const rect = scrollContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const halfWidth = rect.width / 2;
        
        const canScrollLeft = scrollContainer.dataset.canScrollLeft === 'true';
        const canScrollRight = scrollContainer.dataset.canScrollRight === 'true';
        
        const scrollItems = Array.from(scrollContainer.querySelectorAll('.scroll-item'));
        if (scrollItems.length === 0) return;
        
        // Find the currently centered or nearest item
        const containerCenter = scrollContainer.scrollLeft + (scrollContainer.clientWidth / 2);
        let currentIndex = 0;
        let minDistance = Infinity;
        
        scrollItems.forEach((item, index) => {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const distance = Math.abs(containerCenter - itemCenter);
            if (distance < minDistance) {
                minDistance = distance;
                currentIndex = index;
            }
        });
        
        let targetIndex = currentIndex;
        
        // Determine direction based on click position
        if (mouseX < halfWidth && canScrollLeft) {
            // Click on left side - go to previous item
            targetIndex = Math.max(0, currentIndex - 1);
        } else if (mouseX >= halfWidth && canScrollRight) {
            // Click on right side - go to next item
            targetIndex = Math.min(scrollItems.length - 1, currentIndex + 1);
        } else {
            // No scroll possible in that direction
            return;
        }
        
        // Scroll to center the target item
        const targetItem = scrollItems[targetIndex];
        
        // Get the actual position using getBoundingClientRect for accuracy
        const containerRect = scrollContainer.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();
        
        // Calculate the center of the item relative to the document
        const itemCenterRelativeToContainer = (itemRect.left - containerRect.left) + (itemRect.width / 2);
        
        // Calculate how much to scroll to center the item
        const containerCenterOffset = containerRect.width / 2;
        const scrollAdjustment = itemCenterRelativeToContainer - containerCenterOffset;
        
        scrollContainer.scrollTo({
            left: scrollContainer.scrollLeft + scrollAdjustment,
            behavior: 'smooth'
        });
    });
    
    // Initial update
    updateScrollCursor();
    
    // Keyboard navigation for horizontal scroll
    document.addEventListener('keydown', (e) => {
        if (!scrollContainer) return;
        
        const scrollAmount = window.innerWidth * 0.8;
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    scrollContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const scrollAmount = window.innerWidth * 0.8;
            
            if (diff > 0) {
                // Swipe left - scroll right
                scrollContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                // Swipe right - scroll left
                scrollContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }
}

