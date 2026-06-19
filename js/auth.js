// ============================================
// NUSTOLOGY PREP - AUTH HELPER
// File: js/auth.js
// ============================================

const AUTH = {
    API_BASE: '/api',
    TOKEN_KEY: 'nustology_token',
    USER_KEY: 'nustology_user',
    ADMIN_TOKEN_KEY: 'nustology_admin_token',

    // ============================================
    // STUDENT AUTH
    // ============================================

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    getUser() {
        const u = localStorage.getItem(this.USER_KEY);
        try {
            return u ? JSON.parse(u) : null;
        } catch (e) {
            return null;
        }
    },

    setSession(token, user) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    updateUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    // ============================================
    // ADMIN AUTH
    // ============================================

    getAdminToken() {
        return localStorage.getItem(this.ADMIN_TOKEN_KEY);
    },

    setAdminToken(token) {
        localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
    },

    isAdminLoggedIn() {
        return !!this.getAdminToken();
    },

    // ============================================
    // REQUEST HEADERS
    // ============================================

    headers(json = true) {
        const h = { 'Authorization': `Bearer ${this.getToken()}` };
        if (json) h['Content-Type'] = 'application/json';
        return h;
    },

    adminHeaders(json = true) {
        const h = { 'Authorization': `Bearer ${this.getAdminToken()}` };
        if (json) h['Content-Type'] = 'application/json';
        return h;
    },

    // ============================================
    // CATEGORY & ACCESS CONTROL
    // ============================================

    getDegreeCategory() {
        const user = this.getUser();
        return user ? (user.degreeCategory || user.field || 'Engineering') : 'Engineering';
    },

    getAllowedFields() {
        const category = this.getDegreeCategory();
        const mapping = {
            'Engineering':       ['Engineering', 'NET-Engineering'],
            'CS':                ['Engineering', 'NET-Engineering'],
            'Computing':         ['Engineering', 'NET-Engineering'],
            'Applied Sciences':  ['Applied Sciences', 'NET-Applied Sciences'],
            'Business':          ['Business', 'NET-Business Studies'],
            'Architecture':      ['Architecture', 'NET-Architecture'],
            'Natural Sciences':  ['Natural Sciences', 'NET-Natural Sciences']
        };
        return mapping[category] || ['Engineering', 'NET-Engineering'];
    },

    canAccessField(field) {
        const allowed = this.getAllowedFields();
        return allowed.some(f =>
            f.toLowerCase() === field.toLowerCase() ||
            field.toLowerCase().includes(f.toLowerCase()) ||
            f.toLowerCase().includes(field.toLowerCase())
        );
    },

    getCategoryDisplayName() {
        const category = this.getDegreeCategory();
        const names = {
            'Engineering':      'NET Engineering',
            'CS':               'NET Engineering (CS)',
            'Computing':        'NET Engineering (Computing)',
            'Applied Sciences': 'NET Applied Sciences',
            'Business':         'NET Business Studies',
            'Architecture':     'NET Architecture',
            'Natural Sciences': 'NET Natural Sciences'
        };
        return names[category] || category;
    },

    getSubjectsForCategory() {
        const category = this.getDegreeCategory();
        const subjects = {
            'Engineering':      ['Physics', 'Mathematics', 'Chemistry', 'English', 'Intelligence'],
            'CS':               ['Physics', 'Mathematics', 'Chemistry', 'English', 'Intelligence'],
            'Computing':        ['Physics', 'Mathematics', 'Chemistry', 'English', 'Intelligence'],
            'Applied Sciences': ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English'],
            'Business':         ['Business Studies', 'Economics', 'Mathematics', 'English', 'Accounting'],
            'Architecture':     ['Mathematics', 'Physics', 'Drawing', 'English', 'General Knowledge'],
            'Natural Sciences': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
        };
        return subjects[category] || subjects['Engineering'];
    },

    getPreferencesForCategory(category) {
        const cat = category || this.getDegreeCategory();
        const preferences = {
            'Engineering': [
                'SEECS - School of Electrical Engineering & Computer Science',
                'SMME - School of Mechanical & Manufacturing Engineering',
                'SCEE - School of Civil & Environmental Engineering',
                'SADA - School of Art, Design & Architecture',
                'SCME - School of Chemical & Materials Engineering',
                'SNS - School of Natural Sciences',
                'IGIS - Institute of Geographical Information Systems',
                'IESE - Institute of Environmental Sciences & Engineering',
                'NIT - NUST Institute of Technology',
                'MCS - Military College of Signals',
                'MCE - Military College of Engineering',
                'PNS Jauhar - Naval Engineering'
            ],
            'CS': [
                'SEECS - BS Computer Science',
                'SEECS - BS Software Engineering',
                'SEECS - BS Electrical Engineering',
                'MCS - BS Computer Science',
                'RIMMS - BS Data Science',
                'IESE - BS Environmental Engineering'
            ],
            'Computing': [
                'SEECS - BS Computer Science',
                'SEECS - BS Software Engineering',
                'SEECS - BS Artificial Intelligence',
                'MCS - BS Computer Science',
                'RIMMS - BS Data Science'
            ],
            'Applied Sciences': [
                'ASAB - Atta-ur-Rahman School of Applied Biosciences',
                'SNS - School of Natural Sciences (Biology)',
                'SNS - School of Natural Sciences (Chemistry)',
                'SNS - School of Natural Sciences (Physics)',
                'IBBT - Institute of Biomedical & Health Sciences',
                'IESE - Environmental Sciences'
            ],
            'Business': [
                'NBS - NUST Business School (BBA)',
                'NBS - NUST Business School (BS Accounting & Finance)',
                'NBS - NUST Business School (BS Economics)',
                'ASAB - BS Food Science & Technology',
                'RIMMS - BS Management Sciences'
            ],
            'Architecture': [
                'SADA - BS Architecture',
                'SADA - BS Industrial Design',
                'SADA - BS City & Regional Planning',
                'SADA - BS Architectural Engineering'
            ],
            'Natural Sciences': [
                'SNS - BS Mathematics',
                'SNS - BS Physics',
                'SNS - BS Chemistry',
                'SNS - BS Computational Sciences',
                'SEECS - BS Applied Mathematics',
                'RIMMS - BS Statistics'
            ]
        };
        return preferences[cat] || preferences['Engineering'];
    },

    // ============================================
    // APPROVAL STATUS
    // ============================================

    isApproved() {
        const user = this.getUser();
        return user ? (user.isApproved === true || user.isApproved === 1) : false;
    },

    getApprovalStatus() {
        const user = this.getUser();
        return user ? (user.approvalStatus || 'pending') : 'pending';
    },

    // ============================================
    // NOTIFICATIONS
    // ============================================

    _notifCount: 0,
    _notifLastFetch: 0,

    async getUnreadNotificationCount(forceRefresh = false) {
        const now = Date.now();
        if (!forceRefresh && (now - this._notifLastFetch) < 60000) {
            return this._notifCount;
        }
        try {
            const res = await fetch(`${this.API_BASE}/student/notifications/unread-count`, {
                headers: this.headers()
            });
            const data = await res.json();
            if (data.success) {
                this._notifCount = data.count || 0;
                this._notifLastFetch = now;
                return this._notifCount;
            }
        } catch (e) {}
        return 0;
    },

    async updateNotificationBadge() {
        const count = await this.getUnreadNotificationCount();
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
    // PAGE GUARDS
    // ============================================

    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    },

    requireAdmin() {
        if (!this.isAdminLoggedIn()) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    },

    requireApproved() {
        if (!this.isLoggedIn()) {
            window.location.href = '/index.html';
            return false;
        }
        if (!this.isApproved()) {
            window.location.href = '/payment-pending.html';
            return false;
        }
        return true;
    },

    // ============================================
    // LOGOUT
    // ============================================

    async logout() {
        const token = this.getToken();
        if (token) {
            try {
                await fetch(`${this.API_BASE}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {}
        }
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.location.href = '/index.html';
    },

    async logoutAdmin() {
        const token = this.getAdminToken();
        if (token) {
            try {
                await fetch(`${this.API_BASE}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {}
        }
        localStorage.removeItem(this.ADMIN_TOKEN_KEY);
        window.location.href = '/index.html';
    },

    // ============================================
    // VERIFY SESSION
    // ============================================

    async verify() {
        try {
            const res = await fetch(`${this.API_BASE}/auth/verify`, {
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            const data = await res.json();
            if (data.success && data.user) {
                this.updateUser(data.user);
                return data.user;
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    async verifyAdmin() {
        try {
            const res = await fetch(`${this.API_BASE}/auth/verify`, {
                headers: { 'Authorization': `Bearer ${this.getAdminToken()}` }
            });
            const data = await res.json();
            if (data.success && data.admin) return data.admin;
            return null;
        } catch (e) {
            return null;
        }
    },

    // ============================================
    // REGISTRATION
    // ============================================

    async register(formData) {
        try {
            const res = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    async checkUsername(username) {
        try {
            const res = await fetch(`${this.API_BASE}/auth/check-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            return await res.json();
        } catch (e) {
            return { success: false, available: false };
        }
    },

    async getPaymentInfo() {
        try {
            const res = await fetch(`${this.API_BASE}/auth/payment-info`);
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    async forgotPassword(email, username) {
        try {
            const res = await fetch(`${this.API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username })
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    // ============================================
    // FILE UPLOADS (CLOUDINARY)
    // ============================================

    async uploadImage(file, folder = 'uploads') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        try {
            const res = await fetch(`${this.API_BASE}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getToken()}` },
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed. Try again.' };
        }
    },

    async uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${this.API_BASE}/student/upload-profile-pic`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getToken()}` },
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed. Try again.' };
        }
    },

    async uploadAdminFile(file, folder = 'uploads') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        try {
            const res = await fetch(`${this.API_BASE}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAdminToken()}` },
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed. Try again.' };
        }
    },

    // Upload during registration (no auth required for payment screenshot)
    async uploadRegistrationImage(file) {
        // Use FormData approach via Cloudinary unsigned upload directly
        // Falls back to API if needed
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'payment-screenshots');
        try {
            // Try unsigned upload first (no auth needed)
            const res = await fetch(`${this.API_BASE}/upload`, {
                method: 'POST',
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed. Try again.' };
        }
    },

    // ============================================
    // API REQUEST HELPERS
    // ============================================

    async get(endpoint, isAdmin = false) {
        try {
            const res = await fetch(`${this.API_BASE}/${endpoint}`, {
                headers: isAdmin ? this.adminHeaders() : this.headers()
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    async post(endpoint, data, isAdmin = false) {
        try {
            const res = await fetch(`${this.API_BASE}/${endpoint}`, {
                method: 'POST',
                headers: isAdmin ? this.adminHeaders() : this.headers(),
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    async delete(endpoint, isAdmin = false) {
        try {
            const res = await fetch(`${this.API_BASE}/${endpoint}`, {
                method: 'DELETE',
                headers: isAdmin ? this.adminHeaders() : this.headers()
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    // ============================================
    // UI HELPERS
    // ============================================

    showToast(message, type = 'info', duration = 3500) {
        const existing = document.getElementById('auth-toast');
        if (existing) existing.remove();

        const colors = {
            success: '#10b981',
            error:   '#ef4444',
            warning: '#f59e0b',
            info:    '#6366f1'
        };
        const icons = {
            success: '✓', error: '✕', warning: '⚠', info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.id = 'auth-toast';
        toast.style.cssText = `
            position: fixed; bottom: 80px; left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white; padding: 12px 20px;
            border-radius: 10px; font-size: 14px; font-weight: 500;
            z-index: 99999; max-width: 90vw; text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex; align-items: center; gap: 8px;
            opacity: 0; transition: opacity 0.2s ease;
        `;
        toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => { toast.style.opacity = '1'; });

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        }, duration);
    },

    showLoading(message = 'Loading...') {
        const existing = document.getElementById('auth-loading');
        if (existing) return;

        const overlay = document.createElement('div');
        overlay.id = 'auth-loading';
        overlay.style.cssText = `
            position: fixed; inset: 0;
            background: rgba(15, 23, 42, 0.75);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            z-index: 99998; gap: 12px;
        `;
        overlay.innerHTML = `
            <div style="
                width: 36px; height: 36px;
                border: 3px solid #334155;
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 0.7s linear infinite;
            "></div>
            <p style="color: #f1f5f9; font-size: 14px; margin: 0;">${message}</p>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        `;
        document.body.appendChild(overlay);
    },

    hideLoading() {
        const overlay = document.getElementById('auth-loading');
        if (overlay) overlay.remove();
    },

    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        } catch (e) { return dateStr; }
    },

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
            return this.formatDate(dateStr);
        } catch (e) { return dateStr; }
    },

    getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    },

    getScoreColor(percentage) {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        if (percentage >= 40) return '#f97316';
        return '#ef4444';
    },

    getGrade(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    }
};

// ============================================
// GLOBAL API HELPER
// ============================================

const API = {
    BASE: '/api',

    async get(endpoint, token = null) {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        try {
            const res = await fetch(`${this.BASE}/${endpoint}`, { headers });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    async post(endpoint, data, token = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        try {
            const res = await fetch(`${this.BASE}/${endpoint}`, {
                method: 'POST', headers,
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    async delete(endpoint, token = null) {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        try {
            const res = await fetch(`${this.BASE}/${endpoint}`, {
                method: 'DELETE', headers
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    async uploadForm(endpoint, formData, token = null) {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        try {
            const res = await fetch(`${this.BASE}/${endpoint}`, {
                method: 'POST', headers, body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    async exportCSV(endpoint, filename, token = null) {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        try {
            const res = await fetch(`${this.BASE}/${endpoint}`, { headers });
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'export.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return { success: true };
        } catch (e) {
            return { success: false, message: 'Export failed' };
        }
    }
};

window.AUTH = AUTH;
window.API = API;
