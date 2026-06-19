// ============================================
// NUSTOLOGY PREP - STRICT CODE PROTECTION
// File: js/protection.js
// Blocks: shortcuts, right-click, copy, selection
// ============================================

(function() {
    'use strict';

    // Skip on admin page
    if (window.location.pathname.includes('admin')) return;

    // ============ 1. BLOCK RIGHT CLICK ============
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // ============ 2. BLOCK ALL KEYBOARD SHORTCUTS ============
    document.addEventListener('keydown', function(e) {
        const key = e.key ? e.key.toLowerCase() : '';
        const code = e.keyCode;

        // F12 - DevTools
        if (key === 'f12' || code === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl/Cmd + Shift + I, J, C, K - DevTools
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            if (['i', 'j', 'c', 'k'].includes(key) || [73, 74, 67, 75].includes(code)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }

        // Ctrl/Cmd + U - View Source
        if ((e.ctrlKey || e.metaKey) && (key === 'u' || code === 85)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl/Cmd + S - Save
        if ((e.ctrlKey || e.metaKey) && (key === 's' || code === 83)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl/Cmd + P - Print
        if ((e.ctrlKey || e.metaKey) && (key === 'p' || code === 80)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl/Cmd + C - Copy (BLOCKED, except in input fields)
        if ((e.ctrlKey || e.metaKey) && (key === 'c' || code === 67) && !e.shiftKey) {
            const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }

        // Ctrl/Cmd + X - Cut (BLOCKED, except in input fields)
        if ((e.ctrlKey || e.metaKey) && (key === 'x' || code === 88)) {
            const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }

        // Ctrl/Cmd + A - Select All (BLOCKED, except in input fields)
        if ((e.ctrlKey || e.metaKey) && (key === 'a' || code === 65)) {
            const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }, true);

    // ============ 3. BLOCK TEXT SELECTION (CSS) ============
    const style = document.createElement('style');
    style.id = 'nustology-no-select-style';
    style.textContent = `
        body, body * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        /* Allow selection in input/textarea */
        input, textarea, [contenteditable="true"] {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
            -webkit-touch-callout: default !important;
        }
    `;
    document.head.appendChild(style);

    // ============ 4. BLOCK SELECTION (JS) ============
    document.addEventListener('selectstart', function(e) {
        const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag !== 'input' && tag !== 'textarea') {
            e.preventDefault();
            return false;
        }
    }, true);

    // ============ 5. BLOCK COPY EVENT ============
    document.addEventListener('copy', function(e) {
        const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag !== 'input' && tag !== 'textarea') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // ============ 6. BLOCK CUT EVENT ============
    document.addEventListener('cut', function(e) {
        const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag !== 'input' && tag !== 'textarea') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // ============ 7. BLOCK DRAG ============
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // ============ 8. BLOCK DROP ============
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    }, true);

})();
