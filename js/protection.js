// ============================================
// NUSTOLOGY PREP - AGGRESSIVE CODE PROTECTION
// File: js/protection.js
// MAXIMUM SECURITY MODE
// ============================================

(function() {
    'use strict';

    // Skip on admin page
    if (window.location.pathname.includes('admin')) {
        console.log('%c⚙️ Admin mode', 'color: #fbbf24;');
        return;
    }

    // ============ AGGRESSIVE CONFIG ============
    const CONFIG = {
        redirectURL: '/index.html',
        warningRedirectDelay: 2000,      // 2 seconds before redirect
        maxStrikes: 1,                    // Strikes before action (1 = instant)
        logoutOnDetection: true,          // Log user out
        clearStorageOnDetection: false,   // Wipe localStorage (true = nuclear option)
        blockUntilReload: true            // Show block screen until reload
    };

    let strikeCount = 0;
    let isBlocked = false;

    // ============ HELPER: TRIGGER PROTECTION ============
    function triggerProtection(reason) {
        if (isBlocked) return;
        
        strikeCount++;
        console.warn(`⚠️ Strike ${strikeCount}/${CONFIG.maxStrikes}: ${reason}`);
        
        if (strikeCount >= CONFIG.maxStrikes) {
            executeProtection(reason);
        } else {
            showAggressiveWarning(reason, CONFIG.maxStrikes - strikeCount);
        }
    }

    function executeProtection(reason) {
        if (isBlocked) return;
        isBlocked = true;

        // Show full-screen block
        showBlockScreen(reason);

        // Logout user
        if (CONFIG.logoutOnDetection) {
            try {
                // Don't clear admin token (in case it was set)
                const adminToken = localStorage.getItem('nustology_admin_token');
                
                if (CONFIG.clearStorageOnDetection) {
                    localStorage.clear();
                    sessionStorage.clear();
                } else {
                    localStorage.removeItem('nustology_token');
                    localStorage.removeItem('nustology_user');
                    sessionStorage.clear();
                }
                
                // Restore admin token if existed
                if (adminToken) localStorage.setItem('nustology_admin_token', adminToken);
            } catch(e) {}
        }

        // Redirect after delay
        setTimeout(() => {
            window.location.href = CONFIG.redirectURL;
        }, CONFIG.warningRedirectDelay);
    }

    // ============ 1. DISABLE RIGHT CLICK ============
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        triggerProtection('Right-click attempted');
        return false;
    }, true);

    // ============ 2. BLOCK ALL DEVTOOLS SHORTCUTS ============
    document.addEventListener('keydown', function(e) {
        const key = e.key ? e.key.toLowerCase() : '';
        const code = e.keyCode;

        // F12
        if (key === 'f12' || code === 123) {
            e.preventDefault();
            e.stopPropagation();
            triggerProtection('F12 key pressed');
            return false;
        }

        // Ctrl/Cmd + Shift + I, J, C, K
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            if (['i', 'j', 'c', 'k'].includes(key) || [73, 74, 67, 75].includes(code)) {
                e.preventDefault();
                e.stopPropagation();
                triggerProtection('DevTools shortcut');
                return false;
            }
        }

        // Ctrl/Cmd + U (View Source)
        if ((e.ctrlKey || e.metaKey) && (key === 'u' || code === 85)) {
            e.preventDefault();
            e.stopPropagation();
            triggerProtection('View source attempted');
            return false;
        }

        // Ctrl/Cmd + S (Save)
        if ((e.ctrlKey || e.metaKey) && (key === 's' || code === 83)) {
            e.preventDefault();
            e.stopPropagation();
            triggerProtection('Save attempted');
            return false;
        }

        // Ctrl/Cmd + P (Print)
        if ((e.ctrlKey || e.metaKey) && (key === 'p' || code === 80)) {
            e.preventDefault();
            e.stopPropagation();
            triggerProtection('Print attempted');
            return false;
        }

        // Ctrl/Cmd + Shift + Delete (Clear browser data trick)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === 'delete' || code === 46)) {
            e.preventDefault();
            return false;
        }

    }, true);

    // ============ 3. DETECT DEVTOOLS - MULTIPLE METHODS ============
    let devtoolsCheckActive = true;

    // Method 1: Window size detection (very fast)
    function checkWindowSize() {
        if (!devtoolsCheckActive || isBlocked) return;
        
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        
        if (widthDiff > threshold || heightDiff > threshold) {
            triggerProtection('DevTools detected (window size)');
        }
    }

    // Method 2: Debugger statement timing
    function debuggerCheck() {
        if (!devtoolsCheckActive || isBlocked) return;
        
        const start = performance.now();
        // This debugger pauses ONLY when DevTools is open
        (function() { debugger; })();
        const duration = performance.now() - start;
        
        if (duration > 100) {
            triggerProtection('DevTools detected (debugger)');
        }
    }

    // Method 3: Console.log object inspection trick
    function consoleCheck() {
        if (!devtoolsCheckActive || isBlocked) return;
        
        let isDetected = false;
        const detector = {
            toString: function() {
                isDetected = true;
                return 'DevTools detected';
            }
        };
        
        console.log('%c', detector);
        console.clear();
        
        if (isDetected) {
            triggerProtection('DevTools detected (console)');
        }
    }

    // Method 4: Function.toString trick
    function toStringCheck() {
        if (!devtoolsCheckActive || isBlocked) return;
        
        const before = performance.now();
        const arr = new Array(50).fill(0);
        arr.toString = function() {
            triggerProtection('DevTools detected (toString)');
            return '';
        };
        console.log(arr);
        console.clear();
    }

    // Run all checks aggressively
    setInterval(checkWindowSize, 500);
    setInterval(debuggerCheck, 1000);
    setInterval(consoleCheck, 1500);
    setInterval(toStringCheck, 2000);

    // ============ 4. BLOCK IMAGE DRAGGING & SELECTION ============
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
            e.preventDefault();
            return false;
        }
    }, true);

    // ============ 5. BLOCK COPY ON SENSITIVE ELEMENTS ============
    document.addEventListener('copy', function(e) {
        const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag !== 'input' && tag !== 'textarea') {
            e.preventDefault();
            return false;
        }
    }, true);

    // ============ 6. AGGRESSIVE CONSOLE CLEARING ============
    setInterval(() => {
        if (isBlocked) return;
        try {
            console.clear();
            const styles = [
                'color: red',
                'font-size: 50px',
                'font-weight: bold',
                'text-shadow: 2px 2px 0 black',
                'padding: 20px'
            ].join(';');
            console.log('%c⛔ STOP!', styles);
            console.log(
                '%cAccessing developer tools will result in immediate logout.\n© NUSTology Prep.',
                'color: #ef4444; font-size: 16px; font-weight: bold;'
            );
        } catch(e) {}
    }, 500);

    // ============ 7. DETECT VIEW-SOURCE ============
    if (window.location.href.startsWith('view-source:') || 
        window.location.protocol === 'view-source:') {
        document.documentElement.innerHTML = '';
        window.location.href = CONFIG.redirectURL;
    }

    // ============ 8. OVERRIDE CONSOLE METHODS (NUCLEAR OPTION) ============
    if (!window.location.hostname.includes('localhost') && 
        !window.location.hostname.includes('127.0.0.1')) {
        
        const noop = function() {};
        const consoleMethods = ['log', 'warn', 'error', 'info', 'debug', 'trace', 
                                'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 
                                'profile', 'profileEnd', 'count', 'assert', 'table'];
        
        // Don't completely break console, just neutralize for non-essential use
        // (Comment this out if it breaks your site)
        /*
        consoleMethods.forEach(method => {
            try { console[method] = noop; } catch(e) {}
        });
        */
    }

    // ============ 9. BLOCK IFRAME EMBEDDING ============
    if (window.self !== window.top) {
        try {
            window.top.location = window.self.location;
        } catch(e) {
            document.body.innerHTML = '<h1 style="text-align:center;color:red;">Embedding not allowed</h1>';
        }
    }

    // ============ 10. WARNING TOAST ============
    function showAggressiveWarning(reason, strikesLeft) {
        const existing = document.getElementById('protection-warning');
        if (existing) existing.remove();

        const warning = document.createElement('div');
        warning.id = 'protection-warning';
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ef4444, #991b1b);
            color: white;
            padding: 16px 28px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.5);
            z-index: 999999;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideDownAggressive 0.3s ease;
            max-width: 90%;
            border: 2px solid #fca5a5;
        `;
        warning.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
                <div style="font-weight:700; font-size:15px;">${reason}</div>
                <div style="font-size:12px; opacity:0.9; margin-top:2px;">
                    ${strikesLeft > 0 ? `${strikesLeft} warning(s) before logout` : 'Final warning!'}
                </div>
            </div>
        `;

        // Add animation
        if (!document.getElementById('protection-styles')) {
            const styles = document.createElement('style');
            styles.id = 'protection-styles';
            styles.innerHTML = `
                @keyframes slideDownAggressive {
                    from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes pulseRed {
                    0%, 100% { box-shadow: 0 10px 40px rgba(239, 68, 68, 0.5); }
                    50% { box-shadow: 0 10px 60px rgba(239, 68, 68, 0.9); }
                }
                #protection-warning {
                    animation: slideDownAggressive 0.3s ease, pulseRed 1s infinite;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(warning);
        setTimeout(() => warning.remove(), 3000);
    }

    // ============ 11. FULL-SCREEN BLOCK ============
    function showBlockScreen(reason) {
        // Hide everything
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0; padding:0; overflow:hidden;';
        
        const overlay = document.createElement('div');
        overlay.id = 'protection-block-screen';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            padding: 20px;
        `;
        overlay.innerHTML = `
            <div style="text-align: center; max-width: 500px; animation: fadeIn 0.5s ease;">
                <div style="font-size: 100px; margin-bottom: 24px; animation: shake 0.5s ease;">⛔</div>
                <h1 style="color: #ef4444; font-size: 36px; margin-bottom: 16px; font-family: 'Space Grotesk', sans-serif; font-weight: 800;">
                    ACCESS BLOCKED
                </h1>
                <div style="background: rgba(239,68,68,0.15); border: 2px solid #ef4444; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <p style="color: #fca5a5; font-size: 14px; margin-bottom: 8px; font-weight: 600;">
                        Detection Reason:
                    </p>
                    <p style="color: white; font-size: 16px; font-weight: 700;">
                        ${reason}
                    </p>
                </div>
                <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Unauthorized access to developer tools has been detected.<br>
                    You are being logged out and redirected.
                </p>
                <div style="margin-top: 24px;">
                    <div style="width: 60px; height: 60px; border: 4px solid #ef4444; border-top-color: transparent; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;"></div>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 16px;">
                        Redirecting in ${CONFIG.warningRedirectDelay / 1000} seconds...
                    </p>
                </div>
                <p style="color: #64748b; font-size: 11px; margin-top: 32px;">
                    © NUSTology Prep. - Security incident logged
                </p>
            </div>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(overlay);
    }

    // ============ INITIAL WARNING ============
    console.log(
        '%c🛡️ MAXIMUM SECURITY ACTIVE',
        'background: red; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;'
    );
    console.log(
        '%c⚠️ Opening DevTools will trigger immediate logout',
        'color: red; font-size: 14px; font-weight: bold;'
    );

})();
