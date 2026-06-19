// ============================================
// NUSTOLOGY PREP - UNIVERSAL DARK MODE v4
// File: js/darkmode.js
// ============================================

(function() {
    const saved = localStorage.getItem('nustology_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

(function injectDarkModeCSS() {
    const css = `
        html, body { transition: background 0.3s, color 0.3s, border-color 0.3s; }

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

        [data-theme="dark"] body { background: #0f172a !important; color: #f1f5f9 !important; }

        [data-theme="dark"] .card,
        [data-theme="dark"] .sidebar,
        [data-theme="dark"] .topbar,
        [data-theme="dark"] .header,
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
        [data-theme="dark"] .post,
        [data-theme="dark"] .post-card,
        [data-theme="dark"] .post-composer,
        [data-theme="dark"] .compose-card,
        [data-theme="dark"] .lecture-card,
        [data-theme="dark"] .video-card,
        [data-theme="dark"] .merit-card,
        [data-theme="dark"] .faq-card,
        [data-theme="dark"] .faq-item,
        [data-theme="dark"] .leaderboard-item,
        [data-theme="dark"] .profile-card,
        [data-theme="dark"] .info-banner,
        [data-theme="dark"] .result-card,
        [data-theme="dark"] .filter-bar,
        [data-theme="dark"] .filter-section,
        [data-theme="dark"] .help-card,
        [data-theme="dark"] .contact-card,
        [data-theme="dark"] .still-questions-card,
        [data-theme="dark"] .calc-card,
        [data-theme="dark"] .calculator,
        [data-theme="dark"] .empty-state {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }

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
        [data-theme="dark"] *[style*="background-color:#ffffff" i] {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3,
        [data-theme="dark"] h4, [data-theme="dark"] h5, [data-theme="dark"] h6 {
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] p,
        [data-theme="dark"] li,
        [data-theme="dark"] label,
        [data-theme="dark"] td,
        [data-theme="dark"] .menu-item,
        [data-theme="dark"] .desc,
        [data-theme="dark"] .stat-label,
        [data-theme="dark"] small {
            color: #cbd5e1 !important;
        }

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

        [data-theme="dark"] table { background: transparent; }
        [data-theme="dark"] th { background: #0f172a !important; color: #94a3b8 !important; }
        [data-theme="dark"] td { border-color: #334155 !important; color: #cbd5e1 !important; }
        [data-theme="dark"] tr:hover td { background: #1a2436 !important; }

        [data-theme="dark"] .navbar {
            background: rgba(15, 23, 42, 0.85) !important;
            border-bottom-color: rgba(51, 65, 85, 0.5) !important;
        }

        [data-theme="dark"] .hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1a2436 100%) !important;
        }
        [data-theme="dark"] .how-it-works {
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%) !important;
        }
        [data-theme="dark"] .testimonials-bg {
            background: #1a2436 !important;
        }

        [data-theme="dark"] .btn-secondary,
        [data-theme="dark"] .back-btn,
        [data-theme="dark"] .logout-btn {
            background: #334155 !important;
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] .footer { background: #020617 !important; }

        [data-theme="dark"] .sidebar {
            background: #1a2436 !important;
            border-right-color: #334155 !important;
        }
        [data-theme="dark"] .menu-item { color: #94a3b8 !important; }
        [data-theme="dark"] .menu-item:hover {
            background: rgba(59, 130, 246, 0.15) !important;
            color: #60a5fa !important;
        }
        [data-theme="dark"] .menu-item.active {
            background: #1a56db !important;
            color: white !important;
        }
        [data-theme="dark"] .menu-section { color: #64748b !important; }

        [data-theme="dark"] .topbar {
            background: #1e293b !important;
            border-bottom-color: #334155 !important;
        }

        /* CHAT */
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
        [data-theme="dark"] .conversation-item {
            background: #1e293b !important;
            color: #f1f5f9 !important;
            border-color: #334155 !important;
        }
        [data-theme="dark"] .message:not(.own),
        [data-theme="dark"] .msg-bubble:not(.own) {
            background: #1e293b !important;
            color: #f1f5f9 !important;
        }

        [data-theme="dark"] .stat-icon-wrap.blue, [data-theme="dark"] .stat-icon-wrap.b { background: rgba(59,130,246,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.green, [data-theme="dark"] .stat-icon-wrap.g { background: rgba(34,197,94,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.orange, [data-theme="dark"] .stat-icon-wrap.o { background: rgba(245,158,11,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.purple, [data-theme="dark"] .stat-icon-wrap.p { background: rgba(147,51,234,0.2) !important; }
        [data-theme="dark"] .stat-icon-wrap.r { background: rgba(239,68,68,0.2) !important; }

        [data-theme="dark"] .quick-action {
            background: #1e293b !important; color: #f1f5f9 !important; border-color: #334155 !important;
        }

        [data-theme="dark"] .test-interface { background: #0f172a !important; }
        [data-theme="dark"] .test-main { background: #1e293b !important; }
        [data-theme="dark"] .question-content,
        [data-theme="dark"] .question-text {
            background: #1e293b !important; color: #f1f5f9 !important; border-color: #334155 !important;
        }
        [data-theme="dark"] .option-item {
            background: #1e293b !important; color: #f1f5f9 !important; border-color: #334155 !important;
        }
        [data-theme="dark"] .option-item:hover {
            background: rgba(59, 130, 246, 0.15) !important; border-color: #3b82f6 !important;
        }
        [data-theme="dark"] .option-item.selected {
            background: rgba(59, 130, 246, 0.25) !important; border-color: #3b82f6 !important;
        }
        [data-theme="dark"] .question-passage {
            background: rgba(245, 158, 11, 0.15) !important; color: #fde68a !important;
        }
        [data-theme="dark"] .test-sidebar,
        [data-theme="dark"] .sessions-bar,
        [data-theme="dark"] .test-bottom,
        [data-theme="dark"] .test-subject-bar {
            background: #1a2436 !important; color: #f1f5f9 !important;
        }
        [data-theme="dark"] .test-top-bar {
            background: #1e293b !important; border-color: #3b82f6 !important;
        }
        [data-theme="dark"] .question-header,
        [data-theme="dark"] .answer-header,
        [data-theme="dark"] .question-label {
            background: rgba(59, 130, 246, 0.15) !important; color: #f1f5f9 !important;
        }

        [data-theme="dark"] ::-webkit-scrollbar-track { background: #1e293b; }
        [data-theme="dark"] ::-webkit-scrollbar-thumb { background: #475569; }

        [data-theme="dark"] .welcome,
        [data-theme="dark"] .cta-section,
        [data-theme="dark"] .score-display,
        [data-theme="dark"] .timer-box {
            color: white !important;
        }
        [data-theme="dark"] .welcome h2,
        [data-theme="dark"] .cta-title,
        [data-theme="dark"] .score-number {
            color: white !important;
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
        [data-theme="dark"] .nustology-theme-toggle .icon-sun { display: block; }
        [data-theme="dark"] .nustology-theme-toggle .icon-moon { display: none; }

        /* ============================
           SIDEBAR CLOSE BUTTON (Mobile)
           ============================ */
        .sidebar-close-mobile {
            display: none;
            position: absolute;
            top: 16px;
            right: 16px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #ef4444;
            color: white;
            border: none;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            z-index: 101;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        }
        .sidebar-close-mobile svg { width: 18px; height: 18px; }

        /* ============================
           UNIVERSAL MOBILE RESPONSIVE
           ============================ */
        @media (max-width: 768px) {
            /* Move dark mode button to TOP-RIGHT on mobile, smaller */
            .nustology-theme-toggle {
                top: 70px;
                right: 12px;
                bottom: auto !important;
                width: 36px;
                height: 36px;
            }
            .nustology-theme-toggle svg { width: 16px; height: 16px; }

            /* Show close button inside sidebar on mobile */
            .sidebar.open .sidebar-close-mobile {
                display: flex !important;
            }

            /* Sidebar */
            .sidebar {
                position: fixed !important;
                left: 0;
                top: 0;
                bottom: 0;
                width: 260px !important;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                z-index: 1000;
                box-shadow: 4px 0 20px rgba(0,0,0,0.3);
            }
            .sidebar.open { transform: translateX(0) !important; }
            .sidebar.collapsed { transform: translateX(-100%) !important; }

            /* Sidebar overlay backdrop */
            .sidebar.open::after {
                content: '';
                position: fixed;
                top: 0;
                left: 260px;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: -1;
            }

            .main { margin-left: 0 !important; width: 100% !important; }

            /* Compact topbar */
            .topbar {
                padding: 10px 12px !important;
                flex-wrap: nowrap;
                gap: 8px;
            }
            .topbar h1 { font-size: 16px !important; line-height: 1.2; }
            .topbar p { font-size: 11px !important; line-height: 1.2; margin-top: 1px !important; }
            .topbar-left { gap: 8px !important; flex: 1; min-width: 0; }
            .topbar-text { min-width: 0; overflow: hidden; }
            .topbar-text h1, .topbar-text p { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .topbar-right { gap: 6px !important; flex-shrink: 0; }
            
            .user-info .name { display: none !important; }
            .user-info { padding: 3px 6px !important; }
            .user-avatar { width: 28px !important; height: 28px !important; }

            .logout-btn {
                padding: 6px 10px !important;
                font-size: 11px !important;
            }

            .sidebar-toggle {
                width: 36px !important;
                height: 36px !important;
            }
            .sidebar-toggle svg { width: 18px !important; height: 18px !important; }

            /* Hide topbar theme toggle on mobile (we have floating one) */
            .topbar .theme-toggle { display: none !important; }

            .content { padding: 14px !important; }

            .grid-2col, .grid, .stats-grid {
                grid-template-columns: 1fr !important;
                gap: 12px !important;
            }

            .form-row, .form-row.three { grid-template-columns: 1fr !important; }

            .welcome {
                flex-direction: column !important;
                text-align: center !important;
                padding: 20px !important;
                gap: 16px !important;
            }
            .welcome h2 { font-size: 20px !important; }

            /* ============ CHAT MOBILE FIX ============ */
            .chat-layout, .chat-container, .chat-main {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                height: calc(100vh - 60px) !important;
            }
            .chat-sidebar, .users-panel, .conversation-list, .chat-list {
                width: 100% !important;
                max-width: 100% !important;
                max-height: 35vh !important;
                overflow-y: auto !important;
                border-right: none !important;
                border-bottom: 1px solid #334155 !important;
            }
            .chat-area, .messages-panel, .chat-window, .chat-body {
                width: 100% !important;
                max-width: 100% !important;
                flex: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                min-height: 0 !important;
            }
            .chat-messages {
                flex: 1 !important;
                overflow-y: auto !important;
                padding: 12px !important;
                padding-bottom: 80px !important;
            }
            .message, .msg-bubble {
                max-width: 80% !important;
                font-size: 14px !important;
            }
            
            /* CRITICAL: Sticky chat input at bottom, NOT covered by browser bar */
            .chat-input-area, .input-area, .chat-input-container {
                position: sticky !important;
                bottom: 0 !important;
                background: white !important;
                padding: 10px !important;
                z-index: 100 !important;
                border-top: 1px solid #e2e8f0 !important;
                padding-bottom: 14px !important;
            }
            [data-theme="dark"] .chat-input-area,
            [data-theme="dark"] .input-area,
            [data-theme="dark"] .chat-input-container {
                background: #1e293b !important;
                border-top-color: #334155 !important;
            }

            .chat-input, .message-input, .input-area input {
                font-size: 14px !important;
                padding: 10px 14px !important;
            }

            .tab-buttons, .chat-tabs { display: flex !important; width: 100% !important; }
            .tab-btn, .chat-tab { flex: 1 !important; padding: 10px !important; font-size: 13px !important; }

            /* Tables scrollable */
            .table-container { overflow-x: auto !important; }
            table { font-size: 12px !important; }

            /* Modals */
            .modal, .modal-box {
                max-width: 95% !important;
                margin: 10px !important;
                padding: 20px !important;
            }
            .modal-actions, .quick-actions { flex-direction: column !important; }
            .modal-actions button { width: 100% !important; }

            /* ============ TEST INTERFACE MOBILE ============ */
            .test-main { grid-template-columns: 1fr !important; }
            .test-sidebar { display: none !important; }
            
            /* CRITICAL: Remove empty space, give more room to question */
            .test-top-bar { padding: 6px 10px !important; font-size: 11px !important; }
            .test-subject-bar { padding: 6px 10px !important; font-size: 12px !important; }
            .question-header { padding: 6px 10px !important; font-size: 12px !important; }
            .question-content { padding: 10px 12px !important; }
            .question-text { min-height: 50px !important; padding: 10px !important; font-size: 14px !important; }
            .answer-section { padding: 0 12px 10px !important; }
            .answer-header { padding: 6px 10px !important; font-size: 12px !important; margin-bottom: 6px !important; }
            .option-item { padding: 8px 12px !important; margin-bottom: 4px !important; }
            .option-item label { font-size: 13px !important; }
            .question-passage { font-size: 12px !important; padding: 10px !important; }

            .test-bottom {
                flex-direction: column !important;
                gap: 6px !important;
                padding: 6px !important;
            }
            .nav-buttons {
                flex-wrap: wrap !important;
                gap: 4px !important;
                justify-content: center !important;
            }
            .nav-btn {
                font-size: 9px !important;
                padding: 4px 6px !important;
                min-width: 46px !important;
            }
            .nav-btn svg { width: 14px !important; height: 14px !important; }
            
            .timer-box {
                padding: 6px 12px !important;
                min-width: auto !important;
            }
            .timer-time { font-size: 18px !important; }
            
            .goto-box { padding: 4px 8px !important; }
            .goto-box label { font-size: 10px !important; }
            .goto-box input { width: 40px !important; padding: 3px 5px !important; }
            .goto-box button { padding: 3px 8px !important; font-size: 10px !important; }

            .sessions-bar {
                overflow-x: auto !important;
                white-space: nowrap;
                padding: 6px !important;
            }
            .session-tab { font-size: 10px !important; padding: 4px 8px !important; }

            .palette-grid { grid-template-columns: repeat(6, 1fr) !important; }

            .field-list { gap: 10px !important; }
            .field-row { padding: 12px !important; flex-wrap: wrap; }
            .field-code-badge { font-size: 10px !important; padding: 3px 8px !important; }

            .profile-header { padding: 20px !important; }
            .profile-tabs { overflow-x: auto !important; white-space: nowrap; }

            .hero-content {
                grid-template-columns: 1fr !important;
                padding: 24px 16px !important;
                text-align: center;
            }
            .hero-title { font-size: 30px !important; }
            .hero-visual { display: none !important; }

            .features-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 480px) {
            .topbar h1 { font-size: 15px !important; }
            .content { padding: 10px !important; }
            .card { padding: 14px !important; }
            .palette-grid { grid-template-columns: repeat(5, 1fr) !important; }
            .field-code-badge { display: none !important; }
        }
    `;
    const style = document.createElement('style');
    style.id = 'nustology-darkmode-styles';
    style.textContent = css;
    document.head.appendChild(style);
})();

function applyDarkModeOverrides() {
    if (document.documentElement.getAttribute('data-theme') !== 'dark') return;
    document.querySelectorAll('*').forEach(el => {
        const inlineBg = el.style.background || el.style.backgroundColor;
        if (inlineBg) {
            const lower = inlineBg.toLowerCase();
            if (lower.includes('white') || lower.includes('#fff') || lower.includes('#ffffff') ||
                lower.includes('rgb(255, 255, 255)') || lower.includes('rgb(255,255,255)')) {
                el.style.setProperty('background', '#1e293b', 'important');
                el.style.setProperty('color', '#f1f5f9', 'important');
            }
        }
    });
}

// Inject sidebar close button on mobile
function injectSidebarCloseButton() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.sidebar-close-mobile')) return;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sidebar-close-mobile';
    closeBtn.setAttribute('aria-label', 'Close sidebar');
    closeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    `;
    closeBtn.onclick = function() {
        sidebar.classList.remove('open');
    };
    sidebar.appendChild(closeBtn);
    
    // Also close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) return;
        if (!sidebar.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
            sidebar.classList.remove('open');
        }
    });
}

window.addEventListener('DOMContentLoaded', function() {
    applyDarkModeOverrides();
    injectSidebarCloseButton();

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
    if (newTheme === 'dark') {
        setTimeout(applyDarkModeOverrides, 50);
    } else {
        setTimeout(() => location.reload(), 100);
    }
};

window.toggleTheme = window.toggleNustologyTheme;
