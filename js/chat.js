// ============================================
// NUSTOLOGY PREP - CHAT SYSTEM
// File: js/chat.js
// ============================================

const CHAT = {
    API_BASE: '/api',
    pollInterval: null,

    // ============ HEADERS ============
    headers() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('nustology_token')}`
        };
    },

    // ============ GROUP CHAT ============
    async getGroupMessages() {
        try {
            const res = await fetch(`${this.API_BASE}/chat/group/messages`, {
                headers: this.headers()
            });
            return await res.json();
        } catch (e) {
            return { success: false, messages: [] };
        }
    },

    async sendGroupMessage(message) {
        try {
            const res = await fetch(`${this.API_BASE}/chat/group/send`, {
                method: 'POST',
                headers: this.headers(),
                body: JSON.stringify({ message })
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    // ============ PRIVATE CHAT ============
    async getUsers() {
        try {
            const res = await fetch(`${this.API_BASE}/chat/private/users`, {
                headers: this.headers()
            });
            return await res.json();
        } catch (e) {
            return { success: false, users: [] };
        }
    },

    async getPrivateMessages(otherId) {
        try {
            const res = await fetch(`${this.API_BASE}/chat/private/messages/${otherId}`, {
                headers: this.headers()
            });
            return await res.json();
        } catch (e) {
            return { success: false, messages: [] };
        }
    },

    async sendPrivateMessage(toId, message) {
        try {
            const res = await fetch(`${this.API_BASE}/chat/private/send`, {
                method: 'POST',
                headers: this.headers(),
                body: JSON.stringify({ toId, message })
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    // ============ REPORT ============
    async reportUser(reportedId, reason, chatContext = '') {
        try {
            const res = await fetch(`${this.API_BASE}/chat/report`, {
                method: 'POST',
                headers: this.headers(),
                body: JSON.stringify({ reportedId, reason, chatContext })
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    // ============ POLLING (live updates) ============
    startPolling(callback, intervalMs = 4000) {
        this.stopPolling();
        this.pollInterval = setInterval(callback, intervalMs);
    },

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },

    // ============ COMMUNITY POSTS ============
    async getPosts() {
        try {
            const res = await fetch(`${this.API_BASE}/posts`, { headers: this.headers() });
            return await res.json();
        } catch (e) {
            return { success: false, posts: [] };
        }
    },

    async createPost(title, content, category = 'general') {
        try {
            const res = await fetch(`${this.API_BASE}/posts`, {
                method: 'POST',
                headers: this.headers(),
                body: JSON.stringify({ title, content, category })
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    async likePost(postId) {
        try {
            const res = await fetch(`${this.API_BASE}/posts/${postId}/like`, {
                method: 'POST',
                headers: this.headers()
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    async getComments(postId) {
        try {
            const res = await fetch(`${this.API_BASE}/posts/${postId}/comments`, {
                headers: this.headers()
            });
            return await res.json();
        } catch (e) {
            return { success: false, comments: [] };
        }
    },

    async addComment(postId, comment) {
        try {
            const res = await fetch(`${this.API_BASE}/posts/${postId}/comments`, {
                method: 'POST',
                headers: this.headers(),
                body: JSON.stringify({ comment })
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    // ============ MESSAGE RENDERING HELPERS ============
    renderGroupMessage(msg, currentUserId) {
        const isOwn = msg.student_id === currentUserId;
        const time = new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const safeMsg = this.escapeHtml(msg.message);
        const name = msg.full_name || msg.username;
        const initials = this.getInitials(name);

        if (isOwn) {
            return `
                <div class="chat-msg own">
                    <div class="msg-bubble own">
                        <div class="msg-text">${safeMsg}</div>
                        <div class="msg-time">${time}</div>
                    </div>
                </div>`;
        } else {
            return `
                <div class="chat-msg other">
                    <div class="msg-avatar" style="background:${this.avatarColor(name)};">${initials}</div>
                    <div class="msg-bubble">
                        <div class="msg-author">${this.escapeHtml(name)}</div>
                        <div class="msg-text">${safeMsg}</div>
                        <div class="msg-time">${time}</div>
                    </div>
                </div>`;
        }
    },

    renderPrivateMessage(msg, currentUserId) {
        const isOwn = msg.from_id === currentUserId;
        const time = new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const safeMsg = this.escapeHtml(msg.message);
        return `
            <div class="chat-msg ${isOwn ? 'own' : 'other'}">
                <div class="msg-bubble ${isOwn ? 'own' : ''}">
                    <div class="msg-text">${safeMsg}</div>
                    <div class="msg-time">${time}</div>
                </div>
            </div>`;
    },

    // ============ UTILITIES ============
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    avatarColor(name) {
        const colors = ['#1a56db', '#0ea5e9', '#22c55e', '#f59e0b', '#9333ea', '#ec4899', '#14b8a6'];
        if (!name) return colors[0];
        let h = 0;
        for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
        return colors[h % colors.length];
    }
};

window.CHAT = CHAT;
