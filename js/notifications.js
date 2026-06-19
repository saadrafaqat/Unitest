// ============================================
// NUSTOLOGY PREP - NOTIFICATIONS HELPER
// File: js/notifications.js
// Auto-polling and badge updates
// ============================================

const NOTIFICATIONS = {
    API_BASE: '/api',
    POLL_INTERVAL: 60000,    // 60 seconds
    _pollTimer: null,
    _unreadCount: 0,
    _lastFetch: 0,

    // ============================================
    // FETCH METHODS
    // ============================================

    // Get unread count (cached for 60s)
    async getUnreadCount(forceRefresh = false) {
        const now = Date.now();
        if (!forceRefresh && (now - this._lastFetch) < this.POLL_INTERVAL) {
            return this._unreadCount;
        }
        try {
            const token = localStorage.getItem('nustology_token');
            if (!token) return 0;
            const res = await fetch(`${this.API_BASE}/student/notifications/unread-count`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                this._unreadCount = data.count || 0;
                this._lastFetch = now;
                return this._unreadCount;
            }
        } catch (e) {}
        return 0;
    },

    // Get all notifications
    async getAll() {
        try {
            const token = localStorage.getItem('nustology_token');
            if (!token) return [];
            const res = await fetch(`${this.API_BASE}/student/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            return data.success ? (data.notifications || []) : [];
        } catch (e) {
            return [];
        }
    },

    // Mark single notification as read
    async markRead(id) {
        try {
            const token = localStorage.getItem('nustology_token');
            await fetch(`${this.API_BASE}/student/notifications/read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationId: id })
            });
            this._unreadCount = Math.max(0, this._unreadCount - 1);
            this.updateBadge();
        } catch (e) {}
    },

    // Mark all as read
    async markAllRead() {
        try {
            const token = localStorage.getItem('nustology_token');
            await fetch(`${this.API_BASE}/student/notifications/read-all`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            this._unreadCount = 0;
            this.updateBadge();
        } catch (e) {}
    },

    // ============================================
    // BADGE UPDATES
    // ============================================

    // Update all .notif-badge elements on page
    async updateBadge() {
        const count = await this.getUnreadCount();
        const badges = document.querySelectorAll('.notif-badge');
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
        return count;
    },

    // ============================================
    // AUTO POLLING
    // ============================================

    // Start polling every 60 seconds
    startPolling() {
        this.stopPolling();
        // Update immediately
        this.updateBadge();
        // Then every 60 seconds
        this._pollTimer = setInterval(() => {
            this.getUnreadCount(true).then(() => this.updateBadge());
        }, this.POLL_INTERVAL);
    },

    stopPolling() {
        if (this._pollTimer) {
            clearInterval(this._pollTimer);
            this._pollTimer = null;
        }
    },

    // ============================================
    // UI HELPERS
    // ============================================

    // Get icon SVG for notification type
    getIconSvg(type) {
        const icons = {
            'announcement': '<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
            'new_content': '<polyline points="20 6 9 17 4 12"/>',
            'payment': '<rect x="2" y="6" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
            'system': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06"/>',
            'warning': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
        };
        return icons[type] || icons['announcement'];
    },

    // Get color class for notification type
    getTypeClass(type) {
        const classes = {
            'announcement': 'announcement',
            'new_content': 'new_content',
            'payment': 'payment',
            'system': 'system',
            'warning': 'warning'
        };
        return classes[type] || 'announcement';
    },

    // Format time ago
    timeAgo(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = Math.floor((now - date) / 1000);
            if (diff < 60)     return 'Just now';
            if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
            if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
            if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
            return date.toLocaleDateString();
        } catch (e) {
            return dateStr;
        }
    },

    // Show a toast notification
    showToast(message, type = 'info', duration = 3500) {
        const existing = document.getElementById('notif-toast');
        if (existing) existing.remove();

        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#1a56db'
        };
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.id = 'notif-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 80px; left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 18px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            z-index: 99999;
            max-width: 90vw;
            box-shadow: 0 4px 14px rgba(0,0,0,0.2);
            display: flex; align-items: center; gap: 8px;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        }, duration);
    }
};

// Auto-start polling on student pages
if (window.location.pathname.includes('student') ||
    window.location.pathname.includes('test') ||
    window.location.pathname.includes('profile') ||
    window.location.pathname.includes('pdfs') ||
    window.location.pathname.includes('notes') ||
    window.location.pathname.includes('notifications') ||
    window.location.pathname.includes('chat') ||
    window.location.pathname.includes('community') ||
    window.location.pathname.includes('leaderboard')) {
    if (localStorage.getItem('nustology_token')) {
        document.addEventListener('DOMContentLoaded', () => {
            NOTIFICATIONS.startPolling();
        });
    }
}

window.NOTIFICATIONS = NOTIFICATIONS;
