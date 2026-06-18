// ============================================
// NUSTOLOGY PREP - ADMIN HELPER
// File: js/admin.js
// ============================================

const ADMIN = {
    API_BASE: '/api',

    // ============ AUTH ============
    getToken() {
        return localStorage.getItem('nustology_admin_token');
    },

    setToken(token) {
        localStorage.setItem('nustology_admin_token', token);
    },

    headers(json = true) {
        const h = { 'Authorization': `Bearer ${this.getToken()}` };
        if (json) h['Content-Type'] = 'application/json';
        return h;
    },

    requireAuth() {
        if (!this.getToken()) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    },

    async logout() {
        const t = this.getToken();
        if (t) {
            try {
                await fetch(`${this.API_BASE}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${t}` }
                });
            } catch (e) {}
        }
        localStorage.removeItem('nustology_admin_token');
        window.location.href = '/index.html';
    },

    // ============ API CALL ============
    async api(endpoint, options = {}) {
        try {
            const res = await fetch(`${this.API_BASE}${endpoint}`, {
                method: options.method || 'GET',
                headers: this.headers(),
                body: options.body ? JSON.stringify(options.body) : undefined
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Connection error' };
        }
    },

    // ============ STUDENT MANAGEMENT ============
    async getStudents() {
        return await this.api('/admin/students');
    },

    async getStudentDetails(id) {
        return await this.api(`/admin/students/${id}`);
    },

    async addStudent(data) {
        return await this.api('/admin/students', { method: 'POST', body: data });
    },

    async deleteStudent(id) {
        return await this.api(`/admin/students/${id}`, { method: 'DELETE' });
    },

    async issueWarning(studentId, message) {
        return await this.api('/admin/warning', {
            method: 'POST',
            body: { studentId, message }
        });
    },

    // ============ DASHBOARD ============
    async getDashboard() {
        return await this.api('/admin/dashboard');
    },

    async getReports() {
        return await this.api('/admin/reports');
    },

    async getGroupMessages() {
        return await this.api('/admin/group-messages');
    },

    async getLeaderboard() {
        return await this.api('/admin/leaderboard');
    },

    // ============ LECTURES ============
    async getLectures() {
        return await this.api('/lectures');
    },

    async addLecture(data) {
        return await this.api('/lectures', { method: 'POST', body: data });
    },

    async deleteLecture(id) {
        return await this.api(`/lectures/${id}`, { method: 'DELETE' });
    },

    // ============ MERIT LISTS ============
    async getMeritLists() {
        return await this.api('/merit-lists');
    },

    async addMeritList(data) {
        return await this.api('/merit-lists', { method: 'POST', body: data });
    },

    async deleteMeritList(id) {
        return await this.api(`/merit-lists/${id}`, { method: 'DELETE' });
    },

    // ============ PERFORMANCE CALCULATION ============
    calculatePerformance(attempts) {
        const completed = attempts.filter(a => a.status === 'completed');
        if (!completed.length) return 0;
        const avg = completed.reduce((s, a) => s + (a.percentage || 0), 0) / completed.length;
        const consistency = Math.min(100, (completed.length / 10) * 100);
        return Math.round(avg * 0.7 + consistency * 0.3);
    },

    // ============ SETTINGS ============
    async changeCredentials(data) {
        return await this.api('/admin/change-password', { method: 'POST', body: data });
    }
};

window.ADMIN = ADMIN;
