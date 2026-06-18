// ============================================
// NUSTOLOGY PREP - TEST ENGINE
// File: js/test.js
// ============================================

const TEST_ENGINE = {
    API_BASE: '/api',

    // ============ TEST CONFIGURATIONS ============
    CONFIGS: {
        // Subject-wise tests (per field)
        Engineering: {
            Mathematics:  { questions: 40, marks: 80, duration: 60 },  // 60 min
            Physics:      { questions: 30, marks: 60, duration: 45 },
            English:      { questions: 20, marks: 30, duration: 25 },
            Intelligence: { questions: 20, marks: 30, duration: 25 }
        },
        Medical: {
            Biology:   { questions: 40, marks: 80, duration: 60 },
            Chemistry: { questions: 30, marks: 60, duration: 45 },
            Physics:   { questions: 20, marks: 40, duration: 30 },
            English:   { questions: 15, marks: 20, duration: 20 }
        },
        Business: {
            Mathematics:      { questions: 40, marks: 80, duration: 60 },
            English:          { questions: 25, marks: 50, duration: 35 },
            Intelligence:     { questions: 20, marks: 40, duration: 25 },
            GeneralKnowledge: { questions: 15, marks: 30, duration: 20 }
        },
        Architecture: {
            English:          { questions: 25, marks: 50, duration: 35 },
            Mathematics:      { questions: 25, marks: 50, duration: 35 },
            Drawing:          { questions: 20, marks: 60, duration: 45 },
            GeneralKnowledge: { questions: 20, marks: 40, duration: 25 }
        }
    },

    // Grand Tests (full NET simulation)
    GRAND_TESTS: {
        Engineering: {
            title: 'Engineering Grand Test',
            total: 200,
            duration: 180, // 3 hours
            subjects: { Mathematics: 40, Physics: 30, English: 20, Intelligence: 20 }
        },
        Medical: {
            title: 'Medical Grand Test',
            total: 200,
            duration: 180,
            subjects: { Biology: 40, Chemistry: 30, Physics: 20, English: 15 }
        },
        Business: {
            title: 'Business Grand Test',
            total: 200,
            duration: 180,
            subjects: { Mathematics: 40, English: 25, Intelligence: 20, GeneralKnowledge: 15 }
        },
        Architecture: {
            title: 'Architecture Grand Test',
            total: 200,
            duration: 180,
            subjects: { English: 25, Mathematics: 25, Drawing: 20, GeneralKnowledge: 20 }
        }
    },

    // ============ QUESTION SELECTION ============
    getQuestions(field, subject, count) {
        if (typeof QUESTIONS === 'undefined') {
            console.error('QUESTIONS bank not loaded');
            return [];
        }

        let pool = [];
        try {
            if (QUESTIONS[field] && QUESTIONS[field][subject]) {
                pool = [...QUESTIONS[field][subject]];
            }
        } catch (e) {
            console.error('Error reading questions:', e);
            return [];
        }

        if (pool.length === 0) return [];

        // Shuffle and pick
        pool = this.shuffle(pool);
        return pool.slice(0, Math.min(count, pool.length)).map((q, idx) => ({
            id: q.id || `${field}_${subject}_${idx}`,
            questionText: q.question,
            subject: subject,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || ''
        }));
    },

    // Build a grand test (mixed subjects)
    buildGrandTest(field) {
        const config = this.GRAND_TESTS[field];
        if (!config) return null;

        let allQuestions = [];
        for (const [subject, count] of Object.entries(config.subjects)) {
            const qs = this.getQuestions(field, subject, count);
            allQuestions = allQuestions.concat(qs);
        }

        return {
            title: config.title,
            field,
            type: 'grand',
            totalMarks: config.total,
            duration: config.duration * 60, // seconds
            questions: allQuestions
        };
    },

    // Build a subject test
    buildSubjectTest(field, subject) {
        const config = this.CONFIGS[field]?.[subject];
        if (!config) return null;

        const questions = this.getQuestions(field, subject, config.questions);
        return {
            title: `${subject} - ${field}`,
            field,
            subject,
            type: 'subject',
            totalMarks: config.marks,
            duration: config.duration * 60,
            questions
        };
    },

    // ============ UTILITIES ============
    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    // ============ API CALLS ============
    async startTest(testData) {
        const token = localStorage.getItem('nustology_token');
        try {
            const res = await fetch(`${this.API_BASE}/tests/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    testType: testData.type,
                    field: testData.field,
                    subject: testData.subject || null,
                    totalQuestions: testData.questions.length,
                    totalMarks: testData.totalMarks
                })
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Failed to start test' };
        }
    },

    async submitTest(attemptId, answers, timeTaken) {
        const token = localStorage.getItem('nustology_token');
        try {
            const res = await fetch(`${this.API_BASE}/tests/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ attemptId, answers, timeTaken })
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Failed to submit test' };
        }
    },

    async getMyAttempts() {
        const token = localStorage.getItem('nustology_token');
        try {
            const res = await fetch(`${this.API_BASE}/tests/my-attempts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        } catch (e) {
            return { success: false, attempts: [] };
        }
    },

    async getReview(attemptId) {
        const token = localStorage.getItem('nustology_token');
        try {
            const res = await fetch(`${this.API_BASE}/tests/review/${attemptId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    // ============ SUBJECT LIST PER FIELD ============
    getSubjects(field) {
        return Object.keys(this.CONFIGS[field] || {});
    },

    getAllFields() {
        return Object.keys(this.CONFIGS);
    },

    // ============ STORAGE FOR ACTIVE TEST ============
    saveActiveTest(testData) {
        sessionStorage.setItem('active_test', JSON.stringify(testData));
    },

    getActiveTest() {
        const d = sessionStorage.getItem('active_test');
        return d ? JSON.parse(d) : null;
    },

    clearActiveTest() {
        sessionStorage.removeItem('active_test');
    }
};

window.TEST_ENGINE = TEST_ENGINE;
