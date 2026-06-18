// ============================================
// NUSTOLOGY PREP - UNIVERSAL DARK MODE
// File: js/darkmode.js
// Include this in EVERY HTML page
// ============================================

(function() {
    // Apply saved theme IMMEDIATELY (before page renders) to avoid flash
    const saved = localStorage.getItem('nustology_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

// Inject dark mode CSS into the page
(function injectDarkModeCSS() {
    const css = `
        /* ========== UNIVERSAL DARK MODE STYLES ========== */
        :root {
            --dm-transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        html, body { transition: var(--dm-transition); }

        [data-theme="dark"] {
            --primary-bg: #1e3a8a40 !important;
            --primary-bg2: #1e40af50 !important;
            --gray-lighter: #334155 !important;
            --white: #1e293b !important;
            --dark: #f1f5f9 !important;
            --dark2: #cbd5e1 !important;
            --gray: #94a3b8 !important;
        }

        /* Body & basic backgrounds */
        [data-theme="dark"] body {
            background: #0f172a !important;
            color: #f1f5f9 !important;
        }

        /* Common containers */
        [data-theme="dark"] .card,
        [data-theme="dark"] .sidebar,
        [data-theme="dark"] .topbar,
        [data-theme="dark"] .modal,
        [data-theme="dark"] .stat-card,
        [data-theme="dark"] .field-card,
        [data-theme="dark"] .feature-card,
        [data-theme="dark"] .testimonial-card,
        [data-theme="dark"] .field-row,
        [data-theme="dark"] .subject-card,
        [data-theme="dark"] .test-card:not(.grand),
        [data-theme="dark"] .login-box,
        [data-theme="dark"] .modal-box,
        [data-theme="dark"] .confirm-box,
        [data-theme="dark"] .palette-box,
        [data-theme="dark"] .onboarding-box,
        [data-theme="dark"] .result-container,
        [data-theme="dark"] .header {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* Text colors */
        [data-theme="dark"] h1, [data-theme="dark"] h2,
        [data-theme="dark"] h3, [data-theme="dark"] h4,
        [data-theme="dark"] h5, [data-theme="dark"] h6 {
            color: #f1f5f9;
        }

        [data-theme="dark"] p,
        [data-theme="dark"] span,
        [data-theme="dark"] li,
        [data-theme="dark"] label,
        [data-theme="dark"] td,
        [data-theme="dark"] .menu-item,
        [data-theme="dark"] .nav-links a,
        [data-theme="dark"] .footer-col a,
        [data-theme="dark"] .field-content p,
        [data-theme="dark"] .testimonial-text,
        [data-theme="dark"] .feature-card p,
        [data-theme="dark"] .field-card p {
            color: #cbd5e1;
        }

        /* Tables */
        [data-theme="dark"] table { background: transparent; }
        [data-theme="dark"] th {
            background: #0f172a !important;
            color: #94a3b8 !important;
        }
        [data-theme="dark"] td {
            border-color: #334155 !important;
            color: #cbd5e1 !important;
        }
        [data-theme="dark"] tr:hover { background: #1a2436 !important; }

        /* Forms */
        [data-theme="dark"] input,
        [data-theme="dark"] select,
        [data-theme="dark"] textarea {
            background: #0f172a !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] input::placeholder,
        [data-theme="dark"] textarea::placeholder {
            color: #64748b !important;
        }
        [data-theme="dark"] input:focus,
        [data-theme="dark"] select:focus,
        [data-theme="dark"] textarea:focus {
            border-color: #3b82f6 !important;
        }

        /* Navbar */
        [data-theme="dark"] .navbar {
            background: rgba(15, 23, 42, 0.85) !important;
            border-bottom-color: rgba(51, 65, 85, 0.5) !important;
        }
        [data-theme="dark"] .navbar.scrolled {
            background: rgba(15, 23, 42, 0.95) !important;
        }

        /* Hero & gradient sections */
        [data-theme="dark"] .hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1a2436 100%) !important;
        }

        [data-theme="dark"] .how-it-works {
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%) !important;
        }

        [data-theme="dark"] .testimonials-bg {
            background: #1a2436 !important;
        }

        /* Buttons & badges */
        [data-theme="dark"] .btn-secondary,
        [data-theme="dark"] .back-btn,
        [data-theme="dark"] .logout-btn {
            background: #334155 !important;
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] .btn-white {
            background: #1e293b !important;
            color: #60a5fa !important;
        }

        [data-theme="dark"] .badge-info {
            background: rgba(59, 130, 246, 0.2) !important;
            color: #60a5fa !important;
        }

        /* Borders */
        [data-theme="dark"] [class*="border"],
        [data-theme="dark"] hr {
            border-color: #334155 !important;
        }

        /* FAQ */
        [data-theme="dark"] .faq-item button {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] .faq-answer p {
            color: #94a3b8 !important;
        }

        /* Footer */
        [data-theme="dark"] .footer {
            background: #020617 !important;
        }

        /* Sidebar */
        [data-theme="dark"] .sidebar {
            background: #1a2436 !important;
            border-right-color: #334155 !important;
        }
        [data-theme="dark"] .menu-item {
            color: #94a3b8 !important;
        }
        [data-theme="dark"] .menu-item:hover {
            background: rgba(59, 130, 246, 0.15) !important;
            color: #60a5fa !important;
        }
        [data-theme="dark"] .menu-item.active {
            background: #1a56db !important;
            color: white !important;
        }
        [data-theme="dark"] .menu-section {
            color: #64748b !important;
        }

        /* Topbar */
        [data-theme="dark"] .topbar {
            background: #1e293b !important;
            border-bottom-color: #334155 !important;
        }

        /* Modals */
        [data-theme="dark"] .modal-overlay,
        [data-theme="dark"] .modal,
        [data-theme="dark"] .palette-modal,
        [data-theme="dark"] .confirm-modal,
        [data-theme="dark"] .onboarding-overlay {
            color: #f1f5f9;
        }

        /* Code/pre */
        [data-theme="dark"] code, [data-theme="dark"] pre {
            background: #0f172a !important;
            color: #f1f5f9 !important;
        }

        /* Chat bubbles */
        [data-theme="dark"] .chat-msg-box,
        [data-theme="dark"] .chat-message-box,
        [data-theme="dark"] .msg-bubble:not(.own) {
            background: #1a2436 !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* Stats and dashboard items */
        [data-theme="dark"] .stat-icon-wrap.blue {
            background: rgba(59,130,246,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.green {
            background: rgba(34,197,94,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.orange {
            background: rgba(245,158,11,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.purple {
            background: rgba(147,51,234,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.b {
            background: rgba(59,130,246,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.g {
            background: rgba(34,197,94,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.o {
            background: rgba(245,158,11,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.r {
            background: rgba(239,68,68,0.2) !important;
        }
        [data-theme="dark"] .stat-icon-wrap.p {
            background: rgba(147,51,234,0.2) !important;
        }

        /* Quick actions */
        [data-theme="dark"] .quick-action {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .quick-action:hover {
            background: rgba(59, 130, 246, 0.15) !important;
            color: #60a5fa !important;
        }

        /* Test interface */
        [data-theme="dark"] .test-interface {
            background: #0f172a !important;
        }
        [data-theme="dark"] .test-main {
            background: #1e293b !important;
        }
        [data-theme="dark"] .question-content,
        [data-theme="dark"] .question-text {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .option-item {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .option-item:hover {
            background: rgba(59, 130, 246, 0.15) !important;
            border-color: #3b82f6 !important;
        }
        [data-theme="dark"] .option-item.selected {
            background: rgba(59, 130, 246, 0.25) !important;
            border-color: #3b82f6 !important;
        }
        [data-theme="dark"] .question-passage {
            background: rgba(245, 158, 11, 0.15) !important;
            color: #fde68a !important;
        }
        [data-theme="dark"] .test-sidebar,
        [data-theme="dark"] .sessions-bar,
        [data-theme="dark"] .test-bottom,
        [data-theme="dark"] .test-subject-bar {
            background: #1a2436 !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] .session-tab {
            background: #1e293b !important;
            color: #cbd5e1 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .session-tab.active {
            background: #1a56db !important;
            color: white !important;
        }
        [data-theme="dark"] .test-top-bar {
            background: #1e293b !important;
            border-color: #3b82f6 !important;
        }
        [data-theme="dark"] .question-header,
        [data-theme="dark"] .answer-header,
        [data-theme="dark"] .question-label {
            background: rgba(59, 130, 246, 0.15) !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] .test-footer {
            background: #1e293b !important;
            border-top-color: #334155 !important;
        }

        /* Scrollbar */
        [data-theme="dark"] ::-webkit-scrollbar-track {
            background: #1e293b;
        }
        [data-theme="dark"] ::-webkit-scrollbar-thumb {
            background: #475569;
        }
        [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }

        /* Welcome cards keep their gradient */
        [data-theme="dark"] .welcome,
        [data-theme="dark"] .cta-section,
        [data-theme="dark"] .score-display,
        [data-theme="dark"] .timer-box {
            color: white !important;
        }

        /* ========== UNIVERSAL DARK MODE TOGGLE BUTTON ========== */
        .nustology-theme-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1a56db;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(26, 86, 219, 0.4);
            z-index: 9999;
            transition: all 0.3s ease;
        }
        .nustology-theme-toggle:hover {
            transform: scale(1.1) rotate(15deg);
            box-shadow: 0 6px 20px rgba(26, 86, 219, 0.5);
        }
        .nustology-theme-toggle svg {
            width: 22px;
            height: 22px;
        }
        .nustology-theme-toggle .icon-sun { display: none; }
        .nustology-theme-toggle .icon-moon { display: block; }
        [data-theme="dark"] .nustology-theme-toggle {
            background: #fbbf24;
            color: #0f172a;
            box-shadow: 0 4px 14px rgba(251, 191, 36, 0.4);
        }
        [data-theme="dark"] .nustology-theme-toggle:hover {
            box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
        }
        [data-theme="dark"] .nustology-theme-toggle .icon-sun { display: block; }
        [data-theme="dark"] .nustology-theme-toggle .icon-moon { display: none; }

        @media (max-width: 768px) {
            .nustology-theme-toggle {
                bottom: 16px;
                right: 16px;
                width: 44px;
                height: 44px;
            }
        }
    `;
    const style = document.createElement('style');
    style.id = 'nustology-darkmode-styles';
    style.textContent = css;
    document.head.appendChild(style);
})();

// Add the floating dark mode toggle button (auto-added to every page)
window.addEventListener('DOMContentLoaded', function() {
    // Don't add if there's already a custom theme toggle on the page
    if (document.querySelector('.theme-toggle')) return;

    const btn = document.createElement('button');
    btn.className = 'nustology-theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.setAttribute('title', 'Toggle dark mode');
    btn.innerHTML = `
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
    `;
    btn.onclick = window.toggleNustologyTheme;
    document.body.appendChild(btn);
});

// Universal toggle function (callable from any page)
window.toggleNustologyTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nustology_theme', newTheme);
};

// Also export with old name for compatibility
window.toggleTheme = window.toggleNustologyTheme;
