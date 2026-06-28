// ============================================
// UNITEST - FAST NUCES QUESTIONS
// File: js/questions_fast.js
// Pattern: FAST National University Entry Test
// Total: 100 MCQs | Time: 120 min
// Math 40, Analytical 20, English 20, Physics 20
// Marking: +1 correct, 0 wrong | Total: 100 marks
// ============================================

const FAST_QUESTION_BANK = {
    fast: {
        mathematics: [
            { id: "fa_m1", q: "If 2ˣ = 64, then x =:", a: ["6", "5", "8", "4"], c: 0, e: "2⁶ = 64, so x = 6." },
            { id: "fa_m2", q: "Slope of line 3x + 4y = 12:", a: ["-3/4", "3/4", "-4/3", "4/3"], c: 0, e: "4y = -3x + 12 → slope = -3/4" },
            { id: "fa_m3", q: "5 books can be arranged in:", a: ["120", "25", "60", "24"], c: 0, e: "5! = 120 ways." },
            { id: "fa_m4", q: "C(10,2) equals:", a: ["45", "100", "20", "90"], c: 0, e: "C(10,2) = (10×9)/2 = 45" },
            { id: "fa_m5", q: "If |x - 3| = 5, then x =:", a: ["8 or -2", "8 only", "-2 only", "3 or 5"], c: 0, e: "x - 3 = 5 → x=8 or x - 3 = -5 → x=-2" },
            { id: "fa_m6", q: "Value of cos(60°):", a: ["0.5", "1", "√3/2", "0"], c: 0, e: "cos(60°) = ½ = 0.5" },
            { id: "fa_m7", q: "If a = 3, b = 4, then a² + b² =:", a: ["25", "12", "7", "49"], c: 0, e: "9 + 16 = 25" },
            { id: "fa_m8", q: "HCF of 12 and 18:", a: ["6", "3", "12", "36"], c: 0, e: "Common factors: 1,2,3,6. HCF = 6" },
            { id: "fa_m9", q: "LCM of 4 and 6:", a: ["12", "24", "2", "6"], c: 0, e: "LCM(4,6) = 12" },
            { id: "fa_m10", q: "If 3x - 7 = 14, then x =:", a: ["7", "3", "21", "14"], c: 0, e: "3x = 21 → x = 7" }
        ],
        analytical_reasoning: [
            { id: "fa_ar1", q: "All cats are animals. Some animals are pets. Therefore:", a: ["Some cats may be pets", "All cats are pets", "No cats are pets", "All pets are cats"], c: 0, e: "Cats ⊂ Animals. Some Animals = Pets → Some cats may be pets." },
            { id: "fa_ar2", q: "Fibonacci: 1, 1, 2, 3, 5, 8, ___", a: ["13", "11", "10", "15"], c: 0, e: "5 + 8 = 13" },
            { id: "fa_ar3", q: "Some teachers are engineers. All engineers are graduates. Conclusion:", a: ["Some teachers are graduates", "All teachers are graduates", "No teachers are graduates", "Cannot determine"], c: 0, e: "Some teachers who are engineers must be graduates." },
            { id: "fa_ar4", q: "Odd one out: 2, 3, 5, 7, 9, 11, 13", a: ["9", "3", "7", "11"], c: 0, e: "9 = 3×3 (composite). All others are prime." },
            { id: "fa_ar5", q: "If APPLE=50, then MANGO coded as:", a: ["57", "60", "65", "52"], c: 0, e: "A=1,P=16,P=16,L=12,E=5=50. M=13,A=1,N=14,G=7,O=15=50+7=57." },
            { id: "fa_ar6", q: "Series: 2, 5, 10, 17, 26, ___", a: ["37", "35", "40", "30"], c: 0, e: "Differences: 3,5,7,9 → next diff 11 → 26+11 = 37" },
            { id: "fa_ar7", q: "5 machines make 5 widgets in 5 min. 100 machines make 100 widgets in:", a: ["5 minutes", "100 minutes", "20 minutes", "1 minute"], c: 0, e: "Each machine: 1 widget in 5 min. 100 machines = 100 widgets in 5 min." },
            { id: "fa_ar8", q: "Next: J, F, M, A, M, J, ___", a: ["J", "A", "S", "O"], c: 0, e: "Month initials: July = J" }
        ],
        english: [
            { id: "fa_e1", q: "Synonym of 'Abundant':", a: ["Plentiful", "Scarce", "Minimal", "Rare"], c: 0, e: "Abundant = plentiful, existing in large quantities." },
            { id: "fa_e2", q: "Choose correct: 'He has been working here ___ 2020.'", a: ["since", "from", "for", "at"], c: 0, e: "Present perfect continuous + 'since' for a point in time." },
            { id: "fa_e3", q: "Antonym of 'Transparent':", a: ["Opaque", "Clear", "Visible", "Bright"], c: 0, e: "Transparent → see-through. Opaque → not see-through." },
            { id: "fa_e4", q: "Synonym of 'Diligent':", a: ["Hardworking", "Lazy", "Careless", "Slow"], c: 0, e: "Diligent means hardworking, showing care and effort." },
            { id: "fa_e5", q: "Correct spelling:", a: ["Necessary", "Neccessary", "Necessery", "Nesessary"], c: 0, e: "Necessary: one c, double s." },
            { id: "fa_e6", q: "'Brevity' means:", a: ["Shortness", "Length", "Strength", "Bravery"], c: 0, e: "Brevity = conciseness, shortness." }
        ],
        physics: [
            { id: "fa_p1", q: "Acceleration due to gravity at Earth surface:", a: ["9.8 m/s²", "10.8 m/s²", "8.9 m/s²", "6.8 m/s²"], c: 0, e: "g ≈ 9.8 m/s²" },
            { id: "fa_p2", q: "Work done is zero when angle between F and d is:", a: ["90°", "0°", "45°", "180°"], c: 0, e: "W = Fd cos θ. cos(90°) = 0." },
            { id: "fa_p3", q: "Conventional current flows from:", a: ["Positive to negative", "Negative to positive", "Both directions", "None"], c: 0, e: "Conventional current: + to − terminal." },
            { id: "fa_p4", q: "Pressure is:", a: ["Force per unit area", "Force per unit volume", "Energy per area", "Mass per area"], c: 0, e: "P = F/A" },
            { id: "fa_p5", q: "SI unit of charge:", a: ["Coulomb", "Ampere", "Volt", "Ohm"], c: 0, e: "Charge → Coulombs (C)." },
            { id: "fa_p6", q: "Snell's law relates to:", a: ["Refraction", "Reflection", "Diffraction", "Polarization"], c: 0, e: "n₁ sin θ₁ = n₂ sin θ₂ (refraction)." }
        ]
    }
};

