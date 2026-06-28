// ============================================
// UNITEST - PIEAS QUESTIONS
// File: js/questions_pieas.js
// Pattern: PIEAS Written Test
// Total: 100 MCQs | Time: 120 min
// Math 30, Physics 30, Chemistry 20, English 20
// Marking: +4 correct, −1 wrong | Total: 400 marks
// ============================================

const PIEAS_QUESTION_BANK = {
    pieas: {
        mathematics: [
            { id: "pi_m1", q: "Taylor series of eˣ about x=0:", a: ["1 + x + x²/2! + x³/3! + ...", "1 - x + x²/2! - ...", "x + x²/2 + ...", "1 + x + x² + x³ + ..."], c: 0, e: "eˣ = Σ(xⁿ/n!)" },
            { id: "pi_m2", q: "Rank of 3×3 identity matrix:", a: ["3", "1", "0", "9"], c: 0, e: "All rows linearly independent → rank = 3." },
            { id: "pi_m3", q: "∫₀^π sin(x)dx =:", a: ["2", "0", "1", "π"], c: 0, e: "[-cos(x)]₀^π = 1+1 = 2" },
            { id: "pi_m4", q: "Eigenvalues of [[3,0],[0,5]]:", a: ["3 and 5", "0 and 8", "1 and 15", "3 and 0"], c: 0, e: "Diagonal entries are eigenvalues." },
            { id: "pi_m5", q: "Laplace transform of f(t)=1:", a: ["1/s", "s", "1", "1/s²"], c: 0, e: "L{1} = 1/s for s > 0." },
            { id: "pi_m6", q: "The derivative of eˣ is:", a: ["eˣ", "xeˣ⁻¹", "1/eˣ", "ln(x)"], c: 0, e: "d/dx(eˣ) = eˣ" },
            { id: "pi_m7", q: "If det(A)=5 for 3×3 matrix, det(2A)=:", a: ["40", "10", "20", "80"], c: 0, e: "det(kA) = k³det(A) = 8×5 = 40" },
            { id: "pi_m8", q: "∫ 1/x dx =:", a: ["ln|x| + C", "x² + C", "1/x² + C", "eˣ + C"], c: 0, e: "∫ 1/x dx = ln|x| + C" }
        ],
        physics: [
            { id: "pi_p1", q: "Binding energy per nucleon is max for:", a: ["Iron-56", "Uranium-238", "Hydrogen-1", "Helium-4"], c: 0, e: "Fe-56: ~8.8 MeV/nucleon, most stable." },
            { id: "pi_p2", q: "In nuclear fission, a heavy nucleus splits into:", a: ["Lighter nuclei", "Heavier nucleus", "Electrons only", "Protons only"], c: 0, e: "Fission → lighter fragments + energy." },
            { id: "pi_p3", q: "Efficiency of Carnot engine (600K, 300K):", a: ["50%", "25%", "100%", "75%"], c: 0, e: "η = 1 - 300/600 = 50%" },
            { id: "pi_p4", q: "Maxwell's equations describe:", a: ["Electric and magnetic fields", "Mass and velocity", "Force and acceleration", "Pressure and volume"], c: 0, e: "Maxwell unified EM theory with 4 equations." },
            { id: "pi_p5", q: "Half-life 10 days. After 30 days remaining:", a: ["1/8", "1/4", "1/2", "1/16"], c: 0, e: "3 half-lives: (1/2)³ = 1/8" },
            { id: "pi_p6", q: "de Broglie wavelength:", a: ["λ = h/p", "λ = p/h", "λ = hf", "λ = c/f"], c: 0, e: "λ = h/p = h/(mv)" },
            { id: "pi_p7", q: "A capacitor stores energy in:", a: ["Electric field", "Magnetic field", "Heat", "Sound"], c: 0, e: "E = ½CV² in electric field." },
            { id: "pi_p8", q: "Superposition principle applies to:", a: ["Waves", "Mass", "Temperature", "Density"], c: 0, e: "Waves combine by superposition." }
        ],
        chemistry: [
            { id: "pi_c1", q: "Oxidation state of Mn in KMnO₄:", a: ["+7", "+5", "+4", "+6"], c: 0, e: "K(+1) + Mn(x) + 4(-2) = 0 → x = +7" },
            { id: "pi_c2", q: "Ideal gas equation:", a: ["PV = nRT", "PV = mRT", "P = nVT", "PV = RT"], c: 0, e: "PV = nRT" },
            { id: "pi_c3", q: "Bond in NaCl:", a: ["Ionic", "Covalent", "Metallic", "Hydrogen"], c: 0, e: "Na→Cl electron transfer → ionic bond." },
            { id: "pi_c4", q: "Avogadro's number:", a: ["6.022 × 10²³", "6.022 × 10²²", "6.022 × 10²⁴", "3.011 × 10²³"], c: 0, e: "Nₐ = 6.022 × 10²³ mol⁻¹" },
            { id: "pi_c5", q: "pH of neutral solution at 25°C:", a: ["7", "0", "14", "1"], c: 0, e: "Neutral water: pH = 7." },
            { id: "pi_c6", q: "Strongest acid:", a: ["HCl", "CH₃COOH", "H₂CO₃", "HF"], c: 0, e: "HCl is a strong acid (complete dissociation)." }
        ],
        english: [
            { id: "pi_e1", q: "'The committee ___ divided on the issue.'", a: ["was", "were", "are", "have"], c: 0, e: "Committee as single unit → singular 'was'." },
            { id: "pi_e2", q: "'Pragmatic' means:", a: ["Practical", "Theoretical", "Imaginative", "Emotional"], c: 0, e: "Pragmatic = dealing with things practically." },
            { id: "pi_e3", q: "'I wish I ___ a bird.'", a: ["were", "was", "am", "be"], c: 0, e: "Subjunctive mood after wish → 'were'." },
            { id: "pi_e4", q: "Antonym of 'Verbose':", a: ["Concise", "Lengthy", "Detailed", "Eloquent"], c: 0, e: "Verbose = wordy. Concise = brief." },
            { id: "pi_e5", q: "Synonym of 'Benevolent':", a: ["Kind", "Cruel", "Angry", "Lazy"], c: 0, e: "Benevolent = well-meaning, kind." }
        ]
    }
};

const PIEAS_FIELD_CONFIG = {
    'PIEAS': {
        key: 'pieas', code: 'PIA', name: 'PIEAS Entry Test',
        description: 'Pakistan Institute of Engineering & Applied Sciences',
        totalMarks: 400, duration: 120,
        markingScheme: { correct: 4, wrong: -1 },
        subjects: {
            mathematics: { name: 'Mathematics', weight: 30, marks: 120, questions: 30 },
            physics: { name: 'Physics', weight: 30, marks: 120, questions: 30 },
            chemistry: { name: 'Chemistry', weight: 20, marks: 80, questions: 20 },
            english: { name: 'English', weight: 20, marks: 80, questions: 20 }
        }
    }
};

const PIEAS_SUBJECT_TEST_CONFIG = {
    pieas: {
        mathematics: { questions: 12, marks: 48, duration: 18 },
        physics: { questions: 12, marks: 48, duration: 18 },
        chemistry: { questions: 10, marks: 40, duration: 15 },
        english: { questions: 10, marks: 40, duration: 12 }
    }
};

const PIEAS_GRAND_TESTS = {
    pieas: [
        { id: 'pieas_grand_1', title: 'PIEAS Full Mock Test 1', seed: 1 },
        { id: 'pieas_grand_2', title: 'PIEAS Full Mock Test 2', seed: 2 }
    ]
};
