// ============================================
// NUSTOLOGY PREP - UNIVERSAL DARK MODE v3 (FINAL)
// File: js/darkmode.js
// ============================================

(function() {
    const saved = localStorage.getItem('nustology_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

(function injectDarkModeCSS() {
    const css = `
        :root {
            --dm-transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        html, body { transition: var(--dm-transition); }

        /* ============================
           DARK MODE VARIABLES
           ============================ */
        [data-theme="dark"] {
            --primary-bg: rgba(30, 58, 138, 0.25) !important;
            --primary-bg2: rgba(30, 64, 175, 0.30) !important;
            --gray-lighter: #334155 !important;
            --white: #1e293b !important;
            --dark: #f1f5f9 !important;
            --dark2: #cbd5e1 !important;
            --gray: #94a3b8 !important;
            --bg-body: #0f172a !important;
            --bg-card: #1e293b !important;
            --bg-sidebar: #1a2436 !important;
            --bg-topbar: #1e293b !important;
            --text-primary: #f1f5f9 !important;
            --text-secondary: #94a3b8 !important;
            --border-color: #334155 !important;
        }

        /* ============================
           UNIVERSAL DARK BACKGROUND
           ============================ */
        [data-theme="dark"] body {
            background: #0f172a !important;
            color: #f1f5f9 !important;
        }

        /* AGGRESSIVE: Target ALL div/section/article/main containers with white bg */
        [data-theme="dark"] div,
        [data-theme="dark"] section,
        [data-theme="dark"] article,
        [data-theme="dark"] aside,
        [data-theme="dark"] main,
        [data-theme="dark"] header,
        [data-theme="dark"] nav,
        [data-theme="dark"] footer {
            border-color: #334155;
        }

        /* Force common white backgrounds to dark */
        [data-theme="dark"] .card,
        [data-theme="dark"] .sidebar,
        [data-theme="dark"] .topbar,
        [data-theme="dark"] .header,
        [data-theme="dark"] .modal,
        [data-theme="dark"] .modal-box,
        [data-theme="dark"] .modal-content,
        [data-theme="dark"] .stat-card,
        [data-theme="dark"] .field-card,
        [data-theme="dark"] .feature-card,
        [data-theme="dark"] .testimonial-card,
        [data-theme="dark"] .field-row,
        [data-theme="dark"] .subject-card,
        [data-theme="dark"] .test-card:not(.grand),
        [data-theme="dark"] .login-box,
        [data-theme="dark"] .confirm-box,
        [data-theme="dark"] .palette-box,
        [data-theme="dark"] .onboarding-box,
        [data-theme="dark"] .result-container,
        [data-theme="dark"] .post,
        [data-theme="dark"] .post-card,
        [data-theme="dark"] .lecture-card,
        [data-theme="dark"] .video-card,
        [data-theme="dark"] .merit-card,
        [data-theme="dark"] .faq-card,
        [data-theme="dark"] .faq-item,
        [data-theme="dark"] .leaderboard-item,
        [data-theme="dark"] .profile-card,
        [data-theme="dark"] .info-banner,
        [data-theme="dark"] .result-card,
        [data-theme="dark"] .container,
        [data-theme="dark"] .filter-bar,
        [data-theme="dark"] .filter-section,
        [data-theme="dark"] .tabs,
        [data-theme="dark"] .tab-buttons,
        [data-theme="dark"] .field-tabs,
        [data-theme="dark"] .nav-tabs,
        [data-theme="dark"] .post-composer,
        [data-theme="dark"] .post-create,
        [data-theme="dark"] .new-post,
        [data-theme="dark"] .compose-box,
        [data-theme="dark"] .composer,
        [data-theme="dark"] table,
        [data-theme="dark"] .table-wrapper,
        [data-theme="dark"] .data-table,
        [data-theme="dark"] .leaderboard-table,
        [data-theme="dark"] .calc-card,
        [data-theme="dark"] .calculator,
        [data-theme="dark"] .merit-list-container,
        [data-theme="dark"] .empty-state,
        [data-theme="dark"] .footer-card,
        [data-theme="dark"] .contact-section,
        [data-theme="dark"] .help-section {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* ============================
           CATCH-ALL: Inline white backgrounds
           ============================ */
        [data-theme="dark"] *[style*="background: white" i],
        [data-theme="dark"] *[style*="background:white" i],
        [data-theme="dark"] *[style*="background: #fff" i],
        [data-theme="dark"] *[style*="background:#fff" i],
        [data-theme="dark"] *[style*="background: #ffffff" i],
        [data-theme="dark"] *[style*="background:#ffffff" i],
        [data-theme="dark"] *[style*="background-color: white" i],
        [data-theme="dark"] *[style*="background-color:white" i],
        [data-theme="dark"] *[style*="background-color: #fff" i],
        [data-theme="dark"] *[style*="background-color:#fff" i],
        [data-theme="dark"] *[style*="background-color: #ffffff" i],
        [data-theme="dark"] *[style*="background-color:#ffffff" i],
        [data-theme="dark"] *[style*="background: rgb(255, 255, 255)" i],
        [data-theme="dark"] *[style*="background:rgb(255,255,255)" i] {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }

        /* ============================
           CATCH-ALL: Light background colors
           ============================ */
        [data-theme="dark"] *[style*="background: #f8" i],
        [data-theme="dark"] *[style*="background:#f8" i],
        [data-theme="dark"] *[style*="background: #f0" i],
        [data-theme="dark"] *[style*="background:#f0" i],
        [data-theme="dark"] *[style*="background: #e2" i],
        [data-theme="dark"] *[style*="background:#e2" i],
        [data-theme="dark"] *[style*="background-color: #f8" i],
        [data-theme="dark"] *[style*="background-color:#f8" i],
        [data-theme="dark"] *[style*="background-color: #f0" i],
        [data-theme="dark"] *[style*="background-color:#f0" i] {
            background: #0f172a !important;
            color: #f1f5f9 !important;
        }

        /* ============================
           TEXT COLORS
           ============================ */
        [data-theme="dark"] h1, [data-theme="dark"] h2,
        [data-theme="dark"] h3, [data-theme="dark"] h4,
        [data-theme="dark"] h5, [data-theme="dark"] h6 {
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] p,
        [data-theme="dark"] li,
        [data-theme="dark"] label,
        [data-theme="dark"] td,
        [data-theme="dark"] .menu-item,
        [data-theme="dark"] .nav-links a,
        [data-theme="dark"] .footer-col a,
        [data-theme="dark"] .field-content p,
        [data-theme="dark"] .testimonial-text,
        [data-theme="dark"] .feature-card p,
        [data-theme="dark"] .field-card p,
        [data-theme="dark"] .desc,
        [data-theme="dark"] .stat-label,
        [data-theme="dark"] small,
        [data-theme="dark"] .text-secondary,
        [data-theme="dark"] .text-muted {
            color: #cbd5e1 !important;
        }

        /* Inline text color overrides */
        [data-theme="dark"] *[style*="color: #0f172a" i],
        [data-theme="dark"] *[style*="color:#0f172a" i],
        [data-theme="dark"] *[style*="color: #1e293b" i],
        [data-theme="dark"] *[style*="color:#1e293b" i],
        [data-theme="dark"] *[style*="color: black" i],
        [data-theme="dark"] *[style*="color:black" i],
        [data-theme="dark"] *[style*="color: #000" i],
        [data-theme="dark"] *[style*="color:#000" i] {
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] *[style*="color: #64748b" i],
        [data-theme="dark"] *[style*="color:#64748b" i],
        [data-theme="dark"] *[style*="color: var(--gray)" i] {
            color: #94a3b8 !important;
        }

        /* ============================
           TABLES
           ============================ */
        [data-theme="dark"] table {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] th {
            background: #0f172a !important;
            color: #94a3b8 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] td {
            border-color: #334155 !important;
            color: #cbd5e1 !important;
            background: #1e293b !important;
        }
        [data-theme="dark"] tr {
            background: transparent !important;
        }
        [data-theme="dark"] tr:hover td {
            background: #1a2436 !important;
        }
        [data-theme="dark"] thead {
            background: #0f172a !important;
        }
        [data-theme="dark"] tbody {
            background: #1e293b !important;
        }

        /* ============================
           FORMS
           ============================ */
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
            background: #0f172a !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]) {
            background: #0f172a !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] select option {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }

        /* ============================
           BUTTONS
           ============================ */
        [data-theme="dark"] .btn-secondary,
        [data-theme="dark"] .back-btn,
        [data-theme="dark"] .logout-btn,
        [data-theme="dark"] .btn-default,
        [data-theme="dark"] button:not(.btn-primary):not(.btn-success):not(.btn-danger):not(.btn-warning):not(.btn-info):not(.btn-white):not(.nav-btn):not(.tab-btn.active):not(.field-tab.active):not(.session-tab.active):not(.menu-item):not(.modal-close):not(.theme-toggle):not(.sidebar-toggle):not(.hamburger):not(.nustology-theme-toggle):not(.welcome-btn):not(.start-assessment-btn):not(.submit-btn):not(.calc-btn):not(.action-btn) {
            background: #334155 !important;
            color: #f1f5f9 !important;
            border-color: #475569 !important;
        }

        [data-theme="dark"] .btn-secondary:hover,
        [data-theme="dark"] .back-btn:hover {
            background: #475569 !important;
        }

        [data-theme="dark"] .btn-white {
            background: #1e293b !important;
            color: #60a5fa !important;
        }

        /* ============================
           BADGES & PILLS
           ============================ */
        [data-theme="dark"] .badge,
        [data-theme="dark"] .pill,
        [data-theme="dark"] .tag,
        [data-theme="dark"] .chip {
            background: rgba(59, 130, 246, 0.2) !important;
            color: #60a5fa !important;
        }
        [data-theme="dark"] .badge-info {
            background: rgba(59, 130, 246, 0.2) !important;
            color: #60a5fa !important;
        }
        [data-theme="dark"] .badge-success {
            background: rgba(34, 197, 94, 0.2) !important;
            color: #4ade80 !important;
        }
        [data-theme="dark"] .badge-warning {
            background: rgba(245, 158, 11, 0.2) !important;
            color: #fbbf24 !important;
        }
        [data-theme="dark"] .badge-danger {
            background: rgba(239, 68, 68, 0.2) !important;
            color: #f87171 !important;
        }

        /* ============================
           NAVBAR
           ============================ */
        [data-theme="dark"] .navbar {
            background: rgba(15, 23, 42, 0.85) !important;
            border-bottom-color: rgba(51, 65, 85, 0.5) !important;
        }
        [data-theme="dark"] .navbar.scrolled {
            background: rgba(15, 23, 42, 0.95) !important;
        }

        /* ============================
           HERO & SECTIONS
           ============================ */
        [data-theme="dark"] .hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1a2436 100%) !important;
        }
        [data-theme="dark"] .how-it-works {
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%) !important;
        }
        [data-theme="dark"] .testimonials-bg,
        [data-theme="dark"] .section-bg,
        [data-theme="dark"] .light-section {
            background: #1a2436 !important;
        }

        /* ============================
           FAQ
           ============================ */
        [data-theme="dark"] .faq-item {
            background: #1e293b !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .faq-item button {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] .faq-answer,
        [data-theme="dark"] .faq-answer p {
            background: #1e293b !important;
            color: #94a3b8 !important;
        }

        /* ============================
           FOOTER
           ============================ */
        [data-theme="dark"] .footer {
            background: #020617 !important;
        }

        /* ============================
           SIDEBAR
           ============================ */
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

        /* ============================
           TOPBAR
           ============================ */
        [data-theme="dark"] .topbar {
            background: #1e293b !important;
            border-bottom-color: #334155 !important;
        }

        /* ============================
           CHAT INTERFACE
           ============================ */
        [data-theme="dark"] .chat-layout,
        [data-theme="dark"] .chat-sidebar,
        [data-theme="dark"] .chat-main,
        [data-theme="dark"] .chat-area,
        [data-theme="dark"] .users-panel,
        [data-theme="dark"] .messages-panel,
        [data-theme="dark"] .chat-container,
        [data-theme="dark"] .chat-list,
        [data-theme="dark"] .chat-window,
        [data-theme="dark"] .chat-messages,
        [data-theme="dark"] .chat-input-area,
        [data-theme="dark"] .chat-header,
        [data-theme="dark"] .conversation-list,
        [data-theme="dark"] .chat-body {
            background: #0f172a !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        [data-theme="dark"] .user-item,
        [data-theme="dark"] .chat-user,
        [data-theme="dark"] .user-row,
        [data-theme="dark"] .conversation-item,
        [data-theme="dark"] .chat-list-item {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        [data-theme="dark"] .user-item:hover,
        [data-theme="dark"] .chat-user:hover,
        [data-theme="dark"] .conversation-item:hover {
            background: rgba(59, 130, 246, 0.15) !important;
        }

        [data-theme="dark"] .user-item.active,
        [data-theme="dark"] .chat-user.active,
        [data-theme="dark"] .conversation-item.active {
            background: rgba(59, 130, 246, 0.25) !important;
        }

        [data-theme="dark"] .tab-btn,
        [data-theme="dark"] .chat-tab,
        [data-theme="dark"] .field-tab {
            background: #1e293b !important;
            color: #cbd5e1 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .tab-btn.active,
        [data-theme="dark"] .chat-tab.active,
        [data-theme="dark"] .field-tab.active {
            background: #1a56db !important;
            color: white !important;
        }

        [data-theme="dark"] .message,
        [data-theme="dark"] .msg,
        [data-theme="dark"] .message-bubble,
        [data-theme="dark"] .msg-bubble:not(.own),
        [data-theme="dark"] .chat-msg-box,
        [data-theme="dark"] .chat-message-box,
        [data-theme="dark"] .message-content {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        [data-theme="dark"] .message.own,
        [data-theme="dark"] .msg.own,
        [data-theme="dark"] .msg-bubble.own,
        [data-theme="dark"] .message-bubble.own {
            background: #1a56db !important;
            color: white !important;
        }

        [data-theme="dark"] .message-input,
        [data-theme="dark"] .chat-input,
        [data-theme="dark"] .input-area input,
        [data-theme="dark"] .input-area textarea {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        [data-theme="dark"] .search-box,
        [data-theme="dark"] .search-input {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* ============================
           STAT ICON BACKGROUNDS
           ============================ */
        [data-theme="dark"] .stat-icon-wrap.blue,
        [data-theme="dark"] .stat-icon-wrap.b { background: rgba(59,130,246,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.green,
        [data-theme="dark"] .stat-icon-wrap.g { background: rgba(34,197,94,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.orange,
        [data-theme="dark"] .stat-icon-wrap.o { background: rgba(245,158,11,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.purple,
        [data-theme="dark"] .stat-icon-wrap.p { background: rgba(147,51,234,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.r { background: rgba(239,68,68,0.2) !important; }

        /* ============================
           QUICK ACTIONS
           ============================ */
        [data-theme="dark"] .quick-action {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .quick-action:hover {
            background: rgba(59, 130, 246, 0.15) !important;
            color: #60a5fa !important;
        }

        /* ============================
           TEST INTERFACE
           ============================ */
        [data-theme="dark"] .test-interface { background: #0f172a !important; }
        [data-theme="dark"] .test-main { background: #1e293b !important; }
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

        /* ============================
           SCROLLBAR
           ============================ */
        [data-theme="dark"] ::-webkit-scrollbar-track { background: #1e293b; }
        [data-theme="dark"] ::-webkit-scrollbar-thumb { background: #475569; }
        [data-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: #64748b; }

        /* ============================
           PRESERVE GRADIENTS (Welcome, CTA, etc.)
           ============================ */
        [data-theme="dark"] .welcome,
        [data-theme="dark"] .cta-section,
        [data-theme="dark"] .score-display,
        [data-theme="dark"] .timer-box,
        [data-theme="dark"] .profile-header,
        [data-theme="dark"] .profile-hero,
        [data-theme="dark"] [class*="gradient"],
        [data-theme="dark"] [style*="linear-gradient"] {
            color: white !important;
        }
        [data-theme="dark"] .welcome h2,
        [data-theme="dark"] .cta-title,
        [data-theme="dark"] .score-number,
        [data-theme="dark"] .score-total,
        [data-theme="dark"] .profile-header h2,
        [data-theme="dark"] .profile-header h3 {
            color: white !important;
        }

        /* Profile gradient header */
        [data-theme="dark"] .profile-card-header,
        [data-theme="dark"] .profile-banner {
            background: linear-gradient(135deg, #1e3a8a, #1e40af) !important;
            color: white !important;
        }

        /* ============================
           EMPTY STATES & ICONS
           ============================ */
        [data-theme="dark"] .empty-icon,
        [data-theme="dark"] .empty-state-icon,
        [data-theme="dark"] .no-data-icon {
            color: #475569 !important;
        }

        /* ============================
           FLOATING DARK MODE TOGGLE
           ============================ */
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
        .nustology-theme-toggle svg { width: 22px; height: 22px; }
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

// ============================
// JS-BASED OVERRIDE (Aggressive Fix)
// ============================
function applyDarkModeOverrides() {
    if (document.documentElement.getAttribute('data-theme') !== 'dark') return;

    // Find ALL elements with inline white/light backgrounds and force dark
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        const inlineBg = el.style.background || el.style.backgroundColor;
        if (inlineBg) {
            const lower = inlineBg.toLowerCase();
            if (
                lower.includes('white') ||
                lower.includes('#fff') ||
                lower.includes('#ffffff') ||
                lower.includes('rgb(255, 255, 255)') ||
                lower.includes('rgb(255,255,255)')
            ) {
                el.style.setProperty('background', '#1e293b', 'important');
                el.style.setProperty('color', '#f1f5f9', 'important');
            } else if (
                lower.startsWith('#f') ||
                lower.includes('#f8') ||
                lower.includes('#f0') ||
                lower.includes('#eff')
            ) {
                el.style.setProperty('background', '#0f172a', 'important');
            }
        }
    });
}

// Run overrides after DOM is ready
window.addEventListener('DOMContentLoaded', function() {
    applyDarkModeOverrides();
    
    // Add floating toggle button
    if (!document.querySelector('.theme-toggle')) {
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
    }
});

// Also run when content is dynamically added (for chat messages, dynamic lists)
const observer = new MutationObserver(() => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        applyDarkModeOverrides();
    }
});
window.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
});

window.toggleNustologyTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nustology_theme', newTheme);
    
    // Apply overrides immediately after theme change
    if (newTheme === 'dark') {
        setTimeout(applyDarkModeOverrides, 50);
    } else {
        // Light mode - reload to remove inline overrides
        setTimeout(() => location.reload(), 100);
    }
};

window.toggleTheme = window.toggleNustologyTheme;
