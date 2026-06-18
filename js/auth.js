// ============================================
// NUSTOLOGY PREP - AUTH HELPER
// File: js/auth.js
// ============================================

const AUTH = {
    API_BASE: '/api',
    TOKEN_KEY: 'nustology_token',
    USER_KEY: 'nustology_user',
    ADMIN_TOKEN_KEY: 'nustology_admin_token',

    // ============ STUDENT AUTH ============
    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    getUser() {
        const u = localStorage.getItem(this.USER_KEY);
        return u ? JSON.parse(u) : null;
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

    // ============ ADMIN AUTH ============
    getAdminToken() {
        return localStorage.getItem(this.ADMIN_TOKEN_KEY);
    },

    setAdminToken(token) {
        localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
    },

    isAdminLoggedIn() {
        return !!this.getAdminToken();
    },

    // ============ REQUEST HEADERS ============
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

    // ============ PROTECTED PAGE GUARD ============
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

    // ============ LOGOUT ============
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

    // ============ VERIFY SESSION ============
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
    }
};

// Make available globally
window.AUTH = AUTH;
