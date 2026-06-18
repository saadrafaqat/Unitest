// ============================================
// NUSTOLOGY PREP - MAIN APP UTILITIES
// File: js/app.js
// ============================================

const APP = {
    API_BASE: '/api',

    // ============ API HELPER ============
    async api(endpoint, options = {}) {
        const token = localStorage.getItem('nustology_token');
        const adminToken = localStorage.getItem('nustology_admin_token');
        const useAdmin = options.admin === true;

        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (useAdmin && adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
        } else if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${this.API_BASE}${endpoint}`, {
                method: options.method || 'GET',
                headers,
                body: options.body ? JSON.stringify(options.body) : undefined
            });
            return await res.json();
        } catch (e) {
            console.error('API Error:', e);
            return { success: false, message: 'Connection error' };
        }
    },

    // ============ FORMATTERS ============
    formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    formatDateTime(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    },

    formatTime(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },

    timeAgo(dateStr) {
        if (!dateStr) return '';
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        return this.formatDate(dateStr);
    },

    formatDuration(seconds) {
        if (!seconds) return '0m';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    },

    // ============ HTML SAFETY ============
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // ============ TOAST NOTIFICATIONS ============
    toast(message, type = 'info') {
        const existing = document.getElementById('app-toast');
        if (existing) existing.remove();

        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#1a56db'
        };

        const toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.style.cssText = `
            position: fixed; top: 24px; right: 24px; z-index: 99999;
            background: ${colors[type] || colors.info}; color: white;
            padding: 14px 22px; border-radius: 10px; font-family: 'Inter', sans-serif;
            font-size: 14px; font-weight: 500; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateX(120%); transition: transform 0.3s ease;
            max-width: 320px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ============ CONFIRM MODAL ============
    confirm(message) {
        return window.confirm(message);
    },

    // ============ GET INITIALS ============
    getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    // ============ AVATAR COLOR ============
    avatarColor(name) {
        const colors = ['#1a56db', '#0ea5e9', '#22c55e', '#f59e0b', '#9333ea', '#ec4899', '#14b8a6'];
        if (!name) return colors[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
        return colors[hash % colors.length];
    },

    // ============ YOUTUBE HELPERS ============
    getYouTubeId(url) {
        if (!url) return '';
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
        return match ? match[1] : '';
    },

    getYouTubeThumbnail(url) {
        const id = this.getYouTubeId(url);
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
    }
};

window.APP = APP;
