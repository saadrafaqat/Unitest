// ============================================
// NUSTOLOGY PREP - FILE UPLOAD HELPER
// File: js/upload.js
// Handles all file uploads to Cloudinary
// ============================================

const UPLOAD = {
    API_BASE: '/api',
    MAX_IMAGE_SIZE: 2 * 1024 * 1024,    // 2MB for images
    MAX_PDF_SIZE: 20 * 1024 * 1024,     // 20MB for PDFs
    MAX_DOC_SIZE: 20 * 1024 * 1024,     // 20MB for documents

    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_PDF_TYPES: ['application/pdf'],
    ALLOWED_DOC_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],

    // ============================================
    // VALIDATION
    // ============================================

    validateImage(file) {
        if (!file) return { valid: false, error: 'No file selected' };
        if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return { valid: false, error: 'Only JPG, PNG, WebP, GIF images allowed' };
        }
        if (file.size > this.MAX_IMAGE_SIZE) {
            return { valid: false, error: `Image must be under ${this.MAX_IMAGE_SIZE / 1024 / 1024}MB` };
        }
        return { valid: true };
    },

    validatePdf(file) {
        if (!file) return { valid: false, error: 'No file selected' };
        if (file.type !== 'application/pdf') {
            return { valid: false, error: 'Only PDF files allowed' };
        }
        if (file.size > this.MAX_PDF_SIZE) {
            return { valid: false, error: `PDF must be under ${this.MAX_PDF_SIZE / 1024 / 1024}MB` };
        }
        return { valid: true };
    },

    validateDoc(file) {
        if (!file) return { valid: false, error: 'No file selected' };
        if (!this.ALLOWED_DOC_TYPES.includes(file.type)) {
            return { valid: false, error: 'Only PDF and image files allowed' };
        }
        if (file.size > this.MAX_DOC_SIZE) {
            return { valid: false, error: `File must be under ${this.MAX_DOC_SIZE / 1024 / 1024}MB` };
        }
        return { valid: true };
    },

    // ============================================
    // PREVIEW
    // ============================================

    // Show image preview in an element
    showImagePreview(file, previewElementId) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const el = document.getElementById(previewElementId);
            if (el) {
                if (el.tagName === 'IMG') {
                    el.src = e.target.result;
                    el.style.display = 'block';
                } else {
                    el.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%; max-height:300px; border-radius:8px;">`;
                }
            }
        };
        reader.readAsDataURL(file);
    },

    // Display file info (name, size)
    showFileInfo(file, infoElementId) {
        const el = document.getElementById(infoElementId);
        if (!el || !file) return;
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const sizeKB = Math.round(file.size / 1024);
        el.innerHTML = `<strong>${this.escapeHtml(file.name)}</strong><br>
                        Type: ${file.type} | Size: ${sizeMB} MB (${sizeKB} KB)`;
        el.classList.add('show');
        el.style.display = 'block';
    },

    // ============================================
    // UPLOAD METHODS
    // ============================================

    // Generic image upload (returns URL)
    async uploadImage(file, folder = 'uploads', isAdmin = false) {
        const v = this.validateImage(file);
        if (!v.valid) return { success: false, message: v.error };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const token = isAdmin
            ? localStorage.getItem('nustology_admin_token')
            : localStorage.getItem('nustology_token');

        try {
            const res = await fetch(`${this.API_BASE}/upload`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed: ' + e.message };
        }
    },

    // Upload profile picture (student)
    async uploadProfilePicture(file) {
        const v = this.validateImage(file);
        if (!v.valid) return { success: false, message: v.error };

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('nustology_token');
            const res = await fetch(`${this.API_BASE}/student/upload-profile-pic`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed' };
        }
    },

    // Upload payment screenshot (during registration - no auth needed)
    async uploadPaymentScreenshot(file) {
        const v = this.validateImage(file);
        if (!v.valid) return { success: false, message: v.error };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'payment-screenshots');

        try {
            const res = await fetch(`${this.API_BASE}/upload`, {
                method: 'POST',
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed' };
        }
    },

    // Admin: Upload PDF
    async uploadAdminPdf(file, metadata) {
        const v = this.validatePdf(file);
        if (!v.valid) return { success: false, message: v.error };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title || '');
        formData.append('description', metadata.description || '');
        formData.append('subject', metadata.subject || '');
        formData.append('field', metadata.field || '');
        formData.append('chapter', metadata.chapter || '');
        formData.append('resourceType', metadata.resourceType || 'past_paper');

        try {
            const token = localStorage.getItem('nustology_admin_token');
            const res = await fetch(`${this.API_BASE}/admin/pdfs`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed' };
        }
    },

    // Admin: Upload Note
    async uploadAdminNote(file, metadata) {
        const v = this.validateDoc(file);
        if (!v.valid) return { success: false, message: v.error };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title || '');
        formData.append('description', metadata.description || '');
        formData.append('subject', metadata.subject || '');
        formData.append('field', metadata.field || '');
        formData.append('chapter', metadata.chapter || '');
        formData.append('noteType', metadata.noteType || 'formula_sheet');

        try {
            const token = localStorage.getItem('nustology_admin_token');
            const res = await fetch(`${this.API_BASE}/admin/notes`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Upload failed' };
        }
    },

    // ============================================
    // PROGRESS-AWARE UPLOAD
    // ============================================

    // Upload with progress callback (uses XHR for progress events)
    uploadWithProgress(url, formData, token, onProgress) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.upload.addEventListener('progress', e => {
                if (e.lengthComputable && onProgress) {
                    const pct = Math.round((e.loaded / e.total) * 100);
                    onProgress(pct);
                }
            });

            xhr.onload = () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                } catch (e) {
                    reject({ success: false, message: 'Invalid response' });
                }
            };

            xhr.onerror = () => reject({ success: false, message: 'Network error' });
            xhr.send(formData);
        });
    },

    // ============================================
    // HELPERS
    // ============================================

    escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#39;'
        }[c]));
    },

    // Get human-readable file size
    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    },

    // Get file extension
    getExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    },

    // Check if file is an image
    isImage(file) {
        return file && file.type.startsWith('image/');
    },

    // Check if file is a PDF
    isPdf(file) {
        return file && file.type === 'application/pdf';
    }
};

// Make available globally
window.UPLOAD = UPLOAD;
