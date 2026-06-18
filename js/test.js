// ============================================
// NUSTOLOGY PREP - TEST ENGINE (UPDATED)
// File: js/test.js
// Works with new questions.js (QUESTIONS API)
// ============================================

const TEST_ENGINE = {
    API_BASE: '/api',

    // ============ GET ALL FIELDS ============
    getFields() {
        if (typeof QUESTIONS === 'undefined') {
            console.error('QUESTIONS not loaded');
            return [];
        }
        return QUESTIONS.getFields();
    },

    // ============ GET FIELD CONFIG ============
    getFieldConfig(fieldName) {
        if (typeof QUESTIONS === 'undefined') return null;
        return QUESTIONS.getFieldConfig(fieldName);
    },

    // ============ GET SUBJECTS FOR A FIELD ============
    getSubjects(fieldName) {
        if (typeof QUESTIONS === 'undefined') return [];
        return QUESTIONS.getSubjects(fieldName);
    },

    // ============ GET GRAND TESTS LIST ============
    getGrandTests(fieldName) {
        if (typeof QUESTIONS === 'undefined') return [];
        return QUESTIONS.getGrandTests(fieldName);
    },

    // ============ BUILD SUBJECT TEST ============
    buildSubjectTest(fieldName, subjectKey) {
        if (typeof QUESTIONS === 'undefined') {
            console.error('QUESTIONS not loaded');
            return null;
        }
        return QUESTIONS.buildSubjectTest(fieldName, subjectKey);
    },

    // ============ BUILD GRAND TEST ============
    buildGrandTest(fieldName, grandTestNumber = 1) {
        if (typeof QUESTIONS === 'undefined') {
            console.error('QUESTIONS not loaded');
            return null;
        }
        return QUESTIONS.buildGrandTest(fieldName, grandTestNumber);
    },

    // ============ GET QUESTION POOL STATS ============
    getStats() {
        if (typeof QUESTIONS === 'undefined') return {};
        return QUESTIONS.getStats();
    },

    // ============ FORMAT TIMER ============
    formatTime(seconds) {
        if (!seconds || seconds < 0) return '00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const pad = (n) => n.toString().padStart(2, '0');
        if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
        return `${pad(m)}:${pad(s)}`;
    },

    // ============ FORMAT DURATION (for display) ============
    formatDuration(seconds) {
        if (!seconds) return '0 min';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h} hour${h > 1 ? 's' : ''}`;
        return `${m} min`;
    },

    // ============ STORAGE FOR ACTIVE TEST ============
    saveActiveTest(testData) {
        try {
            sessionStorage.setItem('active_test', JSON.stringify(testData));
            sessionStorage.setItem('active_test_start', String(Date.now()));
        } catch (e) {
            console.error('Cannot save test:', e);
        }
    },

    getActiveTest() {
        try {
            const d = sessionStorage.getItem('active_test');
            return d ? JSON.parse(d) : null;
        } catch (e) {
            return null;
        }
    },

    getActiveTestStartTime() {
        try {
            const t = sessionStorage.getItem('active_test_start');
            return t ? parseInt(t, 10) : null;
        } catch (e) {
            return null;
        }
    },

    clearActiveTest() {
        sessionStorage.removeItem('active_test');
        sessionStorage.removeItem('active_test_start');
        sessionStorage.removeItem('active_test_answers');
    },

    // ============ SAVE/LOAD ANSWERS DURING TEST ============
    saveAnswers(answers) {
        try {
            sessionStorage.setItem('active_test_answers', JSON.stringify(answers));
        } catch (e) {}
    },

    loadAnswers() {
        try {
            const d = sessionStorage.getItem('active_test_answers');
            return d ? JSON.parse(d) : null;
        } catch (e) {
            return null;
        }
    },

    // ============ SAVE TEST RESULT (after submission) ============
    saveLastResult(result) {
        try {
            sessionStorage.setItem('last_result', JSON.stringify(result));
        } catch (e) {}
    },

    getLastResult() {
        try {
            const d = sessionStorage.getItem('last_result');
            return d ? JSON.parse(d) : null;
        } catch (e) {
            return null;
        }
    },

    clearLastResult() {
        sessionStorage.removeItem('last_result');
    },

    // ============ API: START TEST ============
    async startTest(testData) {
        const token = localStorage.getItem('nustology_token');
        if (!token) {
            return { success: false, message: 'Not authenticated' };
        }
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
                    totalQuestions: testData.totalQuestions,
                    totalMarks: testData.totalMarks
                })
            });
            return await res.json();
        } catch (e) {
            console.error('startTest error:', e);
            return { success: false, message: 'Failed to start test' };
        }
    },

    // ============ API: SUBMIT TEST ============
    async submitTest(attemptId, answers, timeTaken) {
        const token = localStorage.getItem('nustology_token');
        if (!token) {
            return { success: false, message: 'Not authenticated' };
        }
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
            console.error('submitTest error:', e);
            return { success: false, message: 'Failed to submit test' };
        }
    },

    // ============ API: GET MY ATTEMPTS ============
    async getMyAttempts() {
        const token = localStorage.getItem('nustology_token');
        if (!token) return { success: false, attempts: [] };
        try {
            const res = await fetch(`${this.API_BASE}/tests/my-attempts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        } catch (e) {
            return { success: false, attempts: [] };
        }
    },

    // ============ API: GET REVIEW ============
    async getReview(attemptId) {
        const token = localStorage.getItem('nustology_token');
        if (!token) return { success: false };
        try {
            const res = await fetch(`${this.API_BASE}/tests/review/${attemptId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        } catch (e) {
            return { success: false };
        }
    },

    // ============ PREPARE ANSWERS FOR SUBMISSION ============
    // Converts questions + user selections into API-expected format
    prepareAnswers(questions, userSelections) {
        return questions.map((q, idx) => ({
            questionId: q.id || `q_${idx}`,
            questionText: q.questionText || q.question || '',
            subject: q.subject || 'General',
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            selectedAnswer: userSelections[idx]?.selected ?? null,
            markedForReview: userSelections[idx]?.markedForReview || false
        }));
    },

    // ============ CALCULATE LOCAL RESULT (for offline preview) ============
    calculateResult(questions, userSelections) {
        let correct = 0, wrong = 0, unattempted = 0;
        let currentStreak = 0, maxStreak = 0;

        questions.forEach((q, idx) => {
            const selected = userSelections[idx]?.selected;
            if (selected === null || selected === undefined) {
                unattempted++;
                currentStreak = 0;
            } else if (selected === q.correctAnswer) {
                correct++;
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
            } else {
                wrong++;
                currentStreak = 0;
            }
        });

        const totalMarks = questions.length;
        const score = correct;
        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

        return {
            correct,
            wrong,
            unattempted,
            totalQuestions: questions.length,
            score,
            totalMarks,
            percentage: parseFloat(percentage.toFixed(2)),
            maxStreak,
            attempted: correct + wrong,
            accuracy: (correct + wrong) > 0 
                ? parseFloat(((correct / (correct + wrong)) * 100).toFixed(2)) 
                : 0
        };
    },

    // ============ GROUP RESULTS BY SUBJECT (for grand test analysis) ============
    groupResultsBySubject(questions, userSelections) {
        const groups = {};

        questions.forEach((q, idx) => {
            const subject = q.subject || 'General';
            if (!groups[subject]) {
                groups[subject] = { 
                    correct: 0, wrong: 0, unattempted: 0, total: 0,
                    name: this.formatSubjectName(subject)
                };
            }
            groups[subject].total++;
            const selected = userSelections[idx]?.selected;
            if (selected === null || selected === undefined) {
                groups[subject].unattempted++;
            } else if (selected === q.correctAnswer) {
                groups[subject].correct++;
            } else {
                groups[subject].wrong++;
            }
        });

        // Add percentage to each group
        Object.keys(groups).forEach(key => {
            const g = groups[key];
            g.percentage = g.total > 0 
                ? parseFloat(((g.correct / g.total) * 100).toFixed(2)) 
                : 0;
        });

        return groups;
    },

    // ============ FORMAT SUBJECT NAME (for display) ============
    formatSubjectName(key) {
        if (!key) return 'General';
        const map = {
            'mathematics': 'Mathematics',
            'physics': 'Physics',
            'chemistry': 'Chemistry',
            'biology': 'Biology',
            'english': 'English',
            'quantitative_mathematics': 'Quantitative Mathematics',
            'design_aptitude': 'Design Aptitude',
            'intelligence': 'Intelligence',
            'general_knowledge': 'General Knowledge',
            'drawing': 'Drawing'
        };
        return map[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    },

    // ============ FORMAT FIELD CODE ============
    getFieldCode(fieldName) {
        const cfg = this.getFieldConfig(fieldName);
        return cfg ? cfg.code : '';
    },

    // ============ CHECK IF QUESTIONS AVAILABLE ============
    hasQuestionsAvailable(fieldName, subjectKey = null) {
        const cfg = this.getFieldConfig(fieldName);
        if (!cfg) return false;
        if (typeof QUESTION_BANK === 'undefined') return false;

        const fieldKey = cfg.key;
        if (!QUESTION_BANK[fieldKey]) return false;

        if (subjectKey) {
            return Array.isArray(QUESTION_BANK[fieldKey][subjectKey]) 
                && QUESTION_BANK[fieldKey][subjectKey].length > 0;
        }

        // Check if any subject has questions
        return Object.values(QUESTION_BANK[fieldKey]).some(arr => 
            Array.isArray(arr) && arr.length > 0
        );
    },

    // ============ COUNT QUESTIONS IN POOL ============
    getQuestionCount(fieldName, subjectKey) {
        const cfg = this.getFieldConfig(fieldName);
        if (!cfg || typeof QUESTION_BANK === 'undefined') return 0;
        const fieldKey = cfg.key;
        if (!QUESTION_BANK[fieldKey] || !QUESTION_BANK[fieldKey][subjectKey]) return 0;
        return QUESTION_BANK[fieldKey][subjectKey].length;
    },

    // ============ VALIDATE TEST DATA ============
    validateTest(testData) {
        if (!testData) return { valid: false, message: 'No test data' };
        if (!testData.questions || testData.questions.length === 0) {
            return { valid: false, message: 'No questions available' };
        }
        if (!testData.field) return { valid: false, message: 'Field is required' };
        if (!testData.type) return { valid: false, message: 'Test type is required' };
        if (!testData.totalMarks) return { valid: false, message: 'Total marks not specified' };
        if (!testData.duration) return { valid: false, message: 'Duration not specified' };
        return { valid: true };
    }
};

// Expose globally
window.TEST_ENGINE = TEST_ENGINE;
