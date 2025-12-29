/**
 * NAVIGATION & UI COMPONENTS
 */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

// Mobile Menu Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
    });
});

// Navbar Shadow on Scroll
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

/**
 * ANIMATION LOGIC
 */

// Optimized Scroll Observer for general reveals
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Faster Counter Animation Logic
const animateCounter = (element) => {
    const target = +element.getAttribute('data-target');
    const duration = 1000; // Speed up to 1 second
    const startTime = performance.now();

    if (target === 0) {
        element.textContent = "0";
        return;
    }

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Standard ease-out
        const easeOut = progress * (2 - progress);
        const currentNum = Math.floor(easeOut * target);

        // Apply symbol
        const symbol = (target === 100) ? '%' : (target === 0 ? '' : '+');
        
        if (progress < 1) {
            element.textContent = currentNum + symbol;
            requestAnimationFrame(updateCounter);
        } else {
            // Force final target at the end
            element.textContent = target + symbol;
        }
    };
    requestAnimationFrame(updateCounter);
};

// Intersection Observer for Stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                // Small delay so it starts AFTER the fade-in begins
                setTimeout(() => animateCounter(statNumber), 100);
            }
        }
    });
}, { threshold: 0.5 });

// Initialize all Observers on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // General scroll reveals
    document.querySelectorAll('.section, .project-card, .skill-category, .achievement-card, .contact-card, .timeline-item')
        .forEach(el => scrollObserver.observe(el));

    // Stats counters
    document.querySelectorAll('.stat').forEach(stat => statsObserver.observe(stat));
});

/**
 * PERFORMANCE & ENHANCEMENTS
 */

// Smooth Parallax using requestAnimationFrame
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero && scrolled < window.innerHeight) {
                // Slower parallax factor (0.2) for smoothness
                hero.style.transform = `translateY(${scrolled * 0.2}px)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Ripple Effect for Buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Active Link Highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});