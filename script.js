/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT - KHURAM LATIF (CREATIVE GRAPHIC DESIGNER)
 * VANILLA ES6+ JAVASCRIPT: ADVANCED ANIMATIONS, LOADER & PREMIUM EFFECTS
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // Check prefers-reduced-motion user preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --------------------------------------------------------------------------
       1. PAGE LOADER CONTROLLER
       -------------------------------------------------------------------------- */
    const initPageLoader = () => {
        const loader = document.getElementById('page-loader');
        if (!loader) return;

        const dismissLoader = () => {
            loader.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        };

        // Dismiss when window completes loading or max fallback of 1000ms
        if (document.readyState === 'complete') {
            setTimeout(dismissLoader, 250);
        } else {
            window.addEventListener('load', () => {
                setTimeout(dismissLoader, 300);
            });
            setTimeout(dismissLoader, 1200); // Fail-safe
        }
    };

    /* --------------------------------------------------------------------------
       2. ROTATING TEXT TYPING EFFECT (HERO SECTION)
       -------------------------------------------------------------------------- */
    const initTextTyping = () => {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const roles = [
            'Graphic Designer',
            'Website Designer',
            'Digital Marketing',
            'Artificial Intelligence'
        ];

        if (prefersReducedMotion) {
            typingElement.textContent = roles[0];
            return;
        }

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        const typeLoop = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 75;
            }

            // Word completed
            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2200; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before typing next word
            }

            setTimeout(typeLoop, typingSpeed);
        };

        // Start typing loop
        setTimeout(typeLoop, 500);
    };

    /* --------------------------------------------------------------------------
       3. CUSTOM MOUSE CURSOR (DESKTOP ONLY)
       -------------------------------------------------------------------------- */
    const initCustomCursor = () => {
        const cursor = document.getElementById('custom-cursor');
        const follower = document.getElementById('custom-cursor-follower');

        // Only activate on pointer-fine desktop devices
        const isDesktopPointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024;
        if (!cursor || !follower || !isDesktopPointer || prefersReducedMotion) {
            if (cursor) cursor.style.display = 'none';
            if (follower) follower.style.display = 'none';
            return;
        }

        let mouseX = -100;
        let mouseY = -100;
        let followerX = -100;
        let followerY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Direct position for center dot
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Smooth trailing animation loop for outer ring
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;

            follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateFollower);
        };
        requestAnimationFrame(animateFollower);

        // Interactive hover expansions
        const interactiveSelectors = 'a, button, .project-card, .service-card, .skill-card, input, textarea, .nav-toggle';
        const interactiveElements = document.querySelectorAll(interactiveSelectors);

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hovered');
            });
        });

        // Hide when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });
    };

    /* --------------------------------------------------------------------------
       4. AMBIENT BACKGROUND PARTICLE CANVAS
       -------------------------------------------------------------------------- */
    const initParticleCanvas = () => {
        const canvas = document.getElementById('ambient-canvas');
        if (!canvas || prefersReducedMotion) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particleCount = window.innerWidth < 768 ? 16 : 32;
        const particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.alpha = Math.random() * 0.35 + 0.1;
                this.isPurple = Math.random() > 0.45;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.isPurple
                    ? `rgba(168, 85, 247, ${this.alpha})`
                    : `rgba(56, 189, 248, ${this.alpha})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.isPurple ? '#8b5cf6' : '#00d2ff';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationFrameId;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Faint connection lines between close particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 90)})`;
                        ctx.lineWidth = 0.6;
                        ctx.shadowBlur = 0;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Pause animation when tab is inactive to preserve performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                render();
            }
        });
    };

    /* --------------------------------------------------------------------------
       5. MOBILE NAVIGATION CONTROLLER
       -------------------------------------------------------------------------- */
    const initMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navAction = document.querySelector('.nav-action .btn');

        if (!navToggle || !navMenu) return;

        const toggleMenu = (open) => {
            const isCurrentlyOpen = navMenu.classList.contains('active');
            const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

            navMenu.classList.toggle('active', shouldOpen);
            navToggle.classList.toggle('active', shouldOpen);
            navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            
            if (window.innerWidth <= 768) {
                document.body.style.overflow = shouldOpen ? 'hidden' : '';
            }
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        });

        if (navAction) {
            navAction.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
                navToggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    };

    /* --------------------------------------------------------------------------
       6. STICKY HEADER & SCROLL SHADOW
       -------------------------------------------------------------------------- */
    const initStickyHeader = () => {
        const header = document.getElementById('header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    /* --------------------------------------------------------------------------
       7. SMOOTH SCROLLING WITH FIXED HEADER OFFSET
       -------------------------------------------------------------------------- */
    const initSmoothScrolling = () => {
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        const header = document.getElementById('header');

        internalLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;

                const targetElement = document.getElementById(href.substring(1));
                if (!targetElement) return;

                e.preventDefault();

                const headerHeight = header ? header.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight + 2;

                window.scrollTo({
                    top: href === '#home' ? 0 : offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            });
        });
    };

    /* --------------------------------------------------------------------------
       8. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHTING)
       -------------------------------------------------------------------------- */
    const initScrollSpy = () => {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.getElementById('header');

        if (!sections.length || !navLinks.length) return;

        const updateActiveLink = () => {
            const headerHeight = header ? header.offsetHeight : 80;
            const scrollPos = window.scrollY + headerHeight + 100;

            let currentSectionId = '';

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (window.scrollY < 100) {
                currentSectionId = 'home';
            } else if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
                currentSectionId = 'contact';
            }

            navLinks.forEach((link) => {
                const linkHref = link.getAttribute('href');
                if (linkHref === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    };

    /* --------------------------------------------------------------------------
       9. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       -------------------------------------------------------------------------- */
    const initScrollAnimations = () => {
        if (prefersReducedMotion) return;

        const animatedTargets = [
            ...document.querySelectorAll('.section-header'),
            ...document.querySelectorAll('.about-grid'),
            ...document.querySelectorAll('.skill-card'),
            ...document.querySelectorAll('.service-card'),
            ...document.querySelectorAll('.project-card'),
            ...document.querySelectorAll('.contact-grid')
        ];

        animatedTargets.forEach((el) => {
            el.classList.add('scroll-reveal');
        });

        const staggerGrids = ['.skills-grid', '.services-grid', '.projects-grid'];
        staggerGrids.forEach((gridSelector) => {
            const grid = document.querySelector(gridSelector);
            if (!grid) return;
            const items = grid.children;
            Array.from(items).forEach((item, idx) => {
                item.style.transitionDelay = `${idx * 0.08}s`;
            });
        });

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            animatedTargets.forEach((target) => {
                revealObserver.observe(target);
            });
        } else {
            animatedTargets.forEach((target) => target.classList.add('revealed'));
        }
    };

    /* --------------------------------------------------------------------------
       10. SKILL PROGRESS BARS & PERCENTAGE NUMBER COUNTER
       -------------------------------------------------------------------------- */
    const initSkillAnimations = () => {
        const skillsSection = document.getElementById('skills');
        const skillCards = document.querySelectorAll('.skill-card');

        if (!skillsSection || !skillCards.length) return;

        const targetPercentages = [
            { className: 'skill-progress-95', percent: 95 },
            { className: 'skill-progress-92', percent: 92 },
            { className: 'skill-progress-88', percent: 88 },
            { className: 'skill-progress-90', percent: 90 },
            { className: 'skill-progress-78', percent: 78 }
        ];

        // Animate counter from 0 to target
        const animateCounter = (element, targetValue) => {
            let current = 0;
            const duration = 1500;
            const stepTime = Math.max(Math.floor(duration / targetValue), 12);

            const timer = setInterval(() => {
                current += 1;
                element.textContent = `${current}%`;
                if (current >= targetValue) {
                    element.textContent = `${targetValue}%`;
                    clearInterval(timer);
                }
            }, stepTime);
        };

        let hasAnimated = false;

        const animateSkills = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            skillCards.forEach((card) => {
                const bar = card.querySelector('.skill-progress-fill');
                const badge = card.querySelector('.skill-percentage-badge');
                const percentText = card.querySelector('.skill-percentage');

                targetPercentages.forEach((item) => {
                    if (bar && bar.classList.contains(item.className)) {
                        bar.style.width = `${item.percent}%`;

                        if (!prefersReducedMotion) {
                            if (badge) animateCounter(badge, item.percent);
                            if (percentText) animateCounter(percentText, item.percent);
                        }
                    }
                });
            });
        };

        if (prefersReducedMotion) {
            animateSkills();
            return;
        }

        // Initially reset progress bar width
        skillCards.forEach((card) => {
            const bar = card.querySelector('.skill-progress-fill');
            if (bar) bar.style.width = '0%';
        });

        if ('IntersectionObserver' in window) {
            const skillObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateSkills();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.2
            });

            skillObserver.observe(skillsSection);
        } else {
            animateSkills();
        }
    };

    /* --------------------------------------------------------------------------
       11. PROJECT INTERACTIONS, LIVE SEARCH, ADVANCED GALLERY & PREVIEW MODAL
       -------------------------------------------------------------------------- */
    const initProjectInteractions = () => {
        const projectCards = document.querySelectorAll('.project-card');
        const subjectInput = document.getElementById('subject');
        const contactSection = document.getElementById('contact');
        const header = document.getElementById('header');

        // Gallery Filter & Search Elements
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('project-search-input');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        const noResultsAlert = document.getElementById('no-projects-found');
        const resetGalleryBtn = document.getElementById('reset-gallery-btn');

        // Modal Elements
        const modal = document.getElementById('project-modal');
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalImg = document.getElementById('modal-project-img');
        const modalTitle = document.getElementById('modal-project-title');
        const modalCategory = document.getElementById('modal-project-category');
        const modalDescription = document.getElementById('modal-project-description');
        const modalTagsContainer = document.getElementById('modal-project-tags');
        const modalCaseStudyBtn = document.getElementById('modal-case-study-btn');
        const modalInquireBtn = document.getElementById('modal-inquire-btn');
        const modalWhatsappBtn = document.getElementById('modal-whatsapp-link');

        // Modal Zoom Controls
        const zoomContainer = document.getElementById('modal-zoom-container');
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const zoomResetBtn = document.getElementById('zoom-reset-btn');
        const zoomLevelIndicator = document.getElementById('zoom-level-indicator');

        let activeCategory = 'all';
        let searchQuery = '';
        let lastFocusedElement = null;

        // Toast Notification System
        let toast = document.querySelector('.portfolio-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'portfolio-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }

        const showToast = (message) => {
            toast.textContent = message;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 3500);
        };

        // Pre-fill contact form inquiry handler
        const handleProjectInquiry = (projectTitle) => {
            if (subjectInput) {
                subjectInput.value = `Inquiry regarding: ${projectTitle}`;
                subjectInput.classList.remove('input-error');
            }

            if (contactSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const offsetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 600);
            }

            showToast(`Selected "${projectTitle}". Contact form pre-filled!`);
        };

        /* --- 1. FILTERING & SEARCH CONTROLLER --- */
        const filterGallery = () => {
            let visibleCount = 0;
            const query = searchQuery.trim().toLowerCase();

            projectCards.forEach((card) => {
                const categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
                const title = (card.getAttribute('data-title') || card.querySelector('.project-title')?.textContent || '').toLowerCase();
                const description = (card.querySelector('.project-description')?.textContent || '').toLowerCase();
                const tags = (card.getAttribute('data-tags') || '').toLowerCase();
                const combinedText = `${title} ${description} ${tags}`;

                const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory.toLowerCase());
                const matchesSearch = query === '' || combinedText.includes(query);

                if (matchesCategory && matchesSearch) {
                    visibleCount++;
                    card.classList.remove('filter-hidden', 'filter-animating-out');
                    if (!prefersReducedMotion) {
                        card.classList.add('filter-animating-in');
                    }
                } else {
                    if (!prefersReducedMotion) {
                        card.classList.add('filter-animating-out');
                        card.classList.remove('filter-animating-in');
                        setTimeout(() => {
                            if (card.classList.contains('filter-animating-out')) {
                                card.classList.add('filter-hidden');
                            }
                        }, 250);
                    } else {
                        card.classList.add('filter-hidden');
                    }
                }
            });

            // Handle No Results Message
            if (noResultsAlert) {
                noResultsAlert.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        };

        // Category Filter Buttons Listener
        filterButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                activeCategory = btn.getAttribute('data-filter') || 'all';
                filterGallery();
            });
        });

        // Search Input Listener
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
                }
                filterGallery();
            });

            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    searchQuery = '';
                    clearSearchBtn.style.display = 'none';
                    searchInput.focus();
                    filterGallery();
                });
            }
        }

        // Reset Gallery Button
        if (resetGalleryBtn) {
            resetGalleryBtn.addEventListener('click', () => {
                activeCategory = 'all';
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                if (clearSearchBtn) clearSearchBtn.style.display = 'none';

                filterButtons.forEach(b => {
                    const isAll = b.getAttribute('data-filter') === 'all';
                    b.classList.toggle('active', isAll);
                    b.setAttribute('aria-selected', isAll ? 'true' : 'false');
                });

                filterGallery();
            });
        }

        /* --- 2. MODAL & IMAGE ZOOM CONTROLLER --- */
        let currentZoom = 1;
        let isDragging = false;
        let startX = 0, startY = 0;
        let translateX = 0, translateY = 0;

        const updateZoomTransform = () => {
            if (!modalImg) return;
            modalImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
            if (zoomLevelIndicator) {
                zoomLevelIndicator.textContent = `${Math.round(currentZoom * 100)}%`;
            }
            if (zoomContainer) {
                zoomContainer.classList.toggle('zoomed', currentZoom > 1);
            }
        };

        const resetZoom = () => {
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            updateZoomTransform();
        };

        const setZoom = (newZoom) => {
            currentZoom = Math.min(Math.max(newZoom, 1), 3);
            if (currentZoom === 1) {
                translateX = 0;
                translateY = 0;
            }
            updateZoomTransform();
        };

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setZoom(currentZoom + 0.35);
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setZoom(currentZoom - 0.35);
            });
        }

        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetZoom();
            });
        }

        // Click on Zoom Container to Toggle Zoom (1x -> 1.75x -> 2.5x -> 1x)
        if (zoomContainer) {
            zoomContainer.addEventListener('click', (e) => {
                if (isDragging) return;
                if (e.target.closest('.modal-zoom-toolbar')) return;

                if (currentZoom === 1) {
                    setZoom(1.75);
                } else if (currentZoom < 2.5) {
                    setZoom(2.5);
                } else {
                    resetZoom();
                }
            });

            // Drag to Pan when zoomed
            zoomContainer.addEventListener('mousedown', (e) => {
                if (currentZoom <= 1) return;
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                zoomContainer.classList.add('panning');
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateZoomTransform();
            });

            window.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    if (zoomContainer) zoomContainer.classList.remove('panning');
                }
            });
        }

        // Open Modal Function
        const openProjectModal = (card) => {
            if (!modal) return;
            lastFocusedElement = document.activeElement;

            const imgEl = card.querySelector('.project-image');
            const titleEl = card.querySelector('.project-title');
            const categoryEl = card.querySelector('.project-category');
            const descEl = card.querySelector('.project-description');
            const tagsAttr = card.getAttribute('data-tags') || '';

            const pTitle = titleEl ? titleEl.textContent.trim() : 'Project Preview';
            const pCategory = categoryEl ? categoryEl.textContent.trim() : 'Design';
            const pDesc = descEl ? descEl.textContent.trim() : '';

            if (modalImg && imgEl) {
                modalImg.src = imgEl.src;
                modalImg.alt = imgEl.alt || pTitle;
            }
            if (modalTitle) modalTitle.textContent = pTitle;
            if (modalCategory) modalCategory.textContent = pCategory;
            if (modalDescription) modalDescription.textContent = pDesc;

            // Populate tags
            if (modalTagsContainer) {
                modalTagsContainer.innerHTML = '';
                if (tagsAttr) {
                    tagsAttr.split(',').forEach(tag => {
                        const tagSpan = document.createElement('span');
                        tagSpan.className = 'modal-tag';
                        tagSpan.textContent = tag.trim();
                        modalTagsContainer.appendChild(tagSpan);
                    });
                }
            }

            // Case Study button inside modal
            const caseStudyUrl = card.getAttribute('data-case-study') || 'case-study-kbitlogics-logo.html';
            if (modalCaseStudyBtn) {
                modalCaseStudyBtn.href = caseStudyUrl;
            }

            // Inquire button inside modal
            if (modalInquireBtn) {
                modalInquireBtn.onclick = (e) => {
                    e.preventDefault();
                    closeProjectModal();
                    handleProjectInquiry(pTitle);
                };
            }

            // WhatsApp link inside modal
            if (modalWhatsappBtn) {
                const encodedMsg = encodeURIComponent(`Hi Khuram, I am interested in your project: "${pTitle}". Let's discuss!`);
                modalWhatsappBtn.href = `https://wa.me/923264690033?text=${encodedMsg}`;
            }

            resetZoom();
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (modalCloseBtn) {
                modalCloseBtn.focus();
            }
        };

        const closeProjectModal = () => {
            if (!modal || !modal.classList.contains('active')) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            resetZoom();

            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        };

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeProjectModal);
        }
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', closeProjectModal);
        }

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeProjectModal();
            }
        });

        /* --- 3. ATTACH CARD LISTENERS --- */
        projectCards.forEach((card) => {
            const titleEl = card.querySelector('.project-title');
            const projectTitle = titleEl ? titleEl.textContent.trim() : 'Project';

            const projectLink = card.querySelector('.project-link');
            const previewBtn = card.querySelector('.btn-preview-card');
            const imageWrapper = card.querySelector('.project-image-wrapper');
            const overlay = card.querySelector('.project-image-overlay');

            // Quick Preview actions
            if (previewBtn) {
                previewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openProjectModal(card);
                });
            }

            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openProjectModal(card);
                });
            }

            if (imageWrapper) {
                imageWrapper.addEventListener('click', (e) => {
                    e.preventDefault();
                    openProjectModal(card);
                });
            }

            // Direct Inquiry button
            if (projectLink) {
                projectLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleProjectInquiry(projectTitle);
                });
            }

            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    openProjectModal(card);
                }
            });
        });
    };

    /* --------------------------------------------------------------------------
       12. EMAILJS & CONTACT FORM CONTROLLER
       -------------------------------------------------------------------------- */
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        /**
         * =========================================================================
         * EMAILJS CONFIGURATION CREDENTIALS
         * Replace the placeholders below with your actual credentials from your
         * EmailJS Dashboard: https://dashboard.emailjs.com/
         *
         * 1. SERVICE_ID:  Found under "Email Services" (e.g. "service_xxxxxxx")
         * 2. TEMPLATE_ID: Found under "Email Templates" (e.g. "template_xxxxxxx")
         * 3. PUBLIC_KEY:  Found under "Account" > "General" (e.g. "user_xxxxxxx" or "xxxxxxx")
         * =========================================================================
         */
        const EMAILJS_CONFIG = {
            SERVICE_ID: 'YOUR_SERVICE_ID',
            TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
            PUBLIC_KEY: 'YOUR_PUBLIC_KEY'
        };

        // Check if real credentials have been provided
        const isEmailJsConfigured = () => {
            return (
                typeof emailjs !== 'undefined' &&
                EMAILJS_CONFIG.PUBLIC_KEY &&
                EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
                EMAILJS_CONFIG.SERVICE_ID &&
                EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                EMAILJS_CONFIG.TEMPLATE_ID &&
                EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'
            );
        };

        // Initialize EmailJS if public key is provided
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            try {
                emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
            } catch (err) {
                console.warn('EmailJS initialization warning:', err);
            }
        }

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = form.querySelector('.btn-submit');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const setFieldError = (input, errorMessage) => {
            input.classList.add('input-error');
            const parent = input.closest('.form-group');
            if (!parent) return;

            let errorElement = parent.querySelector('.form-error-msg');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'form-error-msg';
                parent.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        };

        const clearFieldError = (input) => {
            input.classList.remove('input-error');
            const parent = input.closest('.form-group');
            if (!parent) return;

            const errorElement = parent.querySelector('.form-error-msg');
            if (errorElement) {
                errorElement.remove();
            }
        };

        [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
            if (!input) return;
            input.addEventListener('input', () => {
                if (input.classList.contains('input-error')) {
                    clearFieldError(input);
                }
            });
            input.addEventListener('blur', () => {
                validateField(input);
            });
        });

        const validateField = (input) => {
            if (!input) return true;
            const value = input.value.trim();

            if (input === nameInput) {
                if (!value) {
                    setFieldError(input, 'Full Name is required.');
                    return false;
                } else if (value.length < 2) {
                    setFieldError(input, 'Name must be at least 2 characters.');
                    return false;
                }
            }

            if (input === emailInput) {
                if (!value) {
                    setFieldError(input, 'Email Address is required.');
                    return false;
                } else if (!emailRegex.test(value)) {
                    setFieldError(input, 'Please enter a valid email address (e.g. name@domain.com).');
                    return false;
                }
            }

            if (input === subjectInput) {
                if (!value) {
                    setFieldError(input, 'Subject is required.');
                    return false;
                } else if (value.length < 3) {
                    setFieldError(input, 'Subject must be at least 3 characters.');
                    return false;
                }
            }

            if (input === messageInput) {
                if (!value) {
                    setFieldError(input, 'Message details are required.');
                    return false;
                } else if (value.length < 10) {
                    setFieldError(input, 'Message must be at least 10 characters long.');
                    return false;
                }
            }

            clearFieldError(input);
            return true;
        };

        // Form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const existingAlert = form.querySelector('.form-feedback-message');
            if (existingAlert) existingAlert.remove();

            const isNameValid = validateField(nameInput);
            const isEmailValid = validateField(emailInput);
            const isSubjectValid = validateField(subjectInput);
            const isMessageValid = validateField(messageInput);

            if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
                const firstInvalid = form.querySelector('.input-error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending Message...';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
            }

            const senderName = nameInput.value.trim();
            const senderEmail = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            const templateParams = {
                from_name: senderName,
                name: senderName,
                from_email: senderEmail,
                reply_to: senderEmail,
                email: senderEmail,
                subject: subject,
                message: message
            };

            const resetButtonState = () => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                }
            };

            // If real EmailJS credentials have been supplied, perform live dispatch
            if (isEmailJsConfigured()) {
                emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams, EMAILJS_CONFIG.PUBLIC_KEY)
                    .then(() => {
                        resetButtonState();

                        const successAlert = document.createElement('div');
                        successAlert.className = 'form-feedback-message success';
                        successAlert.setAttribute('role', 'alert');
                        successAlert.innerHTML = `
                            <strong>Thank you, ${senderName}!</strong><br>
                            Your message has been sent successfully. I have received your email and will get back to you shortly!
                        `;

                        form.appendChild(successAlert);
                        form.reset();

                        setTimeout(() => {
                            if (successAlert.parentNode) {
                                successAlert.style.transition = 'opacity 0.5s ease';
                                successAlert.style.opacity = '0';
                                setTimeout(() => successAlert.remove(), 500);
                            }
                        }, 8000);
                    })
                    .catch((error) => {
                        resetButtonState();

                        const errorAlert = document.createElement('div');
                        errorAlert.className = 'form-feedback-message error';
                        errorAlert.setAttribute('role', 'alert');
                        errorAlert.innerHTML = `
                            <strong>Unable to Send Message</strong><br>
                            An error occurred while communicating with EmailJS: <em>${error.text || error.message || 'Transmission failed'}</em>.<br>
                            Please verify your EmailJS credentials or try again later.
                        `;

                        form.appendChild(errorAlert);
                    });
            } else {
                // Credentials are still placeholder - clearly notify the user without falsely claiming an email was sent
                setTimeout(() => {
                    resetButtonState();

                    const infoAlert = document.createElement('div');
                    infoAlert.className = 'form-feedback-message info';
                    infoAlert.setAttribute('role', 'alert');
                    infoAlert.innerHTML = `
                        <strong>EmailJS Setup Notice:</strong><br>
                        Your contact form is pre-configured with the official EmailJS browser SDK! To connect your real inbox, insert your credentials in <code>script.js</code>:
                        <ul style="margin: 8px 0 0 18px; text-align: left; font-size: 0.85rem;">
                            <li><code>SERVICE_ID</code> (from Email Services tab)</li>
                            <li><code>TEMPLATE_ID</code> (from Email Templates tab)</li>
                            <li><code>PUBLIC_KEY</code> (from Account &gt; General tab)</li>
                        </ul>
                    `;

                    form.appendChild(infoAlert);

                    setTimeout(() => {
                        if (infoAlert.parentNode) {
                            infoAlert.style.transition = 'opacity 0.5s ease';
                            infoAlert.style.opacity = '0';
                            setTimeout(() => infoAlert.remove(), 500);
                        }
                    }, 12000);
                }, 800);
            }
        });
    };

    /* --------------------------------------------------------------------------
       13. BUTTON CLICK FEEDBACK (RIPPLE EFFECT)
       -------------------------------------------------------------------------- */
    const initButtonInteractions = () => {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';

                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                btn.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    };

    /* --------------------------------------------------------------------------
       14. FLOATING BACK TO TOP BUTTON
       -------------------------------------------------------------------------- */
    const initBackToTop = () => {
        const floatingBtn = document.createElement('button');
        floatingBtn.className = 'floating-back-to-top';
        floatingBtn.setAttribute('type', 'button');
        floatingBtn.setAttribute('aria-label', 'Back to top of page');
        floatingBtn.innerHTML = '&uarr;';
        document.body.appendChild(floatingBtn);

        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                floatingBtn.classList.add('visible');
            } else {
                floatingBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        floatingBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    };

    /* --------------------------------------------------------------------------
       15. DYNAMIC COPYRIGHT YEAR
       -------------------------------------------------------------------------- */
    const initDynamicCopyright = () => {
        const timeElement = document.querySelector('.footer-copyright time');
        const currentYear = new Date().getFullYear().toString();
        if (timeElement) {
            timeElement.textContent = currentYear;
            timeElement.setAttribute('datetime', currentYear);
        } else {
            const copyrightParagraph = document.querySelector('.footer-copyright p');
            if (copyrightParagraph) {
                copyrightParagraph.innerHTML = copyrightParagraph.innerHTML.replace(/\b(20\d\d)\b/g, currentYear);
            }
        }
    };

    /* --------------------------------------------------------------------------
       16. THREE.JS ADVANCED 3D HERO WEBGL SCENE
       -------------------------------------------------------------------------- */
    const initHero3DScene = () => {
        if (prefersReducedMotion) return;
        const canvas = document.getElementById('hero-3d-canvas');
        const heroSection = document.getElementById('home');
        if (!canvas || !heroSection) return;

        // Check if Three.js is available or wait for load event
        if (typeof THREE === 'undefined') {
            window.addEventListener('load', () => {
                if (typeof THREE !== 'undefined') {
                    initHero3DScene();
                }
            });
            return;
        }

        try {
            const width = heroSection.clientWidth || window.innerWidth;
            const height = heroSection.clientHeight || window.innerHeight;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.z = 24;

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

            // Lights matching electric cyan and vibrant purple palette
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const cyanLight = new THREE.PointLight(0x00d2ff, 2.5, 60);
            cyanLight.position.set(-12, 10, 15);
            scene.add(cyanLight);

            const purpleLight = new THREE.PointLight(0x8b5cf6, 2.8, 60);
            purpleLight.position.set(12, -10, 15);
            scene.add(purpleLight);

            // 1. Central Geodesic Icosahedron (Creative Geometry Symbol)
            const icosaGeo = new THREE.IcosahedronGeometry(4.2, 1);
            const icosaMat = new THREE.MeshBasicMaterial({
                color: 0x00d2ff,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
            icosaMesh.position.set(6, 0.5, -2);
            scene.add(icosaMesh);

            // 2. Revolving Torus Knot / Ring
            const torusGeo = new THREE.TorusGeometry(3.2, 0.22, 16, 64);
            const torusMat = new THREE.MeshStandardMaterial({
                color: 0x8b5cf6,
                roughness: 0.25,
                metalness: 0.8,
                emissive: 0x3b0764,
                emissiveIntensity: 0.35
            });
            const torusMesh = new THREE.Mesh(torusGeo, torusMat);
            torusMesh.position.set(6, 0.5, -2);
            scene.add(torusMesh);

            // 3. Floating 3D Objects in background
            const floatingMeshes = [];
            const sphereMat = new THREE.MeshStandardMaterial({
                color: 0x00d2ff,
                roughness: 0.3,
                metalness: 0.7,
                emissive: 0x0284c7,
                emissiveIntensity: 0.2
            });
            const purpleMat = new THREE.MeshStandardMaterial({
                color: 0xa855f7,
                roughness: 0.3,
                metalness: 0.6
            });

            const geometries = [
                new THREE.OctahedronGeometry(1.2),
                new THREE.TetrahedronGeometry(1.0),
                new THREE.SphereGeometry(0.8, 20, 20),
                new THREE.BoxGeometry(1.2, 1.2, 1.2),
                new THREE.OctahedronGeometry(0.9)
            ];

            const coords = [
                { x: -14, y: 7, z: -8 },
                { x: -10, y: -6, z: -5 },
                { x: 13, y: 8, z: -10 },
                { x: 14, y: -7, z: -6 },
                { x: -5, y: 9, z: -12 }
            ];

            coords.forEach((coord, idx) => {
                const mesh = new THREE.Mesh(geometries[idx % geometries.length], idx % 2 === 0 ? sphereMat : purpleMat);
                mesh.position.set(coord.x, coord.y, coord.z);
                scene.add(mesh);
                floatingMeshes.push({
                    mesh: mesh,
                    rotSpeedX: (Math.random() - 0.5) * 0.012,
                    rotSpeedY: (Math.random() - 0.5) * 0.012,
                    baseY: coord.y,
                    floatSpeed: 0.0015 + Math.random() * 0.001,
                    phase: Math.random() * Math.PI * 2
                });
            });

            // 4. Ambient 3D Particle Starfield
            const isMobile = window.innerWidth <= 768;
            const particleCount = isMobile ? 60 : 150;
            const particleGeo = new THREE.BufferGeometry();
            const particlePos = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i += 3) {
                particlePos[i] = (Math.random() - 0.5) * 55;
                particlePos[i + 1] = (Math.random() - 0.5) * 35;
                particlePos[i + 2] = (Math.random() - 0.5) * 30;
            }
            particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
            const particleMat = new THREE.PointsMaterial({
                color: 0x38bdf8,
                size: 0.28,
                transparent: true,
                opacity: 0.65
            });
            const particleSystem = new THREE.Points(particleGeo, particleMat);
            scene.add(particleSystem);

            // Mouse Movement Interaction with Lerp
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;

            const onMouseMove = (e) => {
                const rect = heroSection.getBoundingClientRect();
                if (e.clientY < rect.top || e.clientY > rect.bottom) return;
                targetX = ((e.clientX / window.innerWidth) - 0.5) * 2.8;
                targetY = ((e.clientY / window.innerHeight) - 0.5) * -2.8;
            };
            window.addEventListener('mousemove', onMouseMove, { passive: true });

            // IntersectionObserver: Pause when out of view (Performance)
            let isVisible = true;
            let animId = null;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !animId) {
                        render();
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(heroSection);

            let clock = new THREE.Clock();

            const render = () => {
                if (!isVisible) {
                    animId = null;
                    return;
                }

                const elapsed = clock.getElapsedTime();

                // Smooth camera interpolation
                mouseX += (targetX - mouseX) * 0.05;
                mouseY += (targetY - mouseY) * 0.05;
                camera.position.x = mouseX;
                camera.position.y = mouseY;
                camera.lookAt(scene.position);

                // Rotate central geometries
                icosaMesh.rotation.x += 0.003;
                icosaMesh.rotation.y += 0.005;
                torusMesh.rotation.x += 0.006;
                torusMesh.rotation.y -= 0.004;

                // Animate floating items
                floatingMeshes.forEach((item) => {
                    item.mesh.rotation.x += item.rotSpeedX;
                    item.mesh.rotation.y += item.rotSpeedY;
                    item.mesh.position.y = item.baseY + Math.sin(elapsed * 1.5 + item.phase) * 0.6;
                });

                // Particle orbit
                particleSystem.rotation.y += 0.0006;

                renderer.render(scene, camera);
                animId = requestAnimationFrame(render);
            };

            render();

            // Resize listener
            window.addEventListener('resize', () => {
                const w = heroSection.clientWidth;
                const h = heroSection.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }, { passive: true });

        } catch (err) {
            console.warn('Three.js initialization skipped:', err);
        }
    };

    /* --------------------------------------------------------------------------
       17. 3D HERO MOUSE PARALLAX & PROFILE CARD TILT
       -------------------------------------------------------------------------- */
    const initHero3DParallax = () => {
        if (prefersReducedMotion || window.innerWidth <= 768) return;
        const heroSection = document.getElementById('home');
        const tiltCard = document.getElementById('hero-tilt-card');
        const depthElements = document.querySelectorAll('#home [data-depth]');
        if (!heroSection) return;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });

        const updateParallax = () => {
            mouseX += (targetX - mouseX) * 0.08;
            mouseY += (targetY - mouseY) * 0.08;

            depthElements.forEach((el) => {
                const depth = parseFloat(el.getAttribute('data-depth')) || 0.1;
                const moveX = mouseX * depth * 70;
                const moveY = mouseY * depth * 70;
                el.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
            });

            if (tiltCard) {
                const rotateY = mouseX * 16;
                const rotateX = -mouseY * 16;
                tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
            }

            requestAnimationFrame(updateParallax);
        };

        updateParallax();
    };

    /* --------------------------------------------------------------------------
       18. 3D PERSPECTIVE CARD TILT WITH SPECULAR GLARE
       -------------------------------------------------------------------------- */
    const init3DCardTilt = () => {
        if (prefersReducedMotion || window.innerWidth <= 768) return;
        const cards = document.querySelectorAll('.service-card, .project-card, .hero-skill-card, .testimonial-card, .pricing-card, .booking-info-card');

        cards.forEach((card) => {
            // Ensure glare overlay exists
            let glare = card.querySelector('.card-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'card-glare';
                glare.setAttribute('aria-hidden', 'true');
                card.appendChild(glare);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -7;
                const rotateY = ((x - centerX) / centerX) * 7;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
                glare.style.setProperty('--glare-x', `${(x / rect.width * 100).toFixed(1)}%`);
                glare.style.setProperty('--glare-y', `${(y / rect.height * 100).toFixed(1)}%`);
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    };

    /* --------------------------------------------------------------------------
       19. MAGNETIC HOVER BUTTONS
       -------------------------------------------------------------------------- */
    const initMagneticButtons = () => {
        if (prefersReducedMotion || window.innerWidth <= 768) return;
        const buttons = document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-secondary, .btn-whatsapp');

        buttons.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            }, { passive: true });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    };

    /* --------------------------------------------------------------------------
       20. CLIENT TESTIMONIALS SLIDER & DATA CONTROLLER (STEP 19)
       -------------------------------------------------------------------------- */
    /**
     * CLIENT TESTIMONIALS DATA STORE (Task 8: Easy way to add new testimonials later)
     * ==============================================================================
     * How to add a real testimonial later:
     * When you receive genuine client reviews, simply add an object to this list or
     * edit the HTML markup inside #testimonials-track directly!
     * 
     * Template:
     * {
     *     name: "Client Full Name",
     *     role: "Designation / Company",
     *     project: "Project Title (e.g. k.bitlogics Logo Design)",
     *     feedback: "Client review text...",
     *     initials: "JD", // or photo: "images/client.jpg"
     *     rating: 5,      // Star rating (1-5), or null if omitted
     *     isPlaceholder: false // Set to false when review is genuine & verified
     * }
     */
    const initTestimonialsSlider = () => {
        const sliderTrack = document.getElementById('testimonials-track');
        const prevBtn = document.getElementById('testimonial-prev-btn');
        const nextBtn = document.getElementById('testimonial-next-btn');
        const dotsContainer = document.getElementById('testimonial-dots');
        const slides = document.querySelectorAll('.testimonial-slide');

        if (!sliderTrack || !slides.length) return;

        let currentIndex = 0;
        let slideInterval = null;
        const totalSlides = slides.length;

        // Dynamic pagination dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `testimonial-dot ${idx === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Navigate to testimonial slide ${idx + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(idx);
                    resetAutoplay();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, idx) => {
                const isActive = idx === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        };

        const updateSliderPosition = () => {
            const isDesktop = window.innerWidth >= 1024;
            const percentage = isDesktop && totalSlides > 1 ? 50 : 100;
            const maxIndex = Math.max(0, isDesktop ? totalSlides - 2 : totalSlides - 1);
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            sliderTrack.style.transform = `translateX(-${currentIndex * percentage}%)`;
            updateDots();
        };

        const goToSlide = (idx) => {
            const isDesktop = window.innerWidth >= 1024;
            const maxIndex = Math.max(0, isDesktop ? totalSlides - 2 : totalSlides - 1);
            currentIndex = Math.max(0, Math.min(idx, maxIndex));
            updateSliderPosition();
        };

        const nextSlide = () => {
            const isDesktop = window.innerWidth >= 1024;
            const maxIndex = Math.max(0, isDesktop ? totalSlides - 2 : totalSlides - 1);
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSliderPosition();
        };

        const prevSlide = () => {
            const isDesktop = window.innerWidth >= 1024;
            const maxIndex = Math.max(0, isDesktop ? totalSlides - 2 : totalSlides - 1);
            if (currentIndex <= 0) {
                currentIndex = maxIndex;
            } else {
                currentIndex--;
            }
            updateSliderPosition();
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }

        // Touch Swipe functionality for mobile/tablet devices
        let touchStartX = 0;
        let touchEndX = 0;

        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 40;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
                resetAutoplay();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
                resetAutoplay();
            }
        }, { passive: true });

        // Gentle Autoplay (pauses on mouse hover or reduced-motion)
        const startAutoplay = () => {
            if (prefersReducedMotion) return;
            stopAutoplay();
            slideInterval = setInterval(nextSlide, 7000);
        };

        const stopAutoplay = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        };

        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        const sliderWrapper = document.getElementById('testimonials-slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', stopAutoplay);
            sliderWrapper.addEventListener('mouseleave', startAutoplay);
        }

        window.addEventListener('resize', updateSliderPosition, { passive: true });

        updateSliderPosition();
        startAutoplay();
    };

    /* --------------------------------------------------------------------------
       21. PRICING PACKAGE INQUIRY & CONTACT FORM INTEGRATION (STEP 20)
       -------------------------------------------------------------------------- */
    const initPricingInteractions = () => {
        const packageButtons = document.querySelectorAll('.btn-package, .btn-custom-quote');
        const subjectInput = document.getElementById('subject');
        const contactSection = document.getElementById('contact');
        const header = document.getElementById('header');

        if (!packageButtons.length) return;

        packageButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const packageName = btn.getAttribute('data-package') || 'Graphic Design Package';

                // Pre-fill contact form subject field
                if (subjectInput) {
                    subjectInput.value = `Inquiry regarding: ${packageName}`;
                    subjectInput.classList.remove('input-error');
                }

                // Smooth scroll to contact section
                if (contactSection) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const offsetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });

                    // Auto-focus name field for instant typing
                    setTimeout(() => {
                        const nameInput = document.getElementById('name');
                        if (nameInput) nameInput.focus();
                    }, 650);
                }

                // Provide user feedback toast
                if (typeof showToast === 'function') {
                    showToast(`Selected "${packageName}". Contact form pre-filled!`);
                }
            });
        });
    };

    /* --------------------------------------------------------------------------
       22. CLIENT BOOKING & CONSULTATION SYSTEM (STEP 21)
       -------------------------------------------------------------------------- */
    const initBookingSystem = () => {
        const bookingForm = document.getElementById('booking-form');
        const confirmationBox = document.getElementById('booking-confirmation');
        const submitBtn = document.getElementById('btn-submit-booking');
        const btnBookAnother = document.getElementById('btn-book-another');
        const recapContainer = document.getElementById('confirmation-recap');

        if (!bookingForm) return;

        const nameInput = document.getElementById('booking-name');
        const emailInput = document.getElementById('booking-email');
        const projectTypeSelect = document.getElementById('booking-project-type');
        const dateInput = document.getElementById('booking-date');
        const timeSelect = document.getElementById('booking-time');
        const descTextarea = document.getElementById('booking-description');

        // Set minimum date to tomorrow dynamically to prevent past date selection (Task 5)
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            dateInput.min = `${yyyy}-${mm}-${dd}`;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation helpers (Task 8)
        const setFieldError = (input, errorMessage) => {
            input.classList.add('input-error');
            const parent = input.closest('.form-group');
            if (!parent) return;

            let errorElement = parent.querySelector('.form-error-msg');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'form-error-msg';
                parent.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        };

        const clearFieldError = (input) => {
            input.classList.remove('input-error');
            const parent = input.closest('.form-group');
            if (!parent) return;

            const errorElement = parent.querySelector('.form-error-msg');
            if (errorElement) {
                errorElement.remove();
            }
        };

        // Real-time clearance on user input
        [nameInput, emailInput, descTextarea].forEach((input) => {
            if (!input) return;
            input.addEventListener('input', () => {
                if (input.classList.contains('input-error')) {
                    clearFieldError(input);
                }
            });
            input.addEventListener('blur', () => {
                validateField(input);
            });
        });

        [projectTypeSelect, dateInput, timeSelect].forEach((select) => {
            if (!select) return;
            select.addEventListener('change', () => {
                clearFieldError(select);
            });
            select.addEventListener('blur', () => {
                validateField(select);
            });
        });

        const validateField = (input) => {
            if (!input) return true;
            const value = input.value.trim();

            if (input === nameInput) {
                if (!value) {
                    setFieldError(input, 'Full Name is required for consultation.');
                    return false;
                } else if (value.length < 2) {
                    setFieldError(input, 'Please enter a valid name (at least 2 characters).');
                    return false;
                }
            }

            if (input === emailInput) {
                if (!value) {
                    setFieldError(input, 'Email Address is required for meeting invite.');
                    return false;
                } else if (!emailRegex.test(value)) {
                    setFieldError(input, 'Please enter a valid email address (e.g. name@domain.com).');
                    return false;
                }
            }

            if (input === projectTypeSelect) {
                if (!value) {
                    setFieldError(input, 'Please choose a consultation project category.');
                    return false;
                }
            }

            if (input === dateInput) {
                if (!value) {
                    setFieldError(input, 'Please select your preferred date.');
                    return false;
                }
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    setFieldError(input, 'Date cannot be in the past.');
                    return false;
                }
            }

            if (input === timeSelect) {
                if (!value) {
                    setFieldError(input, 'Please select a preferred time slot.');
                    return false;
                }
            }

            if (input === descTextarea) {
                if (!value) {
                    setFieldError(input, 'Please provide a brief description of your project.');
                    return false;
                } else if (value.length < 15) {
                    setFieldError(input, 'Description should be at least 15 characters to prepare properly.');
                    return false;
                }
            }

            clearFieldError(input);
            return true;
        };

        // Handle Booking Submission (Task 9 & Constraints)
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all 6 fields
            const isNameValid = validateField(nameInput);
            const isEmailValid = validateField(emailInput);
            const isProjectValid = validateField(projectTypeSelect);
            const isDateValid = validateField(dateInput);
            const isTimeValid = validateField(timeSelect);
            const isDescValid = validateField(descTextarea);

            if (!isNameValid || !isEmailValid || !isProjectValid || !isDateValid || !isTimeValid || !isDescValid) {
                const firstInvalid = bookingForm.querySelector('.input-error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            // Button loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting Request...';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
            }

            const clientName = nameInput.value.trim();
            const clientEmail = emailInput.value.trim();
            const projectType = projectTypeSelect.value;
            const chosenDate = dateInput.value;
            const chosenTime = timeSelect.value;
            const description = descTextarea.value.trim();

            // Format date for display
            let formattedDate = chosenDate;
            try {
                const dateObj = new Date(chosenDate + 'T00:00:00');
                formattedDate = dateObj.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (err) {
                formattedDate = chosenDate;
            }

            // Simulate realistic network delay
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Request Consultation Session \u2192';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                }

                // Populate Recap Grid (Task 9)
                if (recapContainer) {
                    recapContainer.innerHTML = `
                        <div class="recap-item">
                            <span class="recap-label">Client Name:</span>
                            <span class="recap-val">${clientName}</span>
                        </div>
                        <div class="recap-item">
                            <span class="recap-label">Client Email:</span>
                            <span class="recap-val">${clientEmail}</span>
                        </div>
                        <div class="recap-item">
                            <span class="recap-label">Consultation Category:</span>
                            <span class="recap-val">${projectType}</span>
                        </div>
                        <div class="recap-item">
                            <span class="recap-label">Requested Date:</span>
                            <span class="recap-val">${formattedDate}</span>
                        </div>
                        <div class="recap-item recap-item-full">
                            <span class="recap-label">Preferred Time Slot:</span>
                            <span class="recap-val">${chosenTime}</span>
                        </div>
                        <div class="recap-item recap-item-full">
                            <span class="recap-label">Project Summary:</span>
                            <span class="recap-val" style="font-size: 0.88rem; color: #94a3b8;">${description}</span>
                        </div>
                    `;
                }

                // Switch view: Hide form, Show confirmation
                bookingForm.style.display = 'none';
                if (confirmationBox) {
                    confirmationBox.style.display = 'flex';
                    confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                // Reset form fields for subsequent bookings
                bookingForm.reset();
            }, 850);
        });

        // "Book Another Session" handler
        if (btnBookAnother) {
            btnBookAnother.addEventListener('click', () => {
                if (confirmationBox) {
                    confirmationBox.style.display = 'none';
                }
                if (bookingForm) {
                    bookingForm.style.display = 'flex';
                    bookingForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    if (nameInput) nameInput.focus();
                }
            });
        }
    };

    /* --------------------------------------------------------------------------
       23. PROFESSIONAL CV & RESUME SYSTEM (STEP 23)
       -------------------------------------------------------------------------- */
    const initCVSystem = () => {
        const previewBtn = document.getElementById('btn-preview-cv');
        const printBtn = document.getElementById('btn-print-cv');
        const modalPrintBtn = document.getElementById('btn-modal-print');
        const cvModal = document.getElementById('cv-modal');
        const modalBackdrop = document.getElementById('cv-modal-backdrop');
        const closeBtn = document.getElementById('btn-close-cv-modal');
        const modalBody = document.getElementById('cv-modal-body');
        const cvDocument = document.getElementById('cv-template-document');

        // Print CV triggers window.print() (Task 10)
        const triggerPrint = (e) => {
            if (e) e.preventDefault();
            window.print();
        };

        if (printBtn) printBtn.addEventListener('click', triggerPrint);
        if (modalPrintBtn) modalPrintBtn.addEventListener('click', triggerPrint);

        // Preview CV in Modal (Task 3)
        const openCVModal = () => {
            if (!cvModal || !cvDocument) return;

            // Populate modal body with cloned CV document
            if (modalBody) {
                modalBody.innerHTML = '';
                const clone = cvDocument.cloneNode(true);
                clone.removeAttribute('id'); // Prevent duplicate IDs
                modalBody.appendChild(clone);
            }

            cvModal.style.display = 'flex';
            // Force reflow for smooth transition
            cvModal.offsetHeight;
            cvModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeCVModal = () => {
            if (!cvModal) return;
            cvModal.classList.remove('active');
            setTimeout(() => {
                cvModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        if (previewBtn) {
            previewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openCVModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeCVModal();
            });
        }

        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', closeCVModal);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
                closeCVModal();
            }
        });
    };

    /* --------------------------------------------------------------------------
       24. STUDIO FAQ ACCORDION CONTROLLER (STEP 25)
       -------------------------------------------------------------------------- */
    const initFAQAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach((item) => {
            const questionBtn = item.querySelector('.faq-question');
            if (!questionBtn) return;

            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close other open FAQ items for clean single-expand UX
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    /* --------------------------------------------------------------------------
       INITIALIZE ALL MODULES
       -------------------------------------------------------------------------- */
    initPageLoader();
    initTextTyping();
    initCustomCursor();
    initParticleCanvas();
    initMobileNav();
    initStickyHeader();
    initSmoothScrolling();
    initScrollSpy();
    initScrollAnimations();
    initSkillAnimations();
    initProjectInteractions();
    initContactForm();
    initButtonInteractions();
    initBackToTop();
    initDynamicCopyright();
    initHero3DScene();
    initHero3DParallax();
    init3DCardTilt();
    initMagneticButtons();
    initTestimonialsSlider();
    initPricingInteractions();
    initBookingSystem();
    initCVSystem();
    initFAQAccordion();

});
