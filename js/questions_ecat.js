// ============================================
// UNITEST - UET ECAT QUESTIONS
// File: js/questions_ecat.js
// Pattern: UET Engineering College Admission Test
// Total: 100 MCQs | Time: 100 min
// Math 30, Physics 30, Chemistry 30, English 10
// Marking: +4 correct, −1 wrong | Total: 400 marks
// ============================================

const ECAT_QUESTION_BANK = {
    ecat: {
        mathematics: [
            { id: "ec_m1", q: "The value of sin(30°) is:", a: ["0.5", "1", "√3/2", "0"], c: 0, e: "sin(30°) = ½ = 0.5" },
            { id: "ec_m2", q: "If y = x³, then dy/dx at x = 2 is:", a: ["12", "8", "6", "4"], c: 0, e: "dy/dx = 3x². At x=2: 3(4) = 12" },
            { id: "ec_m3", q: "P(5,3) equals:", a: ["60", "10", "120", "20"], c: 0, e: "P(5,3) = 5!/(5-3)! = 120/2 = 60" },
            { id: "ec_m4", q: "The quadratic formula gives roots as:", a: ["(-b ± √(b²-4ac))/2a", "(-b ± √(b²+4ac))/2a", "(b ± √(b²-4ac))/2a", "(-b ± √(b²-4ac))/a"], c: 0, e: "Standard: x = (-b ± √(b²-4ac)) / 2a" },
            { id: "ec_m5", q: "∫₀³ x² dx equals:", a: ["9", "27", "3", "18"], c: 0, e: "∫₀³ x² dx = [x³/3]₀³ = 27/3 = 9" },
            { id: "ec_m6", q: "If log₁₀(x) = 2, then x =:", a: ["100", "20", "10", "1000"], c: 0, e: "log₁₀(x) = 2 → x = 10² = 100" },
            { id: "ec_m7", q: "The distance between (0,0) and (3,4) is:", a: ["5", "7", "25", "1"], c: 0, e: "d = √(9+16) = √25 = 5" },
            { id: "ec_m8", q: "C(8,2) equals:", a: ["28", "16", "56", "64"], c: 0, e: "C(8,2) = (8×7)/(2×1) = 28" },
            { id: "ec_m9", q: "If f(x) = 2ˣ, then f(3) =:", a: ["8", "6", "9", "16"], c: 0, e: "2³ = 8" },
            { id: "ec_m10", q: "The 5th term of AP 3, 7, 11, 15, ... is:", a: ["19", "23", "17", "21"], c: 0, e: "a₅ = 3 + (5-1)×4 = 3 + 16 = 19" }
        ],
        physics: [
            { id: "ec_p1", q: "Newton's second law is:", a: ["F = ma", "F = mv", "F = m/a", "F = a/m"], c: 0, e: "Force = mass × acceleration." },
            { id: "ec_p2", q: "Escape velocity from Earth is approximately:", a: ["11.2 km/s", "7.9 km/s", "3.2 km/s", "15 km/s"], c: 0, e: "Earth escape velocity ≈ 11.2 km/s." },
            { id: "ec_p3", q: "Which is a vector quantity?", a: ["Velocity", "Speed", "Mass", "Temperature"], c: 0, e: "Velocity has magnitude and direction." },
            { id: "ec_p4", q: "Two 6Ω resistors in parallel give:", a: ["3Ω", "6Ω", "12Ω", "36Ω"], c: 0, e: "1/R = 1/6 + 1/6 → R = 3Ω" },
            { id: "ec_p5", q: "Time period of simple pendulum depends on:", a: ["Length and g", "Mass and length", "Mass and g", "Mass only"], c: 0, e: "T = 2π√(L/g)" },
            { id: "ec_p6", q: "SI unit of momentum is:", a: ["kg·m/s", "N·s²", "kg·m²/s", "N/m"], c: 0, e: "p = mv → kg × m/s" },
            { id: "ec_p7", q: "Which mirror is used in car headlights?", a: ["Concave", "Convex", "Plane", "Cylindrical"], c: 0, e: "Concave mirrors converge light into a beam." },
            { id: "ec_p8", q: "The unit of capacitance is:", a: ["Farad", "Henry", "Ohm", "Tesla"], c: 0, e: "Capacitance measured in Farads (F)." }
        ],
        chemistry: [
            { id: "ec_c1", q: "Atomic number of Carbon is:", a: ["6", "12", "8", "14"], c: 0, e: "Carbon has 6 protons → atomic number 6." },
            { id: "ec_c2", q: "Gas produced when Zn reacts with dilute HCl:", a: ["Hydrogen", "Oxygen", "Chlorine", "Nitrogen"], c: 0, e: "Zn + 2HCl → ZnCl₂ + H₂↑" },
            { id: "ec_c3", q: "Molecular formula of glucose:", a: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "CH₂O", "C₂H₅OH"], c: 0, e: "Glucose is C₆H₁₂O₆." },
            { id: "ec_c4", q: "Highest electronegativity element:", a: ["Fluorine", "Oxygen", "Nitrogen", "Chlorine"], c: 0, e: "Fluorine: 3.98 (Pauling scale), highest." },
            { id: "ec_c5", q: "Dalton's law applies to:", a: ["Non-reacting gas mixtures", "Reacting gases", "Liquids", "Solids"], c: 0, e: "Total pressure = sum of partial pressures." },
            { id: "ec_c6", q: "Valency of oxygen is:", a: ["2", "1", "3", "4"], c: 0, e: "O needs 2 electrons → valency 2." },
            { id: "ec_c7", 
