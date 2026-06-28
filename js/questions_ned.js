// ============================================
// UNITEST - NED QUESTIONS
// File: js/questions_ned.js
// Pattern: NED University of Engineering & Technology
// Total: 100 MCQs | Time: 120 min
// Math 40, Physics 30, Chemistry 15, English 15
// Marking: +4 correct, 0 wrong | Total: 400 marks
// ============================================

const NED_QUESTION_BANK = {
    ned: {
        mathematics: [
            { id: "ne_m1", q: "Solution of 2x + 5 = 15:", a: ["5", "10", "7.5", "3"], c: 0, e: "2x = 10 → x = 5" },
            { id: "ne_m2", q: "Area of circle with r=7 (π=22/7):", a: ["154 cm²", "44 cm²", "49 cm²", "308 cm²"], c: 0, e: "A = πr² = 22/7 × 49 = 154" },
            { id: "ne_m3", q: "Distance between (1,2) and (4,6):", a: ["5", "7", "25", "3"], c: 0, e: "d = √(9+16) = 5" },
            { id: "ne_m4", q: "If tan θ = 1, then θ =:", a: ["45°", "30°", "60°", "90°"], c: 0, e: "tan(45°) = 1" },
            { id: "ne_m5", q: "10th term of AP 2, 5, 8, 11...:", a: ["29", "32", "26", "35"], c: 0, e: "a₁₀ = 2 + 9(3) = 29" },
            { id: "ne_m6", q: "Slope of y = 3x + 5:", a: ["3", "5", "-3", "1/3"], c: 0, e: "y = mx + b → m = 3" },
            { id: "ne_m7", q: "Area of triangle (base=10, h=6):", a: ["30", "60", "16", "20"], c: 0, e: "A = ½bh = ½(10)(6) = 30" },
            { id: "ne_m8", q: "Value of sin(90°):", a: ["1", "0", "-1", "∞"], c: 0, e: "sin(90°) = 1" },
            { id: "ne_m9", q: "If 2ˣ = 64, x =:", a: ["6", "5", "8", "4"], c: 0, e: "2⁶ = 64" },
            { id: "ne_m10", q: "cos(60°) =:", a: ["0.5", "1", "√3/2", "0"], c: 0, e: "cos(60°) = ½" }
        ],
        physics: [
            { id: "ne_p1", q: "Unit of work:", a: ["Joule", "Newton", "Watt", "Pascal"], c: 0, e: "Work = Fd → Newton·meter = Joule" },
            { id: "ne_p2", q: "A body at rest has (if elevated):", a: ["Potential energy", "Kinetic energy", "Both KE and PE", "No energy"], c: 0, e: "At rest: KE = 0. If elevated: has PE." },
            { id: "ne_p3", q: "Snell's law relates to:", a: ["Refraction", "Reflection", "Diffraction", "Polarization"], c: 0, e: "n₁ sin θ₁ = n₂ sin θ₂" },
            { id: "ne_p4", q: "F = ma is:", a: ["Newton's 2nd law", "Newton's 1st law", "Newton's 3rd law", "Ohm's law"], c: 0, e: "Newton's 2nd law of motion." },
            { id: "ne_p5", q: "SI unit of momentum:", a: ["kg·m/s", "N·s²", "kg·m²/s", "N/m"], c: 0, e: "p = mv → kg × m/s" },
            { id: "ne_p6", q: "Transformer works on:", a: ["Electromagnetic induction", "Electrostatics", "Photoelectric effect", "Nuclear fission"], c: 0, e: "Faraday's law of electromagnetic induction." },
            { id: "ne_p7", q: "Concave lens corrects:", a: ["Myopia", "Hypermetropia", "Astigmatism", "Presbyopia"], c: 0, e: "Myopia (near-sight) corrected by concave (diverging) lens." },
            { id: "ne_p8", q: "Acceleration due to gravity:", a: ["9.8 m/s²", "10.8 m/s²", "8.9 m/s²", "6.8 m/s²"], c: 0, e: "g ≈ 9.8 m/s²" }
        ],
        chemistry: [
            { id: "ne_c1", q: "Valency of oxygen:", a: ["2", "1", "3", "4"], c: 0, e: "O needs 2 electrons → valency 2." },
            { id: "ne_c2", q: "Brass is alloy of:", a: ["Copper and Zinc", "Copper and Tin", "Iron and Carbon", "Al and Cu"], c: 0, e: "Brass = Cu + Zn." },
            { id: "ne_c3", q: "Formula of water:", a: ["H₂O", "H₂O₂", "HO", "H₃O"], c: 0, e: "Water = H₂O" },
            { id: "ne_c4", q: "Atomic number of Carbon:", a: ["6", "12", "8", "14"], c: 0, e: "C has 6 protons." },
            { id: "ne_c5", q: "Gas from Zn + dilute HCl:", a: ["Hydrogen", "Oxygen", "Chlorine", "Nitrogen"], c: 0, e: "Zn + 2HCl → ZnCl₂ + H₂↑" }
        ],
        english: [
            { id: "ne_e1", q: "'___ apple a day keeps the doctor away.'", a: ["An", "A", "The", "No article"], c: 0, e: "Vowel sound → 'An'." },
            { id: "ne_e2", q: "Past tense of 'go':", a: ["went", "gone", "goed", "going"], c: 0, e: "go → went → gone (irregular)." },
            { id: "ne_e3", q: "'Brevity' means:", a: ["Shortness", "Length", "Strength", "Bravery"], c: 0, e: "Brevity = conciseness." },
            { id: "ne_e4", q: "'Ambiguous' means:", a: ["Having more than one meaning", "Clear", "Simple", "Direct"], c: 0, e: "Ambiguous = open to multiple interpretations." },
            { id: "ne_e5", q: "'If I ___ you, I would apologize.'", a: ["were", "was", "am", "be"], c: 0, e: "Second conditional: 'were' for all subjects." }
        ]
    }
};

const NED_FIELD_CONFIG = {
    'NED': {
        key: 'ned', code: 'NED', name: 'NED Entry Test',
        description: 'NED University of Engineering & Technology, Karachi',
        totalMarks: 400, duration: 120,
        markingScheme: { correct: 4, wrong: 0 },
        subjects: {
            mathematics: { name: 'Mathematics', weight: 40, marks: 160, questions: 40 },
            physics: { name: 'Physics', weight: 30, marks: 120, questions: 30 },
            chemistry: { name: 'Chemistry', weight: 15, marks: 60, questions: 15 },
            english: { name: 'English', weight: 15, marks: 60, questions: 15 }
        }
    }
};

const NED_SUBJECT_TEST_CONFIG = {
    ned: {
        mathematics: { questions: 15, marks: 60, duration: 20 },
        physics: { questions: 12, marks: 48, duration: 18 },
        chemistry: { questions: 8, marks: 32, duration: 12 },
        english: { questions: 8, marks: 32, duration: 10 }
    }
};

const NED_GRAND_TESTS = {
    ned: [
        { id: 'ned_grand_1', title: 'NED Full Mock Test 1', seed: 1 },
        { id: 'ned_grand_2', title: 'NED Full Mock Test 2', seed: 2 }
    ]
};
