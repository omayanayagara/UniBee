document.addEventListener('DOMContentLoaded', () => {
    // --- Global State Management ---
    const APP_STATE = {
        theme: localStorage.getItem('theme') || 'light',
        role: localStorage.getItem('userRole') || 'student' // Default to student
    };

    // --- Dark Mode Logic ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);

        // Update toggle if present (Settings page)
        const themeToggle = document.querySelector('#darkModeToggle');
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
        }
    };

    // Initialize Theme
    applyTheme(APP_STATE.theme);

    // Theme Toggle Event Listener (if on Settings page)
    const themeToggle = document.querySelector('#darkModeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // --- Role-Based Access Control (RBAC) ---
    const applyRole = (role) => {
        console.log(`Applying Role: ${role}`);
        localStorage.setItem('userRole', role);
        const body = document.body;

        // Restrict Sidebar Links for Students
        if (role === 'student') {
            document.querySelectorAll('.nav-item').forEach(item => {
                const href = item.getAttribute('href');
                if (href && (href.includes('students.html') || href.includes('analytics.html') || href.includes('admin.html'))) {
                    item.style.display = 'none';
                }
            });
            // Update Profile Name mainly for visuals
            const profileRole = document.querySelector('.user-info .role');
            if (profileRole) profileRole.textContent = 'Student';
        } else {
            // Admin - Show all
            document.querySelectorAll('.nav-item').forEach(item => {
                item.style.display = 'flex';
            });
            const profileRole = document.querySelector('.user-info .role');
            if (profileRole) profileRole.textContent = 'Administrator';
        }
    };

    // Initialize Role
    applyRole(APP_STATE.role);

    // Role Switcher Logic (Settings Page)
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect) {
        roleSelect.value = APP_STATE.role;
        roleSelect.addEventListener('change', (e) => {
            const newRole = e.target.value;
            applyRole(newRole);
            // Reload to apply redirects if necessary
            window.location.reload();
        });
    }

    // Access Control / Redirects
    const currentPage = window.location.pathname.split('/').pop();
    const restrictedPages = ['students.html', 'analytics.html', 'admin.html', 'create-notice.html'];

    if (APP_STATE.role === 'student' && restrictedPages.includes(currentPage)) {
        alert('Access Denied: This page is for Administrators only.');
        window.location.href = 'index.html';
    }


    // --- UI Interactions ---

    // 1. Dynamic Filtering Logic (Notice Board)
    const filterChips = document.querySelectorAll('.filter-chip');
    const noticeCards = document.querySelectorAll('.notice-card[data-category]');

    if (filterChips.length > 0 && noticeCards.length > 0) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active class from all
                filterChips.forEach(c => c.classList.remove('active'));
                // Add active to clicked
                chip.classList.add('active');

                const filter = chip.getAttribute('data-filter');

                noticeCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex'; // Restore display
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Admin Interactions (Delete Notice)
    // Use event delegation for delete buttons
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-notice-btn');
        if (deleteBtn) {
            const confirmed = confirm('Are you sure you want to delete this notice? This action cannot be undone.');
            if (confirmed) {
                const noticeItem = deleteBtn.closest('.admin-notice-item');
                if (noticeItem) {
                    noticeItem.remove();
                    showToast('Notice deleted successfully.');
                }
            }
        }
    });

    // 3. Create Notice (Form Submission)
    const createNoticeForm = document.getElementById('createNoticeForm');
    if (createNoticeForm) {
        createNoticeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect Data
            const title = document.getElementById('notice-title').value;
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value;

            const newNotice = {
                id: Date.now(),
                title,
                category,
                date,
                description
            };

            // Save to LocalStorage (Mock Backend)
            const notices = JSON.parse(localStorage.getItem('notices') || '[]');
            notices.push(newNotice);
            localStorage.setItem('notices', JSON.stringify(notices));

            // Redirect with success message
            window.location.href = 'admin.html?msg=success';
        });
    }

    // 4. Toast Notification
    const showToast = (message) => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <span class="material-symbols-rounded">check_circle</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    };

    // Check for URL params (Toast triggers)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('msg') === 'success') {
        showToast('Notice published successfully!');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Sidebar Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar on mobile click outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Mock Chart Animation
    const bars = document.querySelectorAll('.bar'); // If using CSS charts
    bars.forEach((bar, index) => {
        // Animation logic if specific class exists
        // simplified for general usage
    });

    // ===== SEARCH BAR LOGIC =====
    const dashboardSearch = document.getElementById('dashboardSearch');
    if (dashboardSearch) {
        dashboardSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            // Search Notice Cards in dashboard
            const dashNotices = document.querySelectorAll('.notice-list .notice-card, .notice-card[data-category]');
            dashNotices.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    card.classList.remove('search-hidden');
                } else {
                    card.classList.add('search-hidden');
                }
            });

            // Search Stat Cards
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    card.classList.remove('search-hidden');
                } else {
                    card.classList.add('search-hidden');
                }
            });

            // Search Admin Notice Items
            const adminItems = document.querySelectorAll('.admin-notice-item');
            adminItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    item.classList.remove('search-hidden');
                } else {
                    item.classList.add('search-hidden');
                }
            });
        });
    }

    // ===== NOTIFICATION DROPDOWN LOGIC =====
    const notifBtn = document.getElementById('notificationBtn');
    const notifDropdown = document.getElementById('notificationDropdown');
    const markAllReadBtn = document.getElementById('markAllRead');
    const notifBadge = document.getElementById('notifBadge');

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (notifDropdown.classList.contains('show') && !notifDropdown.contains(e.target)) {
                notifDropdown.classList.remove('show');
            }
        });

        // Mark All Read
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                document.querySelectorAll('.notif-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                if (notifBadge) {
                    notifBadge.style.display = 'none';
                }
                showToast('All notifications marked as read.');
            });
        }

        // Click individual notification to mark read
        document.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                // Update badge count
                const remaining = document.querySelectorAll('.notif-item.unread').length;
                if (notifBadge) {
                    if (remaining === 0) {
                        notifBadge.style.display = 'none';
                    } else {
                        notifBadge.textContent = remaining;
                    }
                }
            });
        });
    }

    // ===== ANALYTICS CHART LABELS (index.html) =====
    const chartLabels = ['Lectures', 'Seminars', 'Workshops', 'Exams', 'Projects', 'Social', 'Sports'];
    const barElements = document.querySelectorAll('.bar-chart-mock .bar');
    barElements.forEach((bar, i) => {
        if (chartLabels[i]) {
            bar.setAttribute('title', chartLabels[i]);
            // Add a label below
            if (!bar.querySelector('.bar-label')) {
                const label = document.createElement('span');
                label.className = 'bar-label';
                label.textContent = chartLabels[i];
                label.style.cssText = 'position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);font-size:0.7rem;color:var(--text-muted);white-space:nowrap;';
                bar.style.position = 'relative';
                bar.appendChild(label);
            }
        }
    });
});
