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
});
