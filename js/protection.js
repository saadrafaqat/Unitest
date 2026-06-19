// ============================================
// NUSTOLOGY PREP - SILENT PROTECTION
// File: js/protection.js
// Minimal, no popups - just screen shake
// ============================================

(function() {
    'use strict';

    // Skip on admin page
    if (window.location.pathname.includes('admin')) return;

    // ============ INJECT SHAKE ANIMATION CSS ============
    const style = document.createElement('style');
    style.id = 'nustology-shake-style';
    style.textContent = `
        @keyframes nustologyShake {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-6px); }
            20% { transform: translateX(6px); }
            30% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            50% { transform: translateX(-3px); }
            60% { transform: translateX(3px); }
            70% { transform: translateX(-2px); }
            80% { transform: translateX(2px); }
            90% { transform: translateX(-1px); }
        }
        
        html.shake-screen {
            animation: nustologyShake 0.4s ease;
        }
    `;
    document.head.appendChild(style);

    // ============ SHAKE FUNCTION ============
    let isShaking = false;
    function shakeScreen() {
        if (isShaking) return;
        isShaking = true;
        
        document.documentElement.classList.add('shake-screen');
        
        setTimeout(() => {
            document.documentElement.classList.remove('shake-screen');
            isShaking = false;
        }, 400);
    }

    // ============ 1. BLOCK RIGHT CLICK ============
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        shakeScreen();
        return false;
    }, true);

    // ============ 2. BLOCK KEYBOARD SHORTCUTS ============
    document.addEventListener('keydown', function(e) {
        const key = e.key ? e.key.toLowerCase() : '';
        const code = e.keyCode;

        // F12
        if (key === 'f12' || code === 123) {
            e.preventDefault();
            e.stopPropagation();
            shakeScreen();
            return false;
        }

        // Ctrl/Cmd + Shift + I, J, C, K
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            if (['i', 'j', 'c', 'k'].includes(key) || [73, 74, 67, 75].includes(code)) {
                e.preventDefault();
                e.stopPropagation();
                shakeScreen();
                return false;
            }
        }

        // Ctrl/Cmd + U (View Source)
        if ((e.ctrlKey || e.metaKey) && (key === 'u' || code === 85)) {
            e.preventDefault();
            e.stopPropagation();
            shakeScreen();
            return false;
        }

        // Ctrl/Cmd + S (Save)
        if ((e.ctrlKey || e.metaKey) && (key === 's' || code === 83)) {
            e.preventDefault();
            e.stopPropagation();
            shakeScreen();
            return false;
        }

        // Ctrl/Cmd + P (Print)
        if ((e.ctrlKey || e.metaKey) && (key === 'p' || code === 80)) {
            e.preventDefault();
            e.stopPropagation();
            shakeScreen();
            return false;
        }
    }, true);

    // ============ 3. BLOCK IMAGE DRAGGING ============
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, true);

    // ============ 4. SILENT CONSOLE CLEARING ============
    setInterval(() => {
        try {
            console.clear();
        } catch(e) {}
    }, 1000);

    // ============ 5. SUBTLE CONSOLE MESSAGE (one-time) ============
    console.log(
        '%c© NUSTology Prep.',
        'color: #1a56db; font-size: 14px; font-weight: bold;'
    );

})();
