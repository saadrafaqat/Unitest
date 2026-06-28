// ============================================
// UNITEST - GIKI QUESTIONS
// File: js/questions_giki.js
// Pattern: Ghulam Ishaq Khan Institute Admission Test
// Total: 150 MCQs | Time: 150 min
// Math 50, Physics 50, English 25, IQ 25
// Marking: +4 correct, −1 wrong | Total: 600 marks
// ============================================

const GIKI_QUESTION_BANK = {
    giki: {
        mathematics: [
            { id: "gi_m1", q: "lim(x→0) sin(x)/x equals:", a: ["1", "0", "∞", "Does not exist"], c: 0, e: "Standard limit: lim(x→0) sin(x)/x = 1" },
            { id: "gi_m2", q: "If A is 3×3 with det(A)=5, then det(2A)=:", a: ["40", "10", "20", "80"], c: 0, e: "det(kA) = k³ × det(A) = 8 × 5 = 40" },
            { id: "gi_m3", q: "Derivative of ln(x²):", a: ["2/x", "1/x²", "2x", "1/(2x)"], c: 0, e: "d/dx[2ln(x)] = 2/x" },
            { id: "gi_m4", q: "a=(1,2,3), b=(4,5,6). a·b =:", a: ["32", "30", "28", "15"], c: 0, e: "1×4 + 2×5 + 3×6 = 4+10+18 = 32" },
            { id: "gi_m5", q: "General solution of dy/dx = 2y:", a: ["y = Ce²ˣ", "y = 2x + C", "y = Ce⁻²ˣ", "y = x² + C"], c: 0, e: "Separable: dy/y = 2dx → y = Ce²ˣ" },
            { id: "gi_m6", q: "Taylor series of eˣ about x=0:", a: ["1 + x + x²/2! + x³/3! + ...", "1 - x + x²/2! - ...", "x + x²/2 + ...", "1 + x + x² + x³ + ..."], c: 0, e: "eˣ = Σ(xⁿ/n!)" },
            { id: "gi_m7", q: "Rank of 3×3 identity matrix:", a: ["3", "1", "0", "9"], c: 0, e: "All rows linearly independent → rank = 3" },
            { id: "gi_m8", q: "∫₀^π sin(x)dx =:", a: ["2", "0", "1", "π"], c: 0, e: "[-cos(x)]₀^π = -cos(π)+cos(0) = 1+1 = 2" },
            { id: "gi_m9", q: "Eigenvalues of [[3,0],[0,5]]:", a: ["3 and 5", "0 and 8", "1 and 15", "3 and 0"], c: 0, e: "Diagonal matrix: eigenvalues are diagonal entries." },
            { id: "gi_m10", q: "Laplace transform of f(t)=1:", a: ["1/s", "s", "1", "1/s²"], c: 0, e: "L{1} = 1/s for s > 0" }
        ],
        physics: [
            { id: "gi_p1", q: "Superposition principle applies to:", a: ["Waves", "Mass", "Temperature", "Density"], c: 0, e: "Waves can overlap and combine (superposition)." },
            { id: "gi_p2", q: "A capacitor stores energy in:", a: ["Electric field", "Magnetic field", "Heat", "Sound"], c: 0, e: "E = ½CV² stored in electric field." },
            { id: "gi_p3", q: "de Broglie wavelength:", a: ["λ = h/p", "λ = p/h", "λ = hf", "λ = c/f"], c: 0, e: "λ = h/p = h/(mv)" },
            { id: "gi_p4", q: "Increasing intensity in photoelectric effect increases:", a: ["Number of photoelectrons", "KE of photoelectrons", "Threshold frequency", "Work function"], c: 0, e: "More photons → more electrons emitted." },
            { id: "gi_p5", q: "Total energy of orbiting satellite is:", a: ["Negative", "Positive", "Zero", "Infinite"], c: 0, e: "E = -GMm/(2r) → negative" },
            { id: "gi_p6", q: "Binding energy per nucleon is max for:", a: ["Iron-56", "Uranium-238", "Hydrogen-1", "Helium-4"], c: 0, e: "Fe-56: ~8.8 MeV/nucleon, most stable." },
            { id: "gi_p7", q: "Efficiency of Carnot engine between 600K and 300K:", a: ["50%", "25%", "100%", "75%"], c: 0, e: "η = 1 - Tc/Th = 1 - 300/600 = 50%" },
            { id: "gi_p8", q: "Maxwell's equations describe:", a: ["Electric and magnetic fields", "Mass and velocity", "Force and acceleration", "Pressure and volume"], c: 0, e: "Maxwell's 4 equations unify EM theory." },
            { id: "gi_p9", q: "Half-life 10 days. After 30 days remaining:", a: ["1/8", "1/4", "1/2", "1/16"], c: 0, e: "3 half-lives: (1/2)³ = 1/8" },
            { id: "gi_p10", q: "In nuclear fission, a heavy nucleus splits into:", a: ["Lighter nuclei", "Heavier nucleus", "Electrons only", "Protons only"], c: 0, e: "Fission produces lighter fragments + energy." }
        ],
        english: [
            { id: "gi_e1", q: "Opposite of 'Eloquent':", a: ["Inarticulate", "Fluent", "Persuasive", "Articulate"], c: 0, e: "Eloquent = fluent speech. Inarticulate = unable to express." },
            { id: "gi_e2", q: "'The manager, along with his team, ___ working.'", a: ["is", "are", "were", "have been"], c: 0, e: "'Along with' doesn't change subject. Manager = singular → is." },
            { id: "gi_e3", q: "'Ubiquitous' means:", a: ["Present everywhere", "Rare", "Unique", "Invisible"], c: 0, e: "Ubiquitous = omnipresent." },
            { id: "gi_e4", q: "'Pragmatic' means:", a: ["Practical", "Theoretical", "Imaginative", "Emotional"], c: 0, e: "Pragmatic = practical, realistic." },
            { id: "gi_e5", q: "'I wish I ___ a bird.'", a: ["were", "was", "am", "be"], c: 0, e: "Subjunctive mood after wish: 'were'." }
        ],
        iq: [
            { id: "gi_iq1", q: "Next: J, F, M, A, M, J, ___", a: ["J", "A", "S", "O"], c: 0, e: "Month initials → July = J" },
            { id: "gi_iq2", q: "5 machines/5 widgets/5 min. 100 machines/100 widgets:", a: ["5 min", "100 min", "20 min", "1 min"], c: 0, e: "Each machine: 1 widget/5 min. 100 machines → 100 widgets in 5 min." },
            { id: "gi_iq3", q: "Odd one: 2, 3, 5, 7, 9, 11, 13", a: ["9", "3", "7", "11"], c: 0, e: "9 = 3×3 (not prime). Others are all prime." },
            { id: "gi_iq4", q: "Clock at 3:15. Angle between hands:", a: ["7.5°", "0°", "15°", "37.5°"], c: 0, e: "Hour at 97.5°, minute at 90° → diff = 7.5°" },
            { id: "gi_iq5", q: "All roses are flowers. Some flowers fade. Therefore:", a: ["Some roses may fade", "All roses fade", "No roses fade", "All flowers are roses"], c: 0, e: "Roses ⊂ Flowers. Some flowers fade → some roses may fade." }
        ]
    }
};

