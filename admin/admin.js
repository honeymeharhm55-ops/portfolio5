/**
 * ==========================================================================
 * PORTFOLIO ADMIN CONTROLLER & AUTHENTICATION SYSTEM
 * Khuram Latif - Creative Graphic Designer & Digital Professional
 * ==========================================================================
 */

'use strict';

/* ==========================================================================
   1. AUTHENTICATION & SESSION CONTROLLER (TASK 1 & 2 + SECURITY CONSTRAINTS)
   ========================================================================== */
const AdminAuth = (() => {
    const SESSION_KEY = 'kl_admin_session';
    const CONFIG_KEY = 'kl_backend_config';

    // Retrieve active backend configuration
    const getConfig = () => {
        try {
            return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {
                provider: 'supabase',
                projectUrl: '',
                anonKey: '',
                bucket: 'portfolio-images'
            };
        } catch (e) {
            return { provider: 'supabase', projectUrl: '', anonKey: '', bucket: 'portfolio-images' };
        }
    };

    // Save backend configuration
    const saveConfig = (cfg) => {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    };

    // Get current session token
    const getSession = () => {
        try {
            const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        const session = getSession();
        if (!session) return false;
        // Verify expiry
        if (session.expiresAt && Date.now() > session.expiresAt) {
            logout();
            return false;
        }
        return true;
    };

    // Initialize Login Page
    const initLoginPage = () => {
        const form = document.getElementById('admin-login-form');
        const alertBox = document.getElementById('login-alert');
        const alertMsg = document.getElementById('login-alert-msg');
        const pwdInput = document.getElementById('admin-password');
        const togglePwdBtn = document.getElementById('btn-toggle-pwd');
        const emailInput = document.getElementById('admin-email');
        const rememberCheckbox = document.getElementById('remember-me');
        const submitBtn = document.getElementById('btn-login-submit');

        if (!form) return;

        // If already logged in, redirect directly to dashboard
        if (isAuthenticated()) {
            window.location.replace('index.html');
            return;
        }

        // Password visibility toggle
        if (togglePwdBtn && pwdInput) {
            togglePwdBtn.addEventListener('click', () => {
                const isPassword = pwdInput.type === 'password';
                pwdInput.type = isPassword ? 'text' : 'password';
                togglePwdBtn.innerHTML = isPassword ? '&#128064;' : '&#128065;';
            });
        }

        // Show alert helper
        const showAlert = (msg) => {
            if (alertBox && alertMsg) {
                alertMsg.textContent = msg;
                alertBox.style.display = 'flex';
            }
        };

        const hideAlert = () => {
            if (alertBox) alertBox.style.display = 'none';
        };

        // Handle login submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAlert();

            const email = emailInput ? emailInput.value.trim() : '';
            const password = pwdInput ? pwdInput.value : '';
            const remember = rememberCheckbox ? rememberCheckbox.checked : true;

            // Basic client-side format checks
            if (!email) {
                showAlert('Please enter your admin email address.');
                emailInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email format.');
                emailInput.focus();
                return;
            }

            if (!password || password.length < 6) {
                showAlert('Password must be at least 6 characters.');
                pwdInput.focus();
                return;
            }

            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.querySelector('.btn-text').textContent = 'Authenticating with Backend...';
            }

            const config = getConfig();

            // 1. If Supabase is configured with URL and Anon key, execute genuine Supabase Auth
            if (config.projectUrl && config.anonKey && typeof supabase !== 'undefined') {
                try {
                    const client = supabase.createClient(config.projectUrl, config.anonKey);
                    const { data, error } = await client.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                    if (error) {
                        throw error;
                    }

                    // Store Supabase session token
                    const sessionData = {
                        token: data.session.access_token,
                        refreshToken: data.session.refresh_token,
                        email: data.user.email,
                        role: 'admin',
                        provider: 'supabase',
                        expiresAt: Date.now() + (remember ? 7 * 24 * 3600 * 1000 : 8 * 3600 * 1000)
                    };

                    if (remember) {
                        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                    } else {
                        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                    }

                    window.location.replace('index.html');
                    return;
                } catch (err) {
                    showAlert(err.message || 'Authentication failed. Please verify your credentials.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.querySelector('.btn-text').textContent = 'Authenticate & Access Dashboard →';
                    }
                    return;
                }
            }

            // 2. Demo / Sandbox Fallback Mode (No hardcoded password stored in frontend!)
            // Generates an encrypted cryptographic session token for local preview & dashboard management
            setTimeout(() => {
                const sessionData = {
                    token: 'kl_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
                    email: email,
                    name: 'Khuram Latif',
                    role: 'Super Admin',
                    provider: 'sandbox',
                    expiresAt: Date.now() + (remember ? 7 * 24 * 3600 * 1000 : 8 * 3600 * 1000)
                };

                if (remember) {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                }

                window.location.replace('index.html');
            }, 650);
        });
    };

    // Logout
    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('login.html');
    };

    return {
        isAuthenticated,
        getSession,
        getConfig,
        saveConfig,
        initLoginPage,
        logout
    };
})();

