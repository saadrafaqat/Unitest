// ============================================
// NUSTOLOGY PREP - UNIVERSAL DARK MODE v2
// File: js/darkmode.js
// Include this in EVERY HTML page
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

        [data-theme="dark"] {
            --primary-bg: #1e3a8a40 !important;
            --primary-bg2: #1e40af50 !important;
            --gray-lighter: #334155 !important;
            --white: #1e293b !important;
            --dark: #f1f5f9 !important;
            --dark2: #cbd5e1 !important;
            --gray: #94a3b8 !important;
        }

        /* ===== BASE ===== */
        [data-theme="dark"] body {
            background: #0f172a !important;
            color: #f1f5f9 !important;
        }

        /* ===== CONTAINERS ===== */
        [data-theme="dark"] .card,
        [data-theme="dark"] .sidebar,
        [data-theme="dark"] .topbar,
        [data-theme="dark"] .modal,
        [data-theme="dark"] .modal-box,
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
        [data-theme="dark"] .header,
        [data-theme="dark"] .post,
        [data-theme="dark"] .post-card,
        [data-theme="dark"] .lecture-card,
        [data-theme="dark"] .merit-card,
        [data-theme="dark"] .faq-card,
        [data-theme="dark"] .leaderboard-item,
        [data-theme="dark"] .profile-card,
        [data-theme="dark"] .info-banner,
        [data-theme="dark"] .result-card {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* ===== TEXT ===== */
        [data-theme="dark"] h1, [data-theme="dark"] h2,
        [data-theme="dark"] h3, [data-theme="dark"] h4,
        [data-theme="dark"] h5, [data-theme="dark"] h6 {
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] p,
        [data-theme="dark"] span:not(.badge):not(.nust):not(.field-code-badge):not(.score-number):not(.score-total):not(.timer-time):not(.label-text):not(.session-count):not(.pill),
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
        [data-theme="dark"] .test-info-text small,
        [data-theme="dark"] small {
            color: #cbd5e1 !important;
        }

        /* ===== TABLES ===== */
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

        /* ===== FORMS ===== */
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

        /* ===== NAVBAR ===== */
        [data-theme="dark"] .navbar {
            background: rgba(15, 23, 42, 0.85) !important;
            border-bottom-color: rgba(51, 65, 85, 0.5) !important;
        }
        [data-theme="dark"] .navbar.scrolled {
            background: rgba(15, 23, 42, 0.95) !important;
        }

        /* ===== HERO ===== */
        [data-theme="dark"] .hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1a2436 100%) !important;
        }
        [data-theme="dark"] .how-it-works {
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%) !important;
        }
        [data-theme="dark"] .testimonials-bg {
            background: #1a2436 !important;
        }

        /* ===== BUTTONS ===== */
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

        /* ===== FAQ ===== */
        [data-theme="dark"] .faq-item button {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] .faq-answer p {
            color: #94a3b8 !important;
        }

        /* ===== FOOTER ===== */
        [data-theme="dark"] .footer {
            background: #020617 !important;
        }

        /* ===== SIDEBAR ===== */
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

        /* ===== TOPBAR ===== */
        [data-theme="dark"] .topbar {
            background: #1e293b !important;
            border-bottom-color: #334155 !important;
        }

        /* ===== CHAT INTERFACE (NEW FIX) ===== */
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
        [data-theme="dark"] .chat-body,
        [data-theme="dark"] .main {
            background: #0f172a !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* Chat user list items */
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

        /* Chat tabs (Group/Private) */
        [data-theme="dark"] .tab-buttons,
        [data-theme="dark"] .chat-tabs {
            background: #1e293b !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .tab-btn,
        [data-theme="dark"] .chat-tab {
            background: #1e293b !important;
            color: #cbd5e1 !important;
        }
        [data-theme="dark"] .tab-btn.active,
        [data-theme="dark"] .chat-tab.active {
            background: #1a56db !important;
            color: white !important;
        }

        /* Message bubbles */
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

        /* Chat input */
        [data-theme="dark"] .message-input,
        [data-theme="dark"] .chat-input,
        [data-theme="dark"] .input-area input,
        [data-theme="dark"] .input-area textarea {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* Search box */
        [data-theme="dark"] .search-box,
        [data-theme="dark"] .search-input {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* Chat header bar */
        [data-theme="dark"] .chat-header,
        [data-theme="dark"] .chat-top-bar,
        [data-theme="dark"] .chat-user-info {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* ===== STAT ICONS ===== */
        [data-theme="dark"] .stat-icon-wrap.blue,
        [data-theme="dark"] .stat-icon-wrap.b { background: rgba(59,130,246,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.green,
        [data-theme="dark"] .stat-icon-wrap.g { background: rgba(34,197,94,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.orange,
        [data-theme="dark"] .stat-icon-wrap.o { background: rgba(245,158,11,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.purple,
        [data-theme="dark"] .stat-icon-wrap.p { background: rgba(147,51,234,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.r { background: rgba(239,68,68,0.2) !important; }

        /* ===== QUICK ACTIONS ===== */
        [data-theme="dark"] .quick-action {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .quick-action:hover {
            background: rgba(59, 130, 246, 0.15) !important;
            color: #60a5fa !important;
        }

        /* ===== TEST INTERFACE ===== */
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

        /* ===== COMMUNITY POSTS ===== */
        [data-theme="dark"] .post-author,
        [data-theme="dark"] .post-content,
        [data-theme="dark"] .post-actions,
        [data-theme="dark"] .post-comments,
        [data-theme="dark"] .comment {
            background: transparent !important;
            color: #f1f5f9 !important;
        }
        [data-theme="dark"] .comment-box {
            background: #0f172a !important;
            border-color: #334155 !important;
        }

        /* ===== LEADERBOARD ===== */
        [data-theme="dark"] .leaderboard-row,
        [data-theme="dark"] .rank-item {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* ===== LECTURES ===== */
        [data-theme="dark"] .video-card,
        [data-theme="dark"] .lecture-item {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* ===== AGGREGATE CALCULATOR ===== */
        [data-theme="dark"] .calculator,
        [data-theme="dark"] .calc-section,
        [data-theme="dark"] .result-box {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

        /* ===== SCROLLBAR ===== */
        [data-theme="dark"] ::-webkit-scrollbar-track {
            background: #1e293b;
        }
        [data-theme="dark"] ::-webkit-scrollbar-thumb {
            background: #475569;
        }
        [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }

        /* ===== KEEP GRADIENTS WHITE ===== */
        [data-theme="dark"] .welcome,
        [data-theme="dark"] .cta-section,
        [data-theme="dark"] .score-display,
        [data-theme="dark"] .timer-box {
            color: white !important;
        }
        [data-theme="dark"] .welcome h2,
        [data-theme="dark"] .cta-title,
        [data-theme="dark"] .score-number,
        [data-theme="dark"] .score-total {
            color: white !important;
        }

        /* ===== CATCH-ALL FOR WHITE BACKGROUNDS ===== */
        [data-theme="dark"] [style*="background: white"],
        [data-theme="dark"] [style*="background:#fff"],
        [data-theme="dark"] [style*="background: #fff"],
        [data-theme="dark"] [style*="background:#ffffff"],
        [data-theme="dark"] [style*="background: #ffffff"],
        [data-theme="dark"] [style*="background-color: white"],
        [data-theme="dark"] [style*="background-color:#fff"],
        [data-theme="dark"] [style*="background-color: #fff"],
        [data-theme="dark"] [style*="background-color:#ffffff"],
        [data-theme="dark"] [style*="background-color: #ffffff"] {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }

        /* ========== FLOATING DARK MODE TOGGLE BUTTON ========== */
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

// Add the floating toggle button
window.addEventListener('DOMContentLoaded', function() {
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

window.toggleNustologyTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nustology_theme', newTheme);
};

window.toggleTheme = window.toggleNustologyTheme;
