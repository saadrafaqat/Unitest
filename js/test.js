// ============================================
// NUSTOLOGY PREP - TEST ENGINE (UPDATED)
// File: js/test.js
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
        if (typeof QUESTIONS === 'undefined') return null;
        return QUESTIONS.buildSubjectTest(fieldName, subjectKey);
    },

    // ============ BUILD GRAND TEST ============
    buildGrandTest(fieldName, grandTestNumber = 1) {
        if (typeof QUESTIONS === 'undefined') return null;
        return QUESTIONS.buildGrandTest(fieldName, grandTestNumber);
    },

    // ============ FORMAT TIMER ============
    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const pad = (n) => n.toString().padStart(2, '0');
        if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
        return `${pad(m)}:${pad(s)}`;
    },

    // ============ STORAGE FOR ACTIVE TEST ============
    saveActiveTest(testData) {
        try {
            sessionStorage.setItem('active_test', JSON.stringify(testData));
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

    clearActiveTest() {
        sessionStorage.removeItem('active_test');
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
    // Converts user selections + questions into format expected by API
    prepareAnswers(questions, userSelections) {
        return questions.map((q, idx) => ({
            questionId: q.id,
            questionText: q.questionText || q.question,
            subject: q.subject,
            options: q.options,
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
        const percentage = (score / totalMarks) * 100;

        return {
            correct,
            wrong,
            unattempted,
            totalQuestions: questions.length,
            score,
            totalMarks,
            percentage: parseFloat(percentage.toFixed(2)),
            maxStreak
        };
    }
};

window.TEST_ENGINE = TEST_ENGINE;
