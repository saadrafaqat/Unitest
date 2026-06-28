// ============================================
// UNITEST - MDCAT QUESTIONS
// File: js/questions_mdcat.js
// Pattern: PMC MDCAT 2024-25
// Total: 210 MCQs | Time: 210 min
// Biology 68, Chemistry 54, Physics 54, English 18, Logical Reasoning 16
// Marking: +5 correct, −1 wrong | Total: 1050 marks
// ============================================

const MDCAT_QUESTION_BANK = {
    mdcat: {
        biology: [
            { id: "md_b1", q: "The powerhouse of the cell is:", a: ["Mitochondria", "Nucleus", "Ribosome", "Golgi apparatus"], c: 0, e: "Mitochondria produce ATP through oxidative phosphorylation." },
            { id: "md_b2", q: "Which enzyme breaks down starch into maltose?", a: ["Amylase", "Lipase", "Protease", "Lactase"], c: 0, e: "Salivary and pancreatic amylase hydrolyze starch to maltose." },
            { id: "md_b3", q: "The universal donor blood group is:", a: ["O−", "AB+", "A+", "B−"], c: 0, e: "O− lacks A, B antigens and Rh factor." },
            { id: "md_b4", q: "DNA replication is:", a: ["Semi-conservative", "Conservative", "Dispersive", "Random"], c: 0, e: "Proven by Meselson-Stahl experiment." },
            { id: "md_b5", q: "Which vitamin is essential for blood clotting?", a: ["Vitamin K", "Vitamin C", "Vitamin A", "Vitamin D"], c: 0, e: "Vitamin K is needed for prothrombin and clotting factor synthesis." },
            { id: "md_b6", q: "The fluid mosaic model describes the structure of:", a: ["Cell membrane", "Cell wall", "Nucleus", "Ribosome"], c: 0, e: "Singer and Nicolson proposed the fluid mosaic model for plasma membrane." },
            { id: "md_b7", q: "Crossing over occurs during which phase of meiosis?", a: ["Prophase I", "Metaphase I", "Anaphase I", "Telophase I"], c: 0, e: "Crossing over occurs during pachytene of Prophase I." },
            { id: "md_b8", q: "The oxygen-carrying protein in red blood cells is:", a: ["Hemoglobin", "Myoglobin", "Albumin", "Fibrinogen"], c: 0, e: "Hemoglobin binds O₂ in RBCs for transport." },
            { id: "md_b9", q: "Photosynthesis occurs in:", a: ["Chloroplasts", "Mitochondria", "Ribosomes", "Lysosomes"], c: 0, e: "Light-dependent and light-independent reactions occur in chloroplasts." },
            { id: "md_b10", q: "The part of the brain responsible for balance and coordination is:", a: ["Cerebellum", "Cerebrum", "Medulla oblongata", "Hypothalamus"], c: 0, e: "Cerebellum coordinates voluntary movements and balance." },
            { id: "md_b11", q: "Which hormone regulates blood sugar levels?", a: ["Insulin", "Thyroxine", "Adrenaline", "Estrogen"], c: 0, e: "Insulin lowers blood glucose by promoting cellular uptake." },
            { id: "md_b12", q: "The process by which mRNA is synthesized from DNA is:", a: ["Transcription", "Translation", "Replication", "Transduction"], c: 0, e: "Transcription produces mRNA from DNA template." },
            { id: "md_b13", q: "Antibodies are produced by:", a: ["B-lymphocytes", "T-lymphocytes", "Red blood cells", "Platelets"], c: 0, e: "B cells differentiate into plasma cells that secrete antibodies." },
            { id: "md_b14", q: "The basic unit of the kidney is:", a: ["Nephron", "Neuron", "Alveolus", "Villus"], c: 0, e: "Nephrons filter blood and produce urine." },
            { id: "md_b15", q: "Which of the following is NOT a function of the liver?", a: ["Production of insulin", "Bile production", "Detoxification", "Glycogen storage"], c: 0, e: "Insulin is produced by pancreatic beta cells, not the liver." }
        ],
        chemistry: [
            { id: "md_c1", q: "The pH of a neutral solution at 25°C is:", a: ["7", "0", "14", "1"], c: 0, e: "Pure water at 25°C: pH = 7 (neutral)." },
            { id: "md_c2", q: "Which is the strongest acid?", a: ["HCl", "CH₃COOH", "H₂CO₃", "HF"], c: 0, e: "HCl is a strong acid that completely dissociates." },
            { id: "md_c3", q: "Hybridization of carbon in methane (CH₄) is:", a: ["sp³", "sp²", "sp", "dsp²"], c: 0, e: "4 bonding pairs → sp³ hybridized (tetrahedral 109.5°)." },
            { id: "md_c4", q: "Avogadro's number is approximately:", a: ["6.022 × 10²³", "6.022 × 10²²", "6.022 × 10²⁴", "3.011 × 10²³"], c: 0, e: "Nₐ = 6.022 × 10²³ mol⁻¹" },
            { id: "md_c5", q: "The functional group −COOH is called:", a: ["Carboxyl", "Hydroxyl", "Carbonyl", "Amino"], c: 0, e: "−COOH is the carboxyl group in carboxylic acids." },
            { id: "md_c6", q: "Which element has the highest electronegativity?", a: ["Fluorine", "Oxygen", "Nitrogen", "Chlorine"], c: 0, e: "Fluorine has electronegativity 3.98 (Pauling scale), highest of all." },
            { id: "md_c7", q: "The molecular formula of glucose is:", a: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "CH₂O", "C₂H₅OH"], c: 0, e: "Glucose is a monosaccharide: C₆H₁₂O₆." },
            { id: "md_c8", q: "Oxidation state of Mn in KMnO₄:", a: ["+7", "+5", "+4", "+6"], c: 0, e: "K(+1) + Mn(x) + 4O(-2) = 0 → x = +7" },
            { id: "md_c9", q: "Which bond is present in NaCl?", a: ["Ionic", "Covalent", "Metallic", "Hydrogen"], c: 0, e: "Na donates electron to Cl → Na⁺Cl⁻ ionic bond." },
            { id: "md_c10", q: "The ideal gas equation is:", a: ["PV = nRT", "PV = mRT", "P = nVT", "PV = RT"], c: 0, e: "PV = nRT where n = moles, R = gas constant." }
        ],
        physics: [
            { id: "md_p1", q: "The unit of frequency is:", a: ["Hertz", "Newton", "Pascal", "Watt"], c: 0, e: "Frequency = cycles/second = Hertz (Hz)." },
            { id: "md_p2", q: "Ohm's law states:", a: ["V = IR", "V = I/R", "V = R/I", "I = VR"], c: 0, e: "Voltage = Current × Resistance." },
            { id: "md_p3", q: "Focal length of a plane mirror is:", a: ["Infinity", "Zero", "1 meter", "0.5 meter"], c: 0, e: "Plane mirror: infinite radius of curvature → f = ∞." },
            { id: "md_p4", q: "Which color has the longest wavelength?", a: ["Red", "Violet", "Blue", "Green"], c: 0, e: "Red light: ~620-750 nm, longest in visible spectrum." },
            { id: "md_p5", q: "The SI unit of power is:", a: ["Watt", "Joule", "Newton", "Ampere"], c: 0, e: "Power = Work/Time, unit = Watt = J/s." },
            { id: "md_p6", q: "Newton's second law:", a: ["F = ma", "F = mv", "F = m/a", "F = a/m"], c: 0, e: "Force = mass × acceleration." },
            { id: "md_p7", q: "Which quantity is a vector?", a: ["Velocity", "Speed", "Mass", "Temperature"], c: 0, e: "Velocity has both magnitude and direction." },
            { id: "md_p8", q: "The time period of a simple pendulum depends on:", a: ["Length and g", "Mass and length", "Mass and g", "Mass only"], c: 0, e: "T = 2π√(L/g), depends on length and g." },
            { id: "md_p9", q: "Work done is zero when angle between F and d is:", a: ["90°", "0°", "45°", "180°"], c: 0, e: "W = Fd cos θ. cos(90°) = 0 → W = 0." },
            { id: "md_p10", q: "Sound travels fastest in:", a: ["Solids", "Liquids", "Gases", "Vacuum"], c: 0, e: "Closely packed molecules in solids → fastest sound." }
        ],
        english: [
            { id: "md_e1", q: "'A piece of cake' means:", a: ["Something very easy", "A dessert", "A reward", "Something valuable"], c: 0, e: "Idiom meaning something very easy to do." },
            { id: "md_e2", q: "Passive voice of 'She writes a letter':", a: ["A letter is written by her", "A letter was written by her", "A letter has been written", "A letter will be written"], c: 0, e: "Present simple → is + past participle." },
            { id: "md_e3", q: "Choose the correct spelling:", a: ["Accommodation", "Accomodation", "Acomodation", "Accommadation"], c: 0, e: "Double c, double m: Accommodation." },
            { id: "md_e4", q: "Antonym of 'Transparent':", a: ["Opaque", "Clear", "Visible", "Bright"], c: 0, e: "Transparent = see-through; Opaque = not see-through." },
            { id: "md_e5", q: "The plural of 'phenomenon' is:", a: ["Phenomena", "Phenomenons", "Phenomenas", "Phenomeni"], c: 0, e: "Greek origin: phenomenon → phenomena." }
        ],
        logical_reasoning: [
            { id: "md_lr1", q: "All dogs are animals. All animals are living things. Therefore:", a: ["All dogs are living things", "Some dogs are not living", "All living things are dogs", "No dogs are living"], c: 0, e: "Valid syllogism: Dogs ⊂ Animals ⊂ Living Things." },
            { id: "md_lr2", q: "If COMPUTER → DPNQVUFS, then SCIENCE →:", a: ["TDJFODF", "TDKFODF", "RDHFMBD", "TDJFMDF"], c: 0, e: "Each letter shifted +1: S→T, C→D, I→J, E→F, N→O, C→D, E→F." },
            { id: "md_lr3", q: "Next in series: 3, 9, 27, 81, ___", a: ["243", "162", "108", "324"], c: 0, e: "×3 each time: 81 × 3 = 243." },
            { id: "md_lr4", q: "Find the odd one out: Square, Rectangle, Triangle, Cube", a: ["Cube", "Triangle", "Square", "Rectangle"], c: 0, e: "Cube is 3D; others are 2D shapes." },
            { id: "md_lr5", q: "Complete: 2, 6, 18, 54, ___", a: ["162", "108", "148", "216"], c: 0, e: "×3 pattern: 54 × 3 = 162." }
        ]
    }
};

const MDCAT_FIELD_CONFIG = {
    'MDCAT': {
        key: 'mdcat', code: 'MDC', name: 'MDCAT (PMC)',
        description: 'Pakistan Medical Commission - Medical & Dental College Admission Test',
        totalMarks: 1050, duration: 210,
        markingScheme: { correct: 5, wrong: -1 },
        subjects: {
            biology: { name: 'Biology', weight: 32.4, marks: 340, questions: 68 },
            chemistry: { name: 'Chemistry', weight: 25.7, marks: 270, questions: 54 },
            physics: { name: 'Physics', weight: 25.7, marks: 270, questions: 54 },
            english: { name: 'English', weight: 8.6, marks: 90, questions: 18 },
            logical_reasoning: { name: 'Logical 
