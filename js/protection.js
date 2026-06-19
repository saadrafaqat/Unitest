// ============================================
// NUSTOLOGY PREP - SILENT CODE PROTECTION
// File: js/protection.js
// Blocks inspect/source but allows COPY (including right-click copy)
// ============================================

(function() {
    'use strict';

    // Skip on admin page
    if (window.location.pathname.includes('admin')) return;

    // ============ 1. SMART RIGHT-CLICK HANDLING ============
    // Allow right-click ONLY if there's selected text (for copy menu)
    // Block right-click on images and empty areas
    document.addEventListener('contextmenu', function(e) {
        const selection = window.getSelection().toString().trim();
        
        // If user has selected text, allow right-click (for copy menu)
        if (selection.length > 0) {
            return true; // Allow context menu
        }
        
        // Otherwise, block it
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // ============ 2. BLOCK KEYBOARD SHORTCUTS ============
    document.addEventListener('keydown', function(e) {
        const key = e.key ? e.key.toLowerCase() : '';
        const code = e.keyCode;

        // F12 - Open DevTools
        if (key === 'f12' || code === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl/Cmd + Shift + I, J, C, K - DevTools shortcuts
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

        // Ctrl/Cmd + S - Save Page
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

        // NOTE: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A are NOT blocked
        // Users can copy, paste, cut, and select all freely
    }, true);

    // ============ 3. BLOCK IMAGE DRAGGING (but allow copy) ============
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, true);

})();
