// ============================================
// NUSTOLOGY PREP - CATEGORY ACCESS HELPER
// File: js/categories.js
// Category-based access control utilities
// ============================================

const CATEGORIES = {

    // ============================================
    // CATEGORY DEFINITIONS
    // ============================================

    ALL_CATEGORIES: [
        'Engineering',
        'CS',
        'Computing',
        'Applied Sciences',
        'Business',
        'Architecture',
        'Natural Sciences'
    ],

    // Category → Allowed Test Fields mapping
    FIELD_ACCESS_MAP: {
        'Engineering':       ['Engineering', 'NET-Engineering'],
        'CS':                ['Engineering', 'NET-Engineering'],
        'Computing':         ['Engineering', 'NET-Engineering'],
        'Applied Sciences':  ['Applied Sciences', 'NET-Applied Sciences'],
        'Business':          ['Business', 'NET-Business Studies'],
        'Architecture':      ['Architecture', 'NET-Architecture'],
        'Natural Sciences':  ['Natural Sciences', 'NET-Natural Sciences']
    },

    // Category → Display Name
    DISPLAY_NAMES: {
        'Engineering':      'NET Engineering',
        'CS':               'NET Engineering (CS)',
        'Computing':        'NET Engineering (Computing)',
        'Applied Sciences': 'NET Applied Sciences',
        'Business':         'NET Business Studies',
        'Architecture':     'NET Architecture',
        'Natural Sciences': 'NET Natural Sciences'
    },

    // Category → Subjects (for test selection)
    SUBJECTS_MAP: {
        'Engineering': [
            'Physics', 'Mathematics', 'Chemistry',
            'English', 'Intelligence'
        ],
        'CS': [
            'Physics', 'Mathematics', 'Chemistry',
            'English', 'Intelligence'
        ],
        'Computing': [
            'Physics', 'Mathematics', 'Chemistry',
            'English', 'Intelligence'
        ],
        'Applied Sciences': [
            'Biology', 'Chemistry', 'Physics',
            'Mathematics', 'English'
        ],
        'Business': [
            'Business Studies', 'Economics', 'Mathematics',
            'English', 'Accounting'
        ],
        'Architecture': [
            'Mathematics', 'Physics', 'Drawing',
            'English', 'General Knowledge'
        ],
        'Natural Sciences': [
            'Mathematics', 'Physics', 'Chemistry',
            'Biology', 'English'
        ]
    },

    // Category → Available NUST Programs (preferences)
    PREFERENCES_MAP: {
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
    },

    // ============================================
    // GETTERS
    // ============================================

    // Get current student's degree category from localStorage
    getCurrentCategory() {
        try {
            const user = JSON.parse(localStorage.getItem('nustology_user') || '{}');
            return user.degreeCategory || user.field || 'Engineering';
        } catch (e) {
            return 'Engineering';
        }
    },

    // Get allowed test fields for a category
    getAllowedFields(category) {
        const cat = category || this.getCurrentCategory();
        return this.FIELD_ACCESS_MAP[cat] || ['Engineering', 'NET-Engineering'];
    },

    // Get display name for a category
    getDisplayName(category) {
        const cat = category || this.getCurrentCategory();
        return this.DISPLAY_NAMES[cat] || cat;
    },

    // Get subjects for a category
    getSubjects(category) {
        const cat = category || this.getCurrentCategory();
        return this.SUBJECTS_MAP[cat] || this.SUBJECTS_MAP['Engineering'];
    },

    // Get program preferences for a category
    getPreferences(category) {
        const cat = category || this.getCurrentCategory();
        return this.PREFERENCES_MAP[cat] || this.PREFERENCES_MAP['Engineering'];
    },

    // ============================================
    // ACCESS CHECKS
    // ============================================

    // Check if current user can access a specific field
    canAccessField(field) {
        const allowed = this.getAllowedFields();
        return allowed.some(f =>
            f.toLowerCase() === field.toLowerCase() ||
            field.toLowerCase().includes(f.toLowerCase()) ||
            f.toLowerCase().includes(field.toLowerCase())
        );
    },

    // Check if a category can access a field
    categoryCanAccessField(category, field) {
        const allowed = this.FIELD_ACCESS_MAP[category] || [];
        return allowed.some(f =>
            f.toLowerCase() === field.toLowerCase() ||
            field.toLowerCase().includes(f.toLowerCase()) ||
            f.toLowerCase().includes(field.toLowerCase())
        );
    },

    // ============================================
    // UI HELPERS
    // ============================================

    // Populate a select element with all categories
    populateCategorySelect(selectElementId, includeAll = false) {
        const select = document.getElementById(selectElementId);
        if (!select) return;
        let html = '';
        if (includeAll) html += '<option value="">All Categories</option>';
        this.ALL_CATEGORIES.forEach(cat => {
            html += `<option value="${cat}">${cat}</option>`;
        });
        select.innerHTML = html;
    },

    // Populate a select with preferences for a category
    populatePreferencesSelect(selectElementId, category, currentValue = '') {
        const select = document.getElementById(selectElementId);
        if (!select) return;
        const prefs = this.getPreferences(category);
        let html = '<option value="">Select preference</option>';
        prefs.forEach(p => {
            html += `<option value="${this.escapeHtml(p)}" ${p === currentValue ? 'selected' : ''}>${this.escapeHtml(p)}</option>`;
        });
        select.innerHTML = html;
    },

    // Populate subjects in a select
    populateSubjectsSelect(selectElementId, category, currentValue = '') {
        const select = document.getElementById(selectElementId);
        if (!select) return;
        const subjects = this.getSubjects(category);
        let html = '<option value="">Select subject</option>';
        subjects.forEach(s => {
            html += `<option value="${this.escapeHtml(s)}" ${s === currentValue ? 'selected' : ''}>${this.escapeHtml(s)}</option>`;
        });
        select.innerHTML = html;
    },

    // Show category access notice in an element
    showAccessNotice(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const category = this.getCurrentCategory();
        const fields = this.getAllowedFields(category);
        el.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px; height:18px; flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div><strong>Category: ${this.escapeHtml(category)}</strong> &mdash; You can access ${this.escapeHtml(fields.join(', '))} only.</div>
        `;
    },

    // Render a category badge
    renderBadge(category) {
        const cat = category || this.getCurrentCategory();
        return `<span class="badge badge-info">${this.escapeHtml(cat)}</span>`;
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
    }
};

window.CATEGORIES = CATEGORIES;
