-- ============================================
-- ADDITIONS FOR CLOUDINARY PROFILE PICTURES
-- AND STUDENT ANALYTICS
-- ============================================

-- ============================================
-- 1. ADD COLUMN TO STUDENTS TABLE
-- ============================================
ALTER TABLE students ADD COLUMN profile_picture_public_id TEXT DEFAULT '';
ALTER TABLE students ADD COLUMN total_tests_taken INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN avg_score REAL DEFAULT 0;
ALTER TABLE students ADD COLUMN best_score REAL DEFAULT 0;
ALTER TABLE students ADD COLUMN last_activity DATETIME;

-- ============================================
-- 2. ADD CLOUDINARY SETTINGS
-- ============================================
INSERT OR IGNORE INTO settings (key, value) VALUES 
('cloudinary_cloud_name', 'your-cloud-name'),
('cloudinary_api_key', 'your-api-key'),
('cloudinary_api_secret', 'your-api-secret'),
('cloudinary_upload_preset', 'your-upload-preset'),
('cloudinary_folder', 'nustology/profiles');

-- ============================================
-- 3. CREATE STUDENT SUBJECT PERFORMANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_subject_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    avg_percentage REAL DEFAULT 0,
    best_percentage REAL DEFAULT 0,
    last_attempt_date DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE(student_id, subject)
);

-- ============================================
-- 4. CREATE STUDENT TEST REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_test_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    question_text TEXT,
    question_subject TEXT,
    options TEXT,
    correct_answer INTEGER,
    selected_answer INTEGER,
    is_correct INTEGER DEFAULT 0,
    is_skipped INTEGER DEFAULT 0,
    marked_for_review INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES test_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- 5. CREATE PROFILE PICTURE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profile_picture_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    old_public_id TEXT,
    new_public_id TEXT,
    old_url TEXT,
    new_url TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- 6. TRIGGER TO UPDATE STUDENT STATS
-- ============================================
CREATE TRIGGER IF NOT EXISTS update_student_stats_after_test
AFTER UPDATE ON test_attempts
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
    UPDATE students 
    SET total_tests_taken = (
        SELECT COUNT(*) FROM test_attempts 
        WHERE student_id = NEW.student_id AND status = 'completed'
    ),
    avg_score = (
        SELECT AVG(percentage) FROM test_attempts 
        WHERE student_id = NEW.student_id AND status = 'completed'
    ),
    best_score = (
        SELECT MAX(percentage) FROM test_attempts 
        WHERE student_id = NEW.student_id AND status = 'completed'
    ),
    last_activity = datetime('now')
    WHERE id = NEW.student_id;
    
    -- Update subject performance
    INSERT OR REPLACE INTO student_subject_performance (
        student_id, subject, total_attempts, correct_answers, wrong_answers, 
        total_questions, avg_percentage, best_percentage, last_attempt_date, updated_at
    )
    SELECT 
        NEW.student_id,
        CASE 
            WHEN ta.subject IS NOT NULL AND ta.subject != '' THEN ta.subject
            ELSE 'Overall'
        END,
        COUNT(*),
        SUM(CASE WHEN ta.correct_answers > 0 THEN ta.correct_answers ELSE 0 END),
        SUM(CASE WHEN ta.wrong_answers > 0 THEN ta.wrong_answers ELSE 0 END),
        SUM(ta.total_questions),
        AVG(ta.percentage),
        MAX(ta.percentage),
        MAX(ta.completed_at),
        datetime('now')
    FROM test_attempts ta
    WHERE ta.student_id = NEW.student_id 
    AND ta.status = 'completed'
    GROUP BY CASE 
        WHEN ta.subject IS NOT NULL AND ta.subject != '' THEN ta.subject
        ELSE 'Overall'
    END;
END;

