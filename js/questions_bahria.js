// ============================================
// UNITEST - BAHRIA UNIVERSITY QUESTIONS
// File: js/questions_bahria.js
// Pattern: Bahria University Admission Test
// Total: 100 MCQs | Time: 90 min
// Math 25, English 25, Physics 25, GK 25
// Marking: +1 correct, 0 wrong | Total: 100 marks
// ============================================

const BAHRIA_QUESTION_BANK = {
    bahria: {
        mathematics: [
            { id: "ba_m1", q: "LCM of 4 and 6:", a: ["12", "24", "2", "6"], c: 0, e: "LCM = 12" },
            { id: "ba_m2", q: "If 3x-7=14, x=:", a: ["7", "3", "21", "14"], c: 0, e: "3x=21 → x=7" },
            { id: "ba_m3", q: "Sum of angles in triangle:", a: ["180°", "360°", "90°", "270°"], c: 0, e: "180° angle sum property." },
            { id: "ba_m4", q: "15% of 200:", a: ["30", "15", "25", "35"], c: 0, e: "15/100 × 200 = 30" },
            { id: "ba_m5", q: "HCF of 12 and 18:", a: ["6", "3", "12", "36"], c: 0, e: "HCF = 6" },
            { id: "ba_m6", q: "Cube root of 27:", a: ["3", "9", "27", "6"], c: 0, e: "∛27 = 3" },
            { id: "ba_m7", q: "Value of cos(0°):", a: ["1", "0", "-1", "½"], c: 0, e: "cos(0°) = 1" },
            { id: "ba_m8", q: "Simple interest 5000 at 10% for 2 yrs:", a: ["1000", "500", "1500", "2000"], c: 0, e: "SI = 5000×10×2/100 = 1000" }
        ],
        english: [
            { id: "ba_e1", q: "'If I ___ you, I would apologize.'", a: ["were", "was", "am", "be"], c: 0, e: "Second conditional → 'were'." },
            { id: "ba_e2", q: "'Ambiguous' means:", a: ["Multiple meanings", "Clear", "Simple", "Direct"], c: 0, e: "Ambiguous = unclear, multiple interpretations." },
            { id: "ba_e3", q: "Choose correct: '___ of the students passed.'", a: ["All", "Every", "Each", "Much"], c: 0, e: "'All' + plural verb is correct here." },
            { id: "ba_e4", q: "Synonym of 'Abundant':", a: ["Plentiful", "Scarce", "Minimal", "Rare"], c: 0, e: "Abundant = plentiful." },
            { id: "ba_e5", q: "Correct spelling:", a: ["Accommodation", "Accomodation", "Acomodation", "Accommadation"], c: 0, e: "Double c, double m." },
            { id: "ba_e6", q: "'___ apple a day keeps the doctor away.'", a: ["An", "A", "The", "No article"], c: 0, e: "Vowel sound → 'An'." }
        ],
        physics: [
            { id: "ba_p1", q: "SI unit of momentum:", a: ["kg·m/s", "N·s²", "kg·m²/s", "N/m"], c: 0, e: "p = mv → kg·m/s" },
            { id: "ba_p2", q: "Transformer works on:", a: ["EM induction", "Electrostatics", "Photoelectric effect", "Nuclear fission"], c: 0, e: "Faraday's law of EM induction." },
            { id: "ba_p3", q: "Myopia corrected by:", a: ["Concave lens", "Convex lens", "Bifocal", "Cylindrical"], c: 0, e: "Concave (diverging) lens corrects myopia." },
            { id: "ba_p4", q: "Newton's 2nd law:", a: ["F = ma", "F = mv", "F = m/a", "F = a/m"], c: 0, e: "Force = mass × acceleration." },
            { id: "ba_p5", q: "g at Earth surface:", a: ["9.8 m/s²", "10.8 m/s²", "8.9 m/s²", "6.8 m/s²"], c: 0, e: "g ≈ 9.8 m/s²" },
            { id: "ba_p6", q: "Pressure defined as:", a: ["Force/Area", "Force/Volume", "Energy/Area", "Mass/Area"], c: 0, e: "P = F/A" }
        ],
        general_knowledge: [
            { id: "ba_gk1", q: "Pakistan independence year:", a: ["1947", "1946", "1948", "1950"], c: 0, e: "August 14, 1947." },
            { id: "ba_gk2", q: "Highest peak in Pakistan:", a: ["K2", "Nanga Parbat", "Tirich Mir", "Rakaposhi"], c: 0, e: "K2 at 8,611m." },
            { id: "ba_gk3", q: "Longest river in Pakistan:", a: ["Indus", "Jhelum", "Chenab", "Ravi"], c: 0, e: "Indus River (~3,180 km)." },
            { id: "ba_gk4", q: "UN founded in:", a: ["1945", "1944", "1946", "1950"], c: 0, e: "October 24, 1945." },
            { id: "ba_gk5", q: "Most abundant gas in atmosphere:", a: ["Nitrogen", "Oxygen", "CO₂", "Argon"], c: 0, e: "Nitrogen = ~78%." },
            { id: "ba_gk6", q: "Capital of Pakistan:", a: ["Islamabad", "Karachi", "Lahore", "Peshawar"], c: 0, e: "Islamabad since 1967." },
            { id: "ba_gk7", q: "Mars is called:", a: ["Red Planet", "Blue Planet", "Green Planet", "Gas Giant"], c: 0, e: "Mars = Red Planet (iron oxide)." },
            { id: "ba_gk8", q: "Largest ocean:", a: ["Pacific", "Atlantic", "Indian", "Arctic"], c: 0, e: "Pacific Ocean is the largest." }
        ]
    }
};

const BAHRIA_FIELD_CONFIG = {
    'BAHRIA': {
        key: 'bahria', code: 'BAH', name: 'Bahria University Entry Test',
        description: 'Bahria University Admission Test',
        totalMarks: 100, duration: 90,
        markingScheme: { correct: 1, wrong: 0 },
        subjects: {
            mathematics: { name: 'Mathematics', weight: 25, marks: 25, questions: 25 },
            english: { name: 'English', weight: 25, marks: 25, questions: 25 },
            physics: { name: 'Physics', weight: 25, marks: 25, questions: 25 },
            general_knowledge: { name: 'General Knowledge', weight: 25, marks: 25, questions: 25 }
        }
    }
};

const BAHRIA_SUBJECT_TEST_CONFIG = {
    bahria: {
        mathematics: { questions: 10, marks: 10, duration: 12 },
        english: { questions: 10, marks: 10, duration: 12 },
        physics: { questions: 10, marks: 10, duration: 12 },
        general_knowledge: { questions: 10, marks: 10, duration: 12 }
    }
};

const BAHRIA_GRAND_TESTS = {
    bahria: [
        { id: 'bahria_grand_1', title: 'Bahria Full Mock Test 1', seed: 1 },
        { id: 'bahria_grand_2', title: 'Bahria Full Mock Test 2', seed: 2 }
    ]
};
