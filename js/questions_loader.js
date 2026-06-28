// ============================================
// UNITEST - UNIVERSAL QUESTIONS LOADER
// File: js/questions_loader.js
// 
// This file provides the same QUESTIONS API
// that student.html expects, but dynamically
// routes to the correct university's data
// based on the selected exam.
//
// Load this AFTER the individual question files.
// ============================================

(function() {
    'use strict';

    // Registry of all university configs
    const UNIVERSITY_REGISTRY = {};

    // Register a university
    function registerUniversity(questionBank, fieldConfig, subjectTestConfig, grandTests) {
        for (const [fieldName, cfg] of Object.entries(fieldConfig)) {
            UNIVERSITY_REGISTRY[fieldName] = {
                questionBank: questionBank,
                fieldConfig: cfg,
                subjectTestConfig: subjectTestConfig,
                grandTests: grandTests
            };
        }
    }

    // Auto-register all loaded universities
    if (typeof NUST_QUESTION_BANK !== 'undefined') {
        registerUniversity(NUST_QUESTION_BANK, NUST_FIELD_CONFIG, NUST_SUBJECT_TEST_CONFIG, NUST_GRAND_TESTS);
    }
    if (typeof MDCAT_QUESTION_BANK !== 'undefined') {
        registerUniversity(MDCAT_QUESTION_BANK, MDCAT_FIELD_CONFIG, MDCAT_SUBJECT_TEST_CONFIG, MDCAT_GRAND_TESTS);
    }
    if (typeof ECAT_QUESTION_BANK !== 'undefined') {
        registerUniversity(ECAT_QUESTION_BANK, ECAT_FIELD_CONFIG, ECAT_SUBJECT_TEST_CONFIG, ECAT_GRAND_TESTS);
    }
    if (typeof FAST_QUESTION_BANK !== 'undefined') {
        registerUniversity(FAST_QUESTION_BANK, FAST_FIELD_CONFIG, FAST_SUBJECT_TEST_CONFIG, FAST_GRAND_TESTS);
    }
    if (typeof GIKI_QUESTION_BANK !== 'undefined') {
        registerUniversity(GIKI_QUESTION_BANK, GIKI_FIELD_CONFIG, GIKI_SUBJECT_TEST_CONFIG, GIKI_GRAND_TESTS);
    }
    if (typeof PIEAS_QUESTION_BANK !== 'undefined') {
        registerUniversity(PIEAS_QUESTION_BANK, PIEAS_FIELD_CONFIG, PIEAS_SUBJECT_TEST_CONFIG, PIEAS_GRAND_TESTS);
    }
    if (typeof COMSATS_QUESTION_BANK !== 'undefined') {
        registerUniversity(COMSATS_QUESTION_BANK, COMSATS_FIELD_CONFIG, COMSATS_SUBJECT_TEST_CONFIG, COMSATS_GRAND_TESTS);
    }
    if (typeof NED_QUESTION_BANK !== 'undefined') {
        registerUniversity(NED_QUESTION_BANK, NED_FIELD_CONFIG, NED_SUBJECT_TEST_CONFIG, NED_GRAND_TESTS);
    }
    if (typeof AIR_QUESTION_BANK !== 'undefined') {
        registerUniversity(AIR_QUESTION_BANK, AIR_FIELD_CONFIG, AIR_SUBJECT_TEST_CONFIG, AIR_GRAND_TESTS);
    }
    if (typeof BAHRIA_QUESTION_BANK !== 'undefined') {
        registerUniversity(BAHRIA_QUESTION_BANK, BAHRIA_FIELD_CONFIG, BAHRIA_SUBJECT_TEST_CONFIG, BAHRIA_GRAND_TESTS);
    }

    // Helpers
    function _shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function _normalizeQuestion(q, fieldKey, subjectKey) {
        return {
            id: q.id || `${fieldKey}_${subjectKey}_${Math.random().toString(36).substring(7)}`,
            questionText: q.q,
            question: q.q,
            passage: q.passage || null,
            options: q.a || [],
            correctAnswer: q.c,
            explanation: q.e || '',
            subject: subjectKey,
            field: fieldKey,
            image: q.d || null
        };
    }

    // ============ MAIN QUESTIONS API ============
    const QUESTIONS = {

        // Get all registered university registry
        getRegistry() {
            return UNIVERSITY_REGISTRY;
        },

        // Get all available exam/field names
        getFields() {
            return Object.keys(UNIVERSITY_REGISTRY).map(fieldName => {
                const reg = UNIVERSITY_REGISTRY[fieldName];
                const cfg = reg.fieldConfig;
                return {
                    id: fieldName,
                    key: cfg.key,
                    code: cfg.code,
                    name: cfg.name,
                    description: cfg.description,
                    totalMarks: cfg.totalMarks,
                    duration: cfg.duration,
                    markingScheme: cfg.markingScheme || { correct: 1, wrong: 0 },
                    subjects: Object.entries(cfg.subjects).map(([k, v]) => ({
                        key: k,
                        name: v.name,
                        weight: v.weight
                    }))
                };
            });
        },

        // Get config for a specific field/exam
        getFieldConfig(fieldName) {
            const reg = UNIVERSITY_REGISTRY[fieldName];
            return reg ? reg.fieldConfig : null;
        },

        // Get subjects for a field
        getSubjects(fieldName) {
            const reg = UNIVERSITY_REGISTRY[fieldName];
            if (!reg) return [];
            return Object.entries(reg.fieldConfig.subjects).map(([k, v]) => ({
                key: k,
                name: v.name,
                weight: v.weight,
                marks: v.marks,
                questions: v.questions
            }));
        },

        // Get raw question pool
        _getPool(fieldName, subjectKey) {
            const reg = UNIVERSITY_REGISTRY[fieldName];
            if (!reg) return [];
            const fieldKey = reg.fieldConfig.key;
            const bank = reg.questionBank;
            if (!bank[fieldKey] || !bank[fieldKey][subjectKey]) {
                console.warn(`No questions: ${fieldName}/${subjectKey}`);
                return [];
            }
            return bank[fieldKey][subjectKey];
        },

        // Build subject-wise test
        buildSubjectTest(fieldName, subjectKey) {
            const reg = UNIVERSITY_REGISTRY[fieldName];
            if (!reg) return null;
            const cfg = reg.fieldConfig;
            const fieldKey = cfg.key;
            const testCfg = reg.subjectTestConfig[fieldKey]?.[subjectKey];
            if (!testCfg) return null;

            const pool = this._getPool(fieldName, subjectKey);
            if (pool.length === 0) return null;

            const shuffled = _shuffleArray(pool);
            const selected = shuffled.slice(0, Math.min(testCfg.questions, pool.length));
            const questions = selected.map(q => _normalizeQuestion(q, fieldKey, subjectKey));
            const subjectName = cfg.subjects[subjectKey]?.name || subjectKey;

            return {
                title: `${subjectName} - Practice Test`,
                type: 'subject',
                field: fieldName,
                fieldKey: fieldKey,
                subject: subjectKey,
                subjectName: subjectName,
                totalQuestions: questions.length,
                totalMarks: questions.length * (cfg.markingScheme?.correct || 1),
                duration: testCfg.duration * 60,
                markingScheme: cfg.markingScheme || { correct: 1, wrong: 0 },
                questions: questions
            };
        },

        // Build grand/full test
        buildGrandTest(fieldName, grandTestNumber = 1) {
            const reg = UNIVERSITY_REGISTRY[fieldName];
            if (!reg) return null;
            const cfg = reg.fieldConfig;
            const fieldKey = cfg.key;
            const grandTests = reg.grandTests[fieldKey];
            if (!grandTests) return null;
            const testInfo = grandTests[grandTestNumber - 1];
            if (!testInfo) return null;

            let allQuestions = [];

            for (const [subjectKey, subjectCfg] of Object.entries(cfg.subjects)) {
                const pool = this._getPool(fieldName, subjectKey);
                if (pool.length === 0) continue;
                const shuffled = _shuffleArray(pool);
                const needed = subjectCfg.questions;
                const selected = shuffled.slice(0, Math.min(needed, pool.length));
                const normalized = selected.map(q => _normalizeQuestion(q, fieldKey, subjectKey));
                allQuestions = allQuestions.concat(normalized);
            }

            allQuestions = _shuffleArray(allQuestions);

            return {
                title: testInfo.title,
                type: 'grand',
                field: fieldName,
                fieldKey: fieldKey,
                grandTestId: testInfo.id,
                grandTestNumber: grandTestNumber,
                totalQuestions: allQuestions.length,
                totalMarks: allQuestions.length * (cfg.markingScheme?.correct || 1),
                duration: cfg.duration * 60,
                markingScheme: cfg.markingScheme || { correct: 1, wrong: 0 },
                questions: allQuestions,
                subjectBreakdown: Object.entries(cfg.subjects).map(([k, v]) => ({
                    subject: k,
                    name: v.name,
                    questions: v.questions,
                    weight: v.weight
                }))
            };
        },

        // Get available grand tests
        getGrandTests(fieldName) {
            const reg = UNIVERSITY_REGISTRY[fieldName];
            if (!reg) return [];
            return reg.grandTests[reg.fieldConfig.key] || [];
        },

        // Stats for admin
        getStats() {
            const stats = {};
            for (const [fieldName, reg] of Object.entries(UNIVERSITY_REGISTRY)) {
                const cfg = reg.fieldConfig;
                stats[fieldName] = {
                    code: cfg.code,
                    name: cfg.name,
                    totalMarks: cfg.totalMarks,
                    duration: cfg.duration,
                    markingScheme: cfg.markingScheme || { correct: 1, wrong: 0 },
                    subjects: {}
                };
                for (const subjectKey of Object.keys(cfg.subjects)) {
                    const pool = this._getPool(fieldName, subjectKey);
                    stats[fieldName].subjects[subjectKey] = pool.length;
                }
            }
            return stats;
        }
    };

    // ============ BACKWARD COMPATIBILITY ============
    // For existing code that uses QUESTION_BANK, FIELD_CONFIG, etc.
    // This maps to the NUST data by default (or whichever is loaded first)

    if (typeof NUST_QUESTION_BANK !== 'undefined') {
        window.QUESTION_BANK = NUST_QUESTION_BANK;
        window.FIELD_CONFIG = NUST_FIELD_CONFIG;
        window.SUBJECT_TEST_CONFIG = NUST_SUBJECT_TEST_CONFIG;
        window.GRAND_TESTS = NUST_GRAND_TESTS;
    }

    // Expose globally
    window.QUESTIONS = QUESTIONS;
    window.UNIVERSITY_REGISTRY = UNIVERSITY_REGISTRY;

})();