const GIKI_FIELD_CONFIG = {
    'GIKI': {
        key: 'giki', code: 'GIK', name: 'GIKI Admission Test',
        description: 'Ghulam Ishaq Khan Institute of Engineering Sciences & Technology',
        totalMarks: 600, duration: 150,
        markingScheme: { correct: 4, wrong: -1 },
        subjects: {
            mathematics: { name: 'Mathematics', weight: 33.3, marks: 200, questions: 50 },
            physics: { name: 'Physics', weight: 33.3, marks: 200, questions: 50 },
            english: { name: 'English', weight: 16.7, marks: 100, questions: 25 },
            iq: { name: 'IQ / General', weight: 16.7, marks: 100, questions: 25 }
        }
    }
};

const GIKI_SUBJECT_TEST_CONFIG = {
    giki: {
        mathematics: { questions: 15, marks: 60, duration: 20 },
        physics: { questions: 15, marks: 60, duration: 20 },
        english: { questions: 10, marks: 40, duration: 12 },
        iq: { questions: 10, marks: 40, duration: 12 }
    }
};

const GIKI_GRAND_TESTS = {
    giki: [
        { id: 'giki_grand_1', title: 'GIKI Full Mock Test 1', seed: 1 },
        { id: 'giki_grand_2', title: 'GIKI Full Mock Test 2', seed: 2 }
    ]
};
