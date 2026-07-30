/* ============================================================
   MAXIS SECURITY - MAIN JAVASCRIPT
   Handles navigation, counters, animations, and interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // NAVBAR SCROLL EFFECT
    // ============================================================
    const navbar = document.getElementById('mainNav');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ============================================================
    // BACK TO TOP BUTTON
    // ============================================================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================================
    // COUNTER ANIMATION
    // ============================================================
    const counters = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;

        // Check if any counter is visible
        let isVisible = false;
        counters.forEach(counter => {
            const rect = counter.closest('.hero-stats, .stat-box, .counter-section');
            if (rect) {
                const rectBounds = rect.getBoundingClientRect();
                if (rectBounds.top < window.innerHeight - 100) {
                    isVisible = true;
                }
            }
        });

        if (!isVisible) return;
        counterAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (!target) return;

            const duration = 2000;
            const step = Math.max(1, Math.floor(target / 60));
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    return;
                }
                counter.textContent = current;
                requestAnimationFrame(updateCounter);
            };

            updateCounter();
        });
    }

    window.addEventListener('scroll', animateCounters);
    window.addEventListener('load', animateCounters);

    // ============================================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================================
    const animateElements = document.querySelectorAll(
        '.service-card, .industry-item, .blog-card, .testimonial-card, .value-card, .team-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.05}s`;
        observer.observe(el);
    });

    // ============================================================
    // SMOOTH SCROLL FOR INTERNAL LINKS
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                // Close mobile menu if open
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // ============================================================
    // CONTACT FORM HANDLING
    // ============================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            if (name.value.trim() === '' || email.value.trim() === '' || message.value.trim() === '') {
                showFormAlert('Please fill in all required fields.', 'danger');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showFormAlert('Please enter a valid email address.', 'danger');
                return;
            }

            // Show success message
            showFormAlert('Thank you! Your message has been sent. We\'ll respond within 24 hours.', 'success');
            contactForm.reset();
        });

        function showFormAlert(message, type) {
            // Remove existing alert
            const existingAlert = contactForm.querySelector('.form-alert');
            if (existingAlert) existingAlert.remove();

            const alert = document.createElement('div');
            alert.className = `form-alert alert alert-${type} mt-3`;
            alert.textContent = message;
            contactForm.appendChild(alert);

            // Auto dismiss after 5 seconds
            setTimeout(() => {
                if (alert) alert.remove();
            }, 5000);
        }
    }

    // ============================================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.btn-cta-nav)');

    function highlightNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('active');
            }
            // Handle page-specific active states
            if (href && href.includes('.html')) {
                const pageName = href.split('/').pop().split('.')[0];
                const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
                if (pageName === currentPage) {
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    window.addEventListener('load', highlightNav);

    // ============================================================
    // CONSOLE BRANDING
    // ============================================================
    console.log('%c Maxis Security %c Professional Security Services ',
        'background:#c8102e; color:#fff; font-size:18px; font-weight:bold; padding:8px 12px; border-radius:4px 0 0 4px;',
        'background:#1a1a2e; color:#fff; font-size:18px; padding:8px 12px; border-radius:0 4px 4px 0;'
    );
    console.log('🚀 Website loaded successfully. Protecting the Lower Mainland since 2016.');
});