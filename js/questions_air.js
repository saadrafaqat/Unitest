// ============================================
// UNITEST - AIR UNIVERSITY QUESTIONS
// File: js/questions_air.js
// Pattern: Air University Admission Test
// Total: 80 MCQs | Time: 90 min
// Math 25, Physics 20, English 15, IQ/GK 20
// Marking: +1 correct, 0 wrong | Total: 80 marks
// ============================================

const AIR_QUESTION_BANK = {
    air: {
        mathematics: [
            { id: "ai_m1", q: "15% of 200 =:", a: ["30", "15", "25", "35"], c: 0, e: "15/100 × 200 = 30" },
            { id: "ai_m2", q: "If x+y=10, x-y=4, then x=:", a: ["7", "6", "3", "8"], c: 0, e: "2x=14 → x=7" },
            { id: "ai_m3", q: "Cube root of 27:", a: ["3", "9", "27", "6"], c: 0, e: "3³ = 27 → ∛27 = 3" },
            { id: "ai_m4", q: "Simple interest on 5000 at 10% for 2 years:", a: ["1000", "500", "1500", "2000"], c: 0, e: "SI = 5000×10×2/100 = 1000" },
            { id: "ai_m5", q: "If 3x-7=14, x=:", a: ["7", "3", "21", "14"], c: 0, e: "3x=21 → x=7" },
            { id: "ai_m6", q: "Sum of angles in triangle:", a: ["180°", "360°", "90°", "270°"], c: 0, e: "Triangle angle sum = 180°" },
            { id: "ai_m7", q: "LCM of 4 and 6:", a: ["12", "24", "2", "6"], c: 0, e: "LCM(4,6) = 12" },
            { id: "ai_m8", q: "Value of sin(30°):", a: ["0.5", "1", "√3/2", "0"], c: 0, e: "sin(30°) = 0.5" }
        ],
        physics: [
            { id: "ai_p1", q: "Concave mirror used in:", a: ["Car headlights", "Rear-view mirror", "Magnifying glass", "Periscope"], c: 0, e: "Concave mirrors converge light into beam." },
            { id: "ai_p2", q: "Unit of capacitance:", a: ["Farad", "Henry", "Ohm", "Tesla"], c: 0, e: "Capacitance in Farads." },
            { id: "ai_p3", q: "Bernoulli's principle is about:", a: ["Fluid dynamics", "Thermodynamics", "Optics", "Nuclear"], c: 0, e: "Pressure-velocity in fluids." },
            { id: "ai_p4", q: "Unit of work:", a: ["Joule", "Newton", "Watt", "Pascal"], c: 0, e: "Work = Fd = Joule." },
            { id: "ai_p5", q: "Sound fastest in:", a: ["Solids", "Liquids", "Gases", "Vacuum"], c: 0, e: "Solid molecules closely packed." },
            { id: "ai_p6", q: "SI unit of charge:", a: ["Coulomb", "Ampere", "Volt", "Ohm"], c: 0, e: "Charge → Coulombs." }
        ],
        english: [
            { id: "ai_e1", q: "Opposite of 'Ancient':", a: ["Modern", "Old", "Antique", "Historical"], c: 0, e: "Ancient ↔ Modern" },
            { id: "ai_e2", q: "'Fluently' in 'She speaks fluently' is:", a: ["Adverb", "Adjective", "Verb", "Noun"], c: 0, e: "Modifies verb → adverb." },
            { id: "ai_e3", q: "'I look forward ___ hearing from you.'", a: ["to", "for", "at", "in"], c: 0, e: "'Look forward to' is fixed phrase." },
            { id: "ai_e4", q: "Synonym of 'Diligent':", a: ["Hardworking", "Lazy", "Careless", "Slow"], c: 0, e: "Diligent = hardworking." },
            { id: "ai_e5", q: "Past tense of 'go':", a: ["went", "gone", "goed", "going"], c: 0, e: "go → went → gone." }
        ],
        iq_gk: [
            { id: "ai_gk1", q: "Capital of Pakistan:", a: ["Islamabad", "Karachi", "Lahore", "Peshawar"], c: 0, e: "Islamabad since 1967." },
            { id: "ai_gk2", q: "The Red Planet:", a: ["Mars", "Jupiter", "Venus", "Mercury"], c: 0, e: "Mars has iron oxide → red." },
            { id: "ai_gk3", q: "Train at 60 km/h, distance in 2.5 hours:", a: ["150 km", "120 km", "180 km", "90 km"], c: 0, e: "60 × 2.5 = 150 km" },
            { id: "ai_gk4", q: "Largest ocean:", a: ["Pacific", "Atlantic", "Indian", "Arctic"], c: 0, e: "Pacific is largest and deepest." },
            { id: "ai_gk5", q: "Pakistan national anthem writer:", a: ["Hafeez Jalandhari", "Allama Iqbal", "Faiz Ahmed Faiz", "Ahmed Faraz"], c: 0, e: "Hafeez Jalandhari wrote the lyrics." },
            { id: "ai_gk6", q: "Pakistan independence year:", a: ["1947", "1946", "1948", "1950"], c: 0, e: "August 14, 1947." },
            { id: "ai_gk7", q: "Highest peak in Pakistan:", a: ["K2", "Nanga Parbat", "Tirich Mir", "Rakaposhi"], c: 0, e: "K2 at 8,611m." },
            { id: "ai_gk8", q: "UN founded in:", a: ["1945", "1944", "1946", "1950"], c: 0, e: "October 24, 1945." }
        ]
    }
};

const AIR_FIELD_CONFIG = {
    'AIR': {
        key: 'air', code: 'AIR', name: 'Air University Entry Test',
        description: 'Air University, Islamabad',
        totalMarks: 80, duration: 90,
        markingScheme: { correct: 1, wrong: 0 },
        subjects: {
            mathematics: { name: 'Mathematics', weight: 31.25, marks: 25, questions: 25 },
            physics: { name: 'Physics', weight: 25, marks: 20, questions: 20 },
            english: { name: 'English', weight: 18.75, marks: 15, questions: 15 },
            iq_gk: { name: 'IQ & General Knowledge', weight: 25, marks: 20, questions: 20 }
        }
    }
};

const AIR_SUBJECT_TEST_CONFIG = {
    air: {
        mathematics: { questions: 10, marks: 10, duration: 15 },
        physics: { questions: 8, marks: 8, duration: 12 },
        english: { questions: 8, marks: 8, duration: 10 },
        iq_gk: { questions: 8, marks: 8, duration: 12 }
    }
};

const AIR_GRAND_TESTS = {
    air: [
        { id: 'air_grand_1', title: 'Air University Full Mock Test 1', seed: 1 },
        { id: 'air_grand_2', title: 'Air University Full Mock Test 2', seed: 2 }
    ]
};