const FAST_FIELD_CONFIG = {
    'FAST-CS': {
        key: 'fast', code: 'FST', name: 'FAST NUCES Entry Test',
        description: 'FAST National University - Computer Science & Engineering',
        totalMarks: 100, duration: 120,
        markingScheme: { correct: 1, wrong: 0 },
        subjects: {
            mathematics: { name: 'Mathematics', weight: 40, marks: 40, questions: 40 },
            analytical_reasoning: { name: 'Analytical Reasoning', weight: 20, marks: 20, questions: 20 },
            english: { name: 'English', weight: 20, marks: 20, questions: 20 },
            physics: { name: 'Physics', weight: 20, marks: 20, questions: 20 }
        }
    }
};

const FAST_SUBJECT_TEST_CONFIG = {
    fast: {
        mathematics: { questions: 15, marks: 15, duration: 20 },
        analytical_reasoning: { questions: 10, marks: 10, duration: 15 },
        english: { questions: 10, marks: 10, duration: 12 },
        physics: { questions: 10, marks: 10, duration: 15 }
    }
};

const FAST_GRAND_TESTS = {
    fast: [
        { id: 'fast_grand_1', title: 'FAST Full Mock Test 1', seed: 1 },
        { id: 'fast_grand_2', title: 'FAST Full Mock Test 2', seed: 2 }
    ]
};