-- ============================================
-- 7. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_students_profile_picture ON students(profile_picture);
CREATE INDEX IF NOT EXISTS idx_students_public_id ON students(profile_picture_public_id);
CREATE INDEX IF NOT EXISTS idx_student_subject_performance_student ON student_subject_performance(student_id);
CREATE INDEX IF NOT EXISTS idx_student_test_reviews_attempt ON student_test_reviews(attempt_id);
CREATE INDEX IF NOT EXISTS idx_student_test_reviews_student ON student_test_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_profile_picture_history_student ON profile_picture_history(student_id);
CREATE INDEX IF NOT EXISTS idx_students_avg_score ON students(avg_score);

-- ============================================
-- 8. VIEWS
-- ============================================
-- Student Performance Summary View
CREATE VIEW IF NOT EXISTS v_student_performance_summary AS
SELECT 
    s.id AS student_id,
    s.username,
    s.full_name,
    s.degree_category,
    s.profile_picture,
    s.total_tests_taken,
    s.avg_score,
    s.best_score,
    COUNT(DISTINCT ta.id) AS total_attempts,
    COALESCE(SUM(ta.correct_answers), 0) AS total_correct,
    COALESCE(SUM(ta.wrong_answers), 0) AS total_wrong,
    COALESCE(SUM(ta.unattempted), 0) AS total_skipped,
    MAX(ta.completed_at) AS last_test_date
FROM students s
LEFT JOIN test_attempts ta ON s.id = ta.student_id AND ta.status = 'completed'
WHERE s.is_active = 1
GROUP BY s.id;

-- Student Profile with Details View
CREATE VIEW IF NOT EXISTS v_student_full_profile AS
SELECT 
    s.id,
    s.username,
    s.full_name,
    s.email,
    s.phone,
    s.profile_picture,
    s.profile_picture_public_id,
    s.is_active,
    s.approval_status,
    s.degree_category,
    s.field,
    s.total_tests_taken,
    s.avg_score,
    s.best_score,
    s.created_at,
    s.last_login,
    sp.city,
    sp.province,
    sp.father_name,
    sp.cnic,
    sp.matric_marks,
    sp.matric_total,
    sp.matric_board,
    sp.fsc_marks,
    sp.fsc_total,
    sp.fsc_board,
    sp.preference_1,
    sp.preference_2,
    sp.preference_3
FROM students s
LEFT JOIN student_profiles sp ON s.id = sp.student_id;

-- Subject Performance View
CREATE VIEW IF NOT EXISTS v_subject_performance_global AS
SELECT 
    sp.subject,
    COUNT(DISTINCT sp.student_id) AS unique_students,
    SUM(sp.total_attempts) AS total_attempts,
    AVG(sp.avg_percentage) AS avg_percentage,
    MAX(sp.best_percentage) AS best_percentage,
    MIN(sp.avg_percentage) AS min_percentage
FROM student_subject_performance sp
GROUP BY sp.subject
ORDER BY avg_percentage DESC;

-- ============================================
-- 9. UPDATE EXISTING STUDENTS WITH DEFAULT AVATAR
-- ============================================
UPDATE students 
SET profile_picture = 'https://ui-avatars.com/api/?name=' || 
    REPLACE(COALESCE(full_name, username), ' ', '+') || 
    '&background=1a56db&color=fff&size=128&rounded=true'
WHERE profile_picture IS NULL OR profile_picture = '';

-- ============================================
-- 10. SAMPLE TEST DATA FOR DEMO STUDENT
-- ============================================
-- Add some sample subject performance for student1
INSERT OR IGNORE INTO student_subject_performance (student_id, subject, total_attempts, correct_answers, wrong_answers, total_questions, avg_percentage, best_percentage, last_attempt_date)
VALUES 
(1, 'Physics', 3, 45, 15, 75, 60.0, 72.0, datetime('now')),
(1, 'Mathematics', 3, 38, 22, 75, 50.7, 65.0, datetime('now')),
(1, 'Chemistry', 2, 28, 12, 50, 56.0, 60.0, datetime('now')),
(1, 'English', 3, 42, 8, 75, 56.0, 68.0, datetime('now'));

-- Update student1 stats
UPDATE students 
SET total_tests_taken = 11, 
    avg_score = 55.7, 
    best_score = 72.0,
    last_activity = datetime('now')
WHERE id = 1;