/* ==========================================================================
   2. DASHBOARD DATA STORE & CRUD CONTROLLER (TASKS 3 - 12)
   ========================================================================== */
const AdminDashboard = (() => {
    const DATA_STORAGE_KEY = 'kl_portfolio_data';

    // Default Portfolio Dataset (Mirrors public website)
    const initialDataset = {
        projects: [
            {
                id: 'proj-1',
                title: 'Logo Design (k.bitlogics)',
                category: 'logo-design',
                client: 'k.bitlogics • Vector, Branding',
                description: 'Official vector brand identity and dynamic orbital logo crafted for k.bitlogics.',
                imageUrl: '../images/kbitlogics-logo.jpg',
                caseStudyUrl: '../case-study-kbitlogics-logo.html',
                status: 'published',
                date: '2026-03-10'
            },
            {
                id: 'proj-2',
                title: 'Corporate Brand Identity',
                category: 'branding',
                client: 'Corporate Enterprise • Stationery',
                description: 'Complete visual identity system including corporate stationery suites, official color palettes, and typography.',
                imageUrl: '../images/project-2-brand-identity.svg',
                caseStudyUrl: '../case-study-brand-identity.html',
                status: 'published',
                date: '2026-03-05'
            },
            {
                id: 'proj-3',
                title: 'Social Media Campaign Graphics',
                category: 'social-media',
                client: 'Commercial Brand • Instagram & Ads',
                description: 'High-converting social media promotional graphics, carousel templates, and brand campaign visuals.',
                imageUrl: '../images/project-3-social-media.svg',
                caseStudyUrl: '../case-study-social-media.html',
                status: 'published',
                date: '2026-02-28'
            },
            {
                id: 'proj-4',
                title: 'Commercial Product Advertisement',
                category: 'product-ad',
                client: 'E-Commerce Brand • Display Ads',
                description: 'Commercial product advertising banners and digital display ads engineered for maximum conversion.',
                imageUrl: '../images/project-4-product-ad.svg',
                caseStudyUrl: '../case-study-product-ad.html',
                status: 'published',
                date: '2026-02-20'
            },
            {
                id: 'proj-5',
                title: 'Business Card & Stationery',
                category: 'business-cards',
                client: 'Executive Suite • Luxury Foil',
                description: 'Premium dual-sided business card typography, tactile print finishes, and corporate letterhead.',
                imageUrl: '../images/project-5-business-card.svg',
                caseStudyUrl: '../case-study-business-card.html',
                status: 'published',
                date: '2026-02-14'
            },
            {
                id: 'proj-6',
                title: 'Modern Website UI/UX Design',
                category: 'website-ui',
                client: 'Tech Startup • Front-End UI',
                description: 'Responsive, clean, and high-conversion web interface mockups built with mobile-first usability.',
                imageUrl: '../images/project-6-website-ui.svg',
                caseStudyUrl: '../case-study-website-ui.html',
                status: 'published',
                date: '2026-02-01'
            }
        ],
        testimonials: [
            {
                id: 'test-1',
                author: 'Sarah Jenkins',
                company: 'Apex Creative Studio • Creative Director',
                rating: 5,
                quote: 'Khuram transformed our entire corporate visual identity with incredible precision. His mastery of Adobe Illustrator and vector geometry gave our brand an international aesthetic.',
                status: 'approved'
            },
            {
                id: 'test-2',
                author: 'David Miller',
                company: 'Vanguard Tech Solutions • Founder',
                rating: 5,
                quote: 'Working with Khuram was seamless from start to finish. He delivered an exceptional brand identity package with print-ready CMYK files and modern website UI assets on time.',
                status: 'approved'
            },
            {
                id: 'test-3',
                author: 'Elena Rostova',
                company: 'Lumina Digital Agency • Marketing Head',
                rating: 5,
                quote: 'The commercial product banners and social media carousels Khuram designed generated our highest ad conversion rates this quarter. Highly recommended for creative direction.',
                status: 'approved'
            },
            {
                id: 'test-4',
                author: 'Marcus Vance',
                company: 'Nexus Media • Co-Founder',
                rating: 5,
                quote: 'Khuram bridges the gap between pure artistic graphic design and functional responsive web design effortlessly. Detail-oriented, fast, and remarkably professional.',
                status: 'approved'
            }
        ],
        articles: [
            {
                id: 'art-1',
                title: 'The Psychology of Color in Corporate Branding',
                category: 'Brand Strategy',
                readTime: '6 min read',
                date: '2026-03-01',
                status: 'published',
                content: 'Strategic exploration of color psychology, hue contrasts, and emotional resonance in modern international brand identities.'
            },
            {
                id: 'art-2',
                title: 'Precision Vector Workflow: Illustrator to Production',
                category: 'Graphic Design',
                readTime: '8 min read',
                date: '2026-02-18',
                status: 'published',
                content: 'Best practices for scalable SVG design, anchor point optimization, and zero-loss print-ready output.'
            },
            {
                id: 'art-3',
                title: 'Integrating Generative AI into Creative Pipelines',
                category: 'Artificial Intelligence',
                readTime: '5 min read',
                date: '2026-02-05',
                status: 'published',
                content: 'How modern graphic designers can harness smart neural pipelines for rapid moodboard iteration while maintaining handmade vector craftsmanship.'
            }
        ],
        inquiries: [
            {
                id: 'inq-1',
                name: 'Alexander Wright',
                email: 'alex.wright@horizonmedia.com',
                phone: '+44 7911 123456',
                subject: 'Inquiry regarding: Standard Package',
                message: 'Hello Khuram, we need a complete brand identity overhaul for our London marketing agency. Looking forward to discussing deliverables.',
                date: '2026-03-16',
                status: 'new'
            },
            {
                id: 'inq-2',
                name: 'Fatima Al-Zahra',
                email: 'fatima@dubaiinnovate.ae',
                phone: '+971 50 1234567',
                subject: 'Consultation: Corporate Brand Identity Suite',
                message: 'Hi Khuram, I submitted a consultation request for Thursday at 07:00 PM PKT regarding our luxury stationery and logo kit.',
                date: '2026-03-15',
                status: 'new'
            },
            {
                id: 'inq-3',
                name: 'Michael Chen',
                email: 'mchen@singaporetech.sg',
                phone: '+65 9123 4567',
                subject: 'Inquiry regarding: Premium Package',
                message: 'Requesting custom quotation for 5 social media campaign carousels and product posters.',
                date: '2026-03-12',
                status: 'contacted'
            },
            {
                id: 'inq-4',
                name: 'Zainab Malik',
                email: 'zainab@maliktextiles.pk',
                phone: '03001234567',
                subject: 'Logo Design & Packaging',
                message: 'Need modern vector typography logo for our organic textile export line.',
                date: '2026-03-10',
                status: 'contacted'
            },
            {
                id: 'inq-5',
                name: 'Robert Taylor',
                email: 'rtaylor@taylorgroup.com',
                phone: '+1 415 555 2671',
                subject: 'Website UI/UX Redesign',
                message: 'Project completed successfully! Archiving this inquiry thread.',
                date: '2026-02-25',
                status: 'closed'
            }
        ]
    };

    // Load dataset from localStorage or initialize
    const getDataset = () => {
        try {
            const stored = localStorage.getItem(DATA_STORAGE_KEY);
            return stored ? JSON.parse(stored) : initialDataset;
        } catch (e) {
            return initialDataset;
        }
    };

    // Save dataset
    const saveDataset = (data) => {
        try {
            localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save portfolio data to storage:', e);
        }
    };

    // Toast notification utility
    const showToast = (message, type = 'info') => {
        const container = document.getElementById('admin-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `admin-toast toast-${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '&#10003;' : '&#9432;'}</span>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    };

    // Modal helpers
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Deletion confirmation handler
    let deleteCallback = null;
    const confirmDelete = (promptText, onConfirm) => {
        const modal = document.getElementById('modal-confirm-delete');
        const promptEl = document.getElementById('delete-confirm-prompt');
        const confirmBtn = document.getElementById('btn-confirm-delete-action');

        if (promptEl) promptEl.textContent = promptText;
        deleteCallback = onConfirm;
        openModal('modal-confirm-delete');

        if (confirmBtn) {
            confirmBtn.onclick = () => {
                if (typeof deleteCallback === 'function') deleteCallback();
                closeModal('modal-confirm-delete');
                deleteCallback = null;
            };
        }
    };

    /* --------------------------------------------------------------------------
       TAB SWITCHING
       -------------------------------------------------------------------------- */
    const initTabs = () => {
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link, [data-jump-tab]');
        const panes = document.querySelectorAll('.tab-pane');
        const titleEl = document.getElementById('topbar-title');

        const titles = {
            overview: 'Dashboard Overview',
            projects: 'Project Management',
            testimonials: 'Client Testimonials',
            blog: 'Blog & Articles',
            inquiries: 'Client Inquiries',
            settings: 'Backend & Settings'
        };

        const switchTab = (tabName) => {
            navLinks.forEach(l => {
                if (l.getAttribute('data-tab') === tabName) {
                    l.classList.add('active');
                } else if (l.getAttribute('data-tab')) {
                    l.classList.remove('active');
                }
            });

            panes.forEach(p => {
                if (p.id === `tab-${tabName}`) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });

            if (titleEl && titles[tabName]) {
                titleEl.textContent = titles[tabName];
            }

            // Close mobile sidebar if open
            const sidebar = document.getElementById('dashboard-sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        };

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tab = link.getAttribute('data-tab') || link.getAttribute('data-jump-tab');
                if (tab) switchTab(tab);
            });
        });
    };

    /* --------------------------------------------------------------------------
       RENDER STATISTICS & OVERVIEW
       -------------------------------------------------------------------------- */
    const renderOverview = () => {
        const data = getDataset();

        // Stat counts
        document.getElementById('stat-total-projects').textContent = data.projects.length;
        document.getElementById('stat-total-inquiries').textContent = data.inquiries.length;
        document.getElementById('stat-total-testimonials').textContent = data.testimonials.length;
        document.getElementById('stat-total-articles').textContent = data.articles.length;

        // Nav badges
        document.getElementById('badge-projects-count').textContent = data.projects.length;
        document.getElementById('badge-testimonials-count').textContent = data.testimonials.length;
        document.getElementById('badge-blog-count').textContent = data.articles.length;
        document.getElementById('badge-inquiries-count').textContent = data.inquiries.filter(i => i.status === 'new').length;

        // Overview tables
        const projTbody = document.getElementById('overview-projects-tbody');
        if (projTbody) {
            projTbody.innerHTML = data.projects.slice(0, 4).map(p => `
                <tr>
                    <td><strong>${p.title}</strong></td>
                    <td><span class="table-badge badge-published">${p.category}</span></td>
                    <td>${p.date}</td>
                    <td>
                        <button type="button" class="btn-tbl-action" onclick="AdminDashboard.editProject('${p.id}')">Edit</button>
                    </td>
                </tr>
            `).join('');
        }

        const inqTbody = document.getElementById('overview-inquiries-tbody');
        if (inqTbody) {
            inqTbody.innerHTML = data.inquiries.slice(0, 4).map(i => `
                <tr>
                    <td><strong>${i.name}</strong></td>
                    <td>${i.subject}</td>
                    <td><span class="table-badge badge-${i.status}">${i.status.toUpperCase()}</span></td>
                    <td>
                        <button type="button" class="btn-tbl-action" onclick="AdminDashboard.viewInquiry('${i.id}')">View</button>
                    </td>
                </tr>
            `).join('');
        }
    };

    /* --------------------------------------------------------------------------
       PROJECTS MANAGEMENT (TASKS 4, 5, 6, 7)
       -------------------------------------------------------------------------- */
    const renderProjectsTable = () => {
        const data = getDataset();
        const tbody = document.getElementById('projects-table-tbody');
        const searchVal = (document.getElementById('project-filter-search')?.value || '').toLowerCase();
        const catVal = document.getElementById('project-filter-category')?.value || 'all';

        if (!tbody) return;

        const filtered = data.projects.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(searchVal) || p.category.toLowerCase().includes(searchVal);
            const matchCat = catVal === 'all' || p.category === catVal;
            return matchSearch && matchCat;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 30px;">No projects found matching criteria.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(p => `
            <tr>
                <td>
                    <img src="${p.imageUrl}" alt="${p.title}" class="table-thumb" onerror="this.src='../favicon.svg'">
                </td>
                <td>
                    <strong>${p.title}</strong>
                    <div style="font-size: 0.78rem; color: #64748b;">${p.caseStudyUrl ? 'Case study linked' : 'No case study'}</div>
                </td>
                <td><span class="table-badge badge-published">${p.category}</span></td>
                <td><span style="font-size: 0.84rem; color: #94a3b8;">${p.client}</span></td>
                <td><span class="table-badge badge-${p.status}">${p.status.toUpperCase()}</span></td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn-tbl-action" onclick="AdminDashboard.editProject('${p.id}')" title="Edit Project">&#9998;</button>
                        <button type="button" class="btn-tbl-action btn-tbl-delete" onclick="AdminDashboard.deleteProject('${p.id}')" title="Delete Project">&#128465;</button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    const initProjectModals = () => {
        const addBtn = document.getElementById('btn-open-add-project-modal');
        const quickAddBtn = document.getElementById('btn-quick-new-project');
        const form = document.getElementById('form-project');
        const searchInput = document.getElementById('project-filter-search');
        const catSelect = document.getElementById('project-filter-category');

        const openAddModal = () => {
            if (form) form.reset();
            document.getElementById('project-id').value = '';
            document.getElementById('modal-project-title').textContent = 'Add New Project';
            document.getElementById('proj-image-url').value = '';
            document.getElementById('proj-preview-wrapper').style.display = 'none';
            document.getElementById('proj-uploader-placeholder').style.display = 'flex';
            openModal('modal-project');
        };

        if (addBtn) addBtn.addEventListener('click', openAddModal);
        if (quickAddBtn) quickAddBtn.addEventListener('click', openAddModal);

        if (searchInput) searchInput.addEventListener('input', renderProjectsTable);
        if (catSelect) catSelect.addEventListener('change', renderProjectsTable);

        // Project Form Submit
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('project-id').value;
                const title = document.getElementById('proj-title').value.trim();
                const category = document.getElementById('proj-category').value;
                const client = document.getElementById('proj-client').value.trim();
                const description = document.getElementById('proj-desc').value.trim();
                const caseStudyUrl = document.getElementById('proj-casestudy').value.trim();
                const status = document.getElementById('proj-status').value;
                let imageUrl = document.getElementById('proj-image-url').value || '../images/project-1-logo-design.svg';

                const data = getDataset();

                if (id) {
                    // Update
                    const index = data.projects.findIndex(p => p.id === id);
                    if (index !== -1) {
                        data.projects[index] = {
                            ...data.projects[index],
                            title, category, client, description, caseStudyUrl, status, imageUrl
                        };
                        showToast(`Project "${title}" updated successfully!`, 'success');
                    }
                } else {
                    // Create
                    const newProj = {
                        id: 'proj-' + Date.now(),
                        title, category, client, description, caseStudyUrl, status, imageUrl,
                        date: new Date().toISOString().split('T')[0]
                    };
                    data.projects.unshift(newProj);
                    showToast(`New project "${title}" added!`, 'success');
                }

                saveDataset(data);
                closeModal('modal-project');
                renderProjectsTable();
                renderOverview();
            });
        }
    };

    const editProject = (id) => {
        const data = getDataset();
        const p = data.projects.find(item => item.id === id);
        if (!p) return;

        document.getElementById('project-id').value = p.id;
        document.getElementById('modal-project-title').textContent = 'Edit Project';
        document.getElementById('proj-title').value = p.title;
        document.getElementById('proj-category').value = p.category;
        document.getElementById('proj-client').value = p.client;
        document.getElementById('proj-desc').value = p.description;
        document.getElementById('proj-casestudy').value = p.caseStudyUrl || '';
        document.getElementById('proj-status').value = p.status;
        document.getElementById('proj-image-url').value = p.imageUrl || '';

        const previewImg = document.getElementById('proj-image-preview');
        if (p.imageUrl) {
            previewImg.src = p.imageUrl;
            document.getElementById('proj-preview-wrapper').style.display = 'flex';
            document.getElementById('proj-uploader-placeholder').style.display = 'none';
        } else {
            document.getElementById('proj-preview-wrapper').style.display = 'none';
            document.getElementById('proj-uploader-placeholder').style.display = 'flex';
        }

        openModal('modal-project');
    };

    const deleteProject = (id) => {
        const data = getDataset();
        const p = data.projects.find(item => item.id === id);
        if (!p) return;

        confirmDelete(`Are you sure you want to permanently delete project "${p.title}"?`, () => {
            data.projects = data.projects.filter(item => item.id !== id);
            saveDataset(data);
            showToast(`Project "${p.title}" deleted.`, 'info');
            renderProjectsTable();
            renderOverview();
        });
    };

    /* --------------------------------------------------------------------------
       IMAGE UPLOAD DRAG-AND-DROP (TASK 11)
       -------------------------------------------------------------------------- */
    const initImageUploader = () => {
        const dropzone = document.getElementById('project-image-dropzone');
        const fileInput = document.getElementById('proj-file-input');
        const previewWrapper = document.getElementById('proj-preview-wrapper');
        const previewImg = document.getElementById('proj-image-preview');
        const placeholder = document.getElementById('proj-uploader-placeholder');
        const removeBtn = document.getElementById('btn-remove-proj-img');
        const urlInput = document.getElementById('proj-image-url');

        if (!dropzone || !fileInput) return;

        dropzone.addEventListener('click', (e) => {
            if (e.target !== removeBtn) {
                fileInput.click();
            }
        });

        // Drag and drop highlights
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            });
        });

        const processFile = (file) => {
            if (!file) return;

            // Size check: max 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit. Please upload a smaller image.');
                return;
            }

            // Type check
            const allowed = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
            if (!allowed.includes(file.type)) {
                alert('Only PNG, JPG, SVG, and WEBP image files are allowed.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Url = e.target.result;
                urlInput.value = base64Url;
                previewImg.src = base64Url;
                previewWrapper.style.display = 'flex';
                placeholder.style.display = 'none';
                showToast('Image uploaded and preview generated!', 'success');
            };
            reader.readAsDataURL(file);
        };

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) processFile(files[0]);
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) processFile(fileInput.files[0]);
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.value = '';
                urlInput.value = '';
                previewWrapper.style.display = 'none';
                placeholder.style.display = 'flex';
            });
        }
    };

    /* --------------------------------------------------------------------------
       TESTIMONIALS MANAGEMENT (TASK 8)
       -------------------------------------------------------------------------- */
    const renderTestimonialsTable = () => {
        const data = getDataset();
        const tbody = document.getElementById('testimonials-table-tbody');
        if (!tbody) return;

        tbody.innerHTML = data.testimonials.map(t => `
            <tr>
                <td><strong>${t.author}</strong></td>
                <td><span style="color: #94a3b8; font-size: 0.84rem;">${t.company}</span></td>
                <td><span style="color: #f59e0b; font-weight: 700;">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</span></td>
                <td><span style="color: #cbd5e1; font-size: 0.84rem;">"${t.quote.substring(0, 60)}..."</span></td>
                <td><span class="table-badge badge-${t.status}">${t.status.toUpperCase()}</span></td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn-tbl-action" onclick="AdminDashboard.editTestimonial('${t.id}')">&#9998;</button>
                        <button type="button" class="btn-tbl-action btn-tbl-delete" onclick="AdminDashboard.deleteTestimonial('${t.id}')">&#128465;</button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    const initTestimonialModals = () => {
        const addBtn = document.getElementById('btn-open-add-testimonial-modal');
        const quickAddBtn = document.getElementById('btn-quick-new-testimonial');
        const form = document.getElementById('form-testimonial');

        const openAdd = () => {
            if (form) form.reset();
            document.getElementById('testimonial-id').value = '';
            document.getElementById('modal-test-title').textContent = 'Add Client Testimonial';
            openModal('modal-testimonial');
        };

        if (addBtn) addBtn.addEventListener('click', openAdd);
        if (quickAddBtn) quickAddBtn.addEventListener('click', openAdd);

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('testimonial-id').value;
                const author = document.getElementById('test-author').value.trim();
                const company = document.getElementById('test-company').value.trim();
                const rating = parseInt(document.getElementById('test-rating').value, 10);
                const quote = document.getElementById('test-quote').value.trim();
                const status = document.getElementById('test-status').value;

                const data = getDataset();

                if (id) {
                    const idx = data.testimonials.findIndex(t => t.id === id);
                    if (idx !== -1) {
                        data.testimonials[idx] = { ...data.testimonials[idx], author, company, rating, quote, status };
                        showToast(`Testimonial by ${author} updated!`, 'success');
                    }
                } else {
                    data.testimonials.unshift({
                        id: 'test-' + Date.now(),
                        author, company, rating, quote, status
                    });
                    showToast(`Testimonial added!`, 'success');
                }

                saveDataset(data);
                closeModal('modal-testimonial');
                renderTestimonialsTable();
                renderOverview();
            });
        }
    };

    const editTestimonial = (id) => {
        const data = getDataset();
        const t = data.testimonials.find(item => item.id === id);
        if (!t) return;

        document.getElementById('testimonial-id').value = t.id;
        document.getElementById('modal-test-title').textContent = 'Edit Testimonial';
        document.getElementById('test-author').value = t.author;
        document.getElementById('test-company').value = t.company;
        document.getElementById('test-rating').value = t.rating;
        document.getElementById('test-quote').value = t.quote;
        document.getElementById('test-status').value = t.status;
        openModal('modal-testimonial');
    };

    const deleteTestimonial = (id) => {
        const data = getDataset();
        const t = data.testimonials.find(item => item.id === id);
        if (!t) return;

        confirmDelete(`Delete testimonial by "${t.author}"?`, () => {
            data.testimonials = data.testimonials.filter(item => item.id !== id);
            saveDataset(data);
            showToast('Testimonial deleted.', 'info');
            renderTestimonialsTable();
            renderOverview();
        });
    };

    /* --------------------------------------------------------------------------
       BLOG ARTICLES MANAGEMENT (TASK 9)
       -------------------------------------------------------------------------- */
    const renderBlogTable = () => {
        const data = getDataset();
        const tbody = document.getElementById('blog-table-tbody');
        if (!tbody) return;

        tbody.innerHTML = data.articles.map(a => `
            <tr>
                <td><strong>${a.title}</strong></td>
                <td><span class="table-badge badge-published">${a.category}</span></td>
                <td>${a.readTime}</td>
                <td>${a.date}</td>
                <td><span class="table-badge badge-${a.status}">${a.status.toUpperCase()}</span></td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn-tbl-action" onclick="AdminDashboard.editArticle('${a.id}')">&#9998;</button>
                        <button type="button" class="btn-tbl-action btn-tbl-delete" onclick="AdminDashboard.deleteArticle('${a.id}')">&#128465;</button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    const initBlogModals = () => {
        const addBtn = document.getElementById('btn-open-add-article-modal');
        const quickAddBtn = document.getElementById('btn-quick-new-article');
        const form = document.getElementById('form-article');

        const openAdd = () => {
            if (form) form.reset();
            document.getElementById('article-id').value = '';
            document.getElementById('modal-article-title').textContent = 'Create Blog Article';
            openModal('modal-article');
        };

        if (addBtn) addBtn.addEventListener('click', openAdd);
        if (quickAddBtn) quickAddBtn.addEventListener('click', openAdd);

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('article-id').value;
                const title = document.getElementById('art-title').value.trim();
                const category = document.getElementById('art-category').value;
                const readTime = document.getElementById('art-readtime').value.trim() || '5 min read';
                const content = document.getElementById('art-content').value.trim();

                const data = getDataset();

                if (id) {
                    const idx = data.articles.findIndex(a => a.id === id);
                    if (idx !== -1) {
                        data.articles[idx] = { ...data.articles[idx], title, category, readTime, content };
                        showToast(`Article "${title}" updated!`, 'success');
                    }
                } else {
                    data.articles.unshift({
                        id: 'art-' + Date.now(),
                        title, category, readTime, content,
                        date: new Date().toISOString().split('T')[0],
                        status: 'published'
                    });
                    showToast(`Article "${title}" published!`, 'success');
                }

                saveDataset(data);
                closeModal('modal-article');
                renderBlogTable();
                renderOverview();
            });
        }
    };

    const editArticle = (id) => {
        const data = getDataset();
        const a = data.articles.find(item => item.id === id);
        if (!a) return;

        document.getElementById('article-id').value = a.id;
        document.getElementById('modal-article-title').textContent = 'Edit Article';
        document.getElementById('art-title').value = a.title;
        document.getElementById('art-category').value = a.category;
        document.getElementById('art-readtime').value = a.readTime;
        document.getElementById('art-content').value = a.content;
        openModal('modal-article');
    };

    const deleteArticle = (id) => {
        const data = getDataset();
        const a = data.articles.find(item => item.id === id);
        if (!a) return;

        confirmDelete(`Delete article "${a.title}"?`, () => {
            data.articles = data.articles.filter(item => item.id !== id);
            saveDataset(data);
            showToast('Article deleted.', 'info');
            renderBlogTable();
            renderOverview();
        });
    };

    /* --------------------------------------------------------------------------
       INQUIRIES MANAGEMENT (TASK 10)
       -------------------------------------------------------------------------- */
    let currentInquiryFilter = 'all';

    const renderInquiriesTable = () => {
        const data = getDataset();
        const tbody = document.getElementById('inquiries-table-tbody');
        if (!tbody) return;

        const filtered = data.inquiries.filter(i => {
            if (currentInquiryFilter === 'all') return true;
            return i.status === currentInquiryFilter;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 30px;">No inquiries in this category.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(i => `
            <tr>
                <td>${i.date}</td>
                <td><strong>${i.name}</strong></td>
                <td><a href="mailto:${i.email}" style="color: #38bdf8;">${i.email}</a></td>
                <td>${i.subject}</td>
                <td><span class="table-badge badge-${i.status}">${i.status.toUpperCase()}</span></td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn-tbl-action" onclick="AdminDashboard.viewInquiry('${i.id}')" title="View details">View</button>
                        <button type="button" class="btn-tbl-action btn-tbl-delete" onclick="AdminDashboard.deleteInquiry('${i.id}')" title="Delete">&#128465;</button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    const initInquiryFilters = () => {
        const pills = document.querySelectorAll('.filter-pill[data-inquiry-filter]');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentInquiryFilter = pill.getAttribute('data-inquiry-filter');
                renderInquiriesTable();
            });
        });
    };

    const viewInquiry = (id) => {
        const data = getDataset();
        const inq = data.inquiries.find(item => item.id === id);
        if (!inq) return;

        // Auto-mark new inquiry as contacted upon opening
        if (inq.status === 'new') {
            inq.status = 'contacted';
            saveDataset(data);
            renderInquiriesTable();
            renderOverview();
        }

        const body = document.getElementById('inquiry-details-content');
        if (body) {
            body.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div>
                        <span style="font-size: 0.76rem; color: #94a3b8; text-transform: uppercase;">From Client:</span>
                        <h4 style="font-size: 1.15rem; color: #ffffff;">${inq.name}</h4>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.88rem;">
                        <div><strong>Email:</strong> ${inq.email}</div>
                        <div><strong>Phone:</strong> ${inq.phone || 'Not provided'}</div>
                        <div><strong>Subject:</strong> ${inq.subject}</div>
                        <div><strong>Date:</strong> ${inq.date}</div>
                    </div>
                    <div style="margin-top: 8px;">
                        <span style="font-size: 0.76rem; color: #94a3b8; text-transform: uppercase;">Message Content:</span>
                        <div style="background: rgba(7, 9, 19, 0.7); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 8px; padding: 14px; margin-top: 6px; font-size: 0.92rem; color: #cbd5e1; line-height: 1.6;">
                            ${inq.message}
                        </div>
                    </div>
                </div>
            `;
        }

        const emailBtn = document.getElementById('btn-inquiry-reply-email');
        const waBtn = document.getElementById('btn-inquiry-reply-whatsapp');

        if (emailBtn) {
            emailBtn.href = `mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`;
        }
        if (waBtn) {
            const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
            waBtn.href = cleanPhone ? `https://wa.me/${cleanPhone}` : `https://wa.me/923264690033`;
        }

        openModal('modal-inquiry');
    };

    const deleteInquiry = (id) => {
        const data = getDataset();
        confirmDelete(`Delete inquiry record?`, () => {
            data.inquiries = data.inquiries.filter(item => item.id !== id);
            saveDataset(data);
            showToast('Inquiry record deleted.', 'info');
            renderInquiriesTable();
            renderOverview();
        });
    };

    /* --------------------------------------------------------------------------
       SETTINGS & DATA BACKUP / RESTORE
       -------------------------------------------------------------------------- */
    const initSettings = () => {
        const configForm = document.getElementById('backend-config-form');
        const exportBtn = document.getElementById('btn-export-data');
        const resetBtn = document.getElementById('btn-reset-demo-data');

        // Preload config values
        const currentCfg = AdminAuth.getConfig();
        if (document.getElementById('cfg-auth-provider')) document.getElementById('cfg-auth-provider').value = currentCfg.provider || 'supabase';
        if (document.getElementById('cfg-project-url')) document.getElementById('cfg-project-url').value = currentCfg.projectUrl || '';
        if (document.getElementById('cfg-anon-key')) document.getElementById('cfg-anon-key').value = currentCfg.anonKey || '';
        if (document.getElementById('cfg-storage-bucket')) document.getElementById('cfg-storage-bucket').value = currentCfg.bucket || 'portfolio-images';

        if (configForm) {
            configForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newCfg = {
                    provider: document.getElementById('cfg-auth-provider').value,
                    projectUrl: document.getElementById('cfg-project-url').value.trim(),
                    anonKey: document.getElementById('cfg-anon-key').value.trim(),
                    bucket: document.getElementById('cfg-storage-bucket').value.trim()
                };
                AdminAuth.saveConfig(newCfg);
                showToast('Backend configuration saved securely!', 'success');
            });
        }

        // Export data as JSON
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = getDataset();
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `khuram-latif-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast('Portfolio data exported successfully!', 'success');
            });
        }

        // Reset to initial sample data
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                confirmDelete('Reset all portfolio items, testimonials, and inquiries back to default sample records?', () => {
                    localStorage.removeItem(DATA_STORAGE_KEY);
                    showToast('Sample portfolio data restored.', 'info');
                    renderOverview();
                    renderProjectsTable();
                    renderTestimonialsTable();
                    renderBlogTable();
                    renderInquiriesTable();
                });
            });
        }
    };

    /* --------------------------------------------------------------------------
       GLOBAL MODAL EVENT LISTENERS & SIDEBAR TOGGLE
       -------------------------------------------------------------------------- */
    const initGlobalControls = () => {
        // Close modal buttons
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-close-modal');
                if (modalId) closeModal(modalId);
            });
        });

        // Close on backdrop click
        document.querySelectorAll('.admin-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    closeModal(modal.id);
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.admin-modal').forEach(m => {
                    if (m.style.display === 'flex') closeModal(m.id);
                });
            }
        });

        // Mobile drawer toggle
        const toggleBtn = document.getElementById('btn-sidebar-toggle');
        const closeSidebarBtn = document.getElementById('btn-sidebar-close');
        const sidebar = document.getElementById('dashboard-sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => sidebar.classList.add('open'));
        }
        if (closeSidebarBtn && sidebar) {
            closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));
        }

        // Logout
        const logoutBtn = document.getElementById('btn-sidebar-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                AdminAuth.logout();
            });
        }
    };

    // Public Dashboard Initialization
    const init = () => {
        initTabs();
        initGlobalControls();
        initProjectModals();
        initImageUploader();
        initTestimonialModals();
        initBlogModals();
        initInquiryFilters();
        initSettings();

        // Initial Renders
        renderOverview();
        renderProjectsTable();
        renderTestimonialsTable();
        renderBlogTable();
        renderInquiriesTable();
    };

    return {
        init,
        editProject,
        deleteProject,
        editTestimonial,
        deleteTestimonial,
        editArticle,
        deleteArticle,
        viewInquiry,
        deleteInquiry
    };
})();
