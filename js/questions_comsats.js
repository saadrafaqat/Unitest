// ============================================
// UNITEST - COMSATS QUESTIONS
// File: js/questions_comsats.js
// Pattern: COMSATS University (NTS Based)
// Total: 100 MCQs | Time: 120 min
// Math 30, Physics 20, English 20, CS/IQ 30
// Marking: +1 correct, 0 wrong | Total: 100 marks
// ============================================

const COMSATS_QUESTION_BANK = {
    comsats: {
        mathematics: [
            { id: "co_m1", q: "HCF of 12 and 18:", a: ["6", "3", "12", "36"], c: 0, e: "Common factors: 1,2,3,6. HCF = 6" },
            { id: "co_m2", q: "If a=3, b=4, then a²+b²=:", a: ["25", "12", "7", "49"], c: 0, e: "9 + 16 = 25" },
            { id: "co_m3", q: "cos(0°) =:", a: ["1", "0", "-1", "½"], c: 0, e: "cos(0°) = 1" },
            { id: "co_m4", q: "What is 15% of 200?", a: ["30", "15", "25", "35"], c: 0, e: "15/100 × 200 = 30" },
            { id: "co_m5", q: "If x+y=10 and x-y=4, then x=:", a: ["7", "6", "3", "8"], c: 0, e: "2x = 14 → x = 7" },
            { id: "co_m6", q: "Cube root of 27:", a: ["3", "9", "27", "6"], c: 0, e: "3³ = 27 → ∛27 = 3" },
            { id: "co_m7", q: "Sum of angles in triangle:", a: ["180°", "360°", "90°", "270°"], c: 0, e: "Angle sum = 180°" },
            { id: "co_m8", q: "LCM of 4 and 6:", a: ["12", "24", "2", "6"], c: 0, e: "LCM(4,6) = 12" }
        ],
        physics: [
            { id: "co_p1", q: "Pressure is:", a: ["Force per unit area", "Force per volume", "Energy per area", "Mass per area"], c: 0, e: "P = F/A" },
            { id: "co_p2", q: "SI unit of charge:", a: ["Coulomb", "Ampere", "Volt", "Ohm"], c: 0, e: "Charge → Coulombs." },
            { id: "co_p3", q: "Sound travels fastest in:", a: ["Solids", "Liquids", "Gases", "Vacuum"], c: 0, e: "Closely packed molecules → fastest sound in solids." },
            { id: "co_p4", q: "Which mirror in car headlights?", a: ["Concave", "Convex", "Plane", "Cylindrical"], c: 0, e: "Concave mirrors converge light." },
            { id: "co_p5", q: "Unit of capacitance:", a: ["Farad", "Henry", "Ohm", "Tesla"], c: 0, e: "Capacitance in Farads." },
            { id: "co_p6", q: "Bernoulli's principle relates to:", a: ["Fluid dynamics", "Thermodynamics", "Optics", "Nuclear physics"], c: 0, e: "Pressure-velocity relation in fluids." }
        ],
        english: [
            { id: "co_e1", q: "Synonym of 'Diligent':", a: ["Hardworking", "Lazy", "Careless", "Slow"], c: 0, e: "Diligent = hardworking." },
            { id: "co_e2", q: "'He has been studying ___ two hours.'", a: ["for", "since", "from", "at"], c: 0, e: "'For' + duration of time." },
            { id: "co_e3", q: "Correct spelling:", a: ["Necessary", "Neccessary", "Necessery", "Nesessary"], c: 0, e: "Necessary: one c, double s." },
            { id: "co_e4", q: "Opposite of 'Ancient':", a: ["Modern", "Old", "Antique", "Historical"], c: 0, e: "Ancient → old. Modern → present." },
            { id: "co_e5", q: "'Look forward ___' hearing from you.", a: ["to", "for", "at", "in"], c: 0, e: "'Look forward to' is fixed." }
        ],
        cs_iq: [
            { id: "co_cs1", q: "CPU stands for:", a: ["Central Processing Unit", "Central Program Unit", "Computer Processing Unit", "Central Power Unit"], c: 0, e: "CPU = Central Processing Unit." },
            { id: "co_cs2", q: "FIFO data structure:", a: ["Queue", "Stack", "Tree", "Graph"], c: 0, e: "Queue = FIFO. Stack = LIFO." },
            { id: "co_cs3", q: "Binary of decimal 10:", a: ["1010", "1001", "1100", "1110"], c: 0, e: "10 = 8+2 = 1010₂" },
            { id: "co_cs4", q: "Series: 2, 5, 10, 17, 26, ___", a: ["37", "35", "40", "30"], c: 0, e: "Diffs: 3,5,7,9 → next 11 → 37" },
            { id: "co_cs5", q: "RAM stands for:", a: ["Random Access Memory", "Read Access Memory", "Random All Memory", "Read All Memory"], c: 0, e: "RAM = Random Access Memory." },
            { id: "co_cs6", q: "Which is NOT an operating system?", a: ["Oracle", "Windows", "Linux", "macOS"], c: 0, e: "Oracle is a database management system." },
            { id: "co_cs7", q: "1 KB equals:", a: ["1024 bytes", "1000 bytes", "512 bytes", "2048 bytes"], c: 0, e: "1 KB = 2¹⁰ = 1024 bytes." },
            { id: "co_cs8", q: "HTML stands for:", a: ["HyperText Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], c: 0, e: "HTML = HyperText Markup Language." }
        ]
    }
};

const COMSATS_FIELD_CONFIG = {
    'COMSATS': {
        key: 'comsats', code: 'CMS', name: 'COMSATS Entry Test',
        description: 'COMSATS University Islamabad (NTS Based Admission)',
        totalMarks: 100, duration: 120,
        markingScheme: { correct: 1, wrong: 0 },
        subjects: {
            mathematics: { name: 'Mathematics', weight: 30, marks: 30, questions: 30 },
            physics: { name: 'Physics', weight: 20, marks: 20, questions: 20 },
            english: { name: 'English', weight: 20, marks: 20, questions: 20 },
            cs_iq: { name: 'CS & IQ', weight: 30, marks: 30, questions: 30 }
        }
    }
};

const COMSATS_SUBJECT_TEST_CONFIG = {
    comsats: {
        mathematics: { questions: 12, marks: 12, duration: 18 },
        physics: { questions: 10, marks: 10, duration: 15 },
        english: { questions: 10, marks: 10, duration: 12 },
        cs_iq: { questions: 12, marks: 12, duration: 18 }
    }
};

const COMSATS_GRAND_TESTS = {
    comsats: [
        { id: 'comsats_grand_1', title: 'COMSATS Full Mock Test 1', seed: 1 },
        { id: 'comsats_grand_2', title: 'COMSATS Full Mock Test 2', seed: 2 }
    ]
};
