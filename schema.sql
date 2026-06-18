-- ============================================
-- NUSTOLOGY PREP DATABASE SCHEMA
-- ============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS warnings;
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS private_messages;
DROP TABLE IF EXISTS group_messages;
DROP TABLE IF EXISTS lectures;
DROP TABLE IF EXISTS merit_lists;
DROP TABLE IF EXISTS test_answers;
DROP TABLE IF EXISTS test_attempts;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS settings;

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default admin (username: admin, password: admin123)
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    email TEXT,
    profile_picture TEXT DEFAULT '',
    profile_complete INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_warned INTEGER DEFAULT 0,
    warning_message TEXT DEFAULT '',
    field TEXT DEFAULT 'Engineering',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- ============================================
-- STUDENT PROFILES (Detailed Info)
-- ============================================
CREATE TABLE student_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER UNIQUE NOT NULL,
    phone TEXT,
    district TEXT,
    city TEXT,
    province TEXT,
    address TEXT,
    date_of_birth TEXT,
    gender TEXT,
    father_name TEXT,
    father_occupation TEXT,
    matric_marks INTEGER,
    matric_total INTEGER,
    matric_board TEXT,
    matric_year TEXT,
    fsc_marks INTEGER,
    fsc_total INTEGER,
    fsc_board TEXT,
    fsc_year TEXT,
    fsc_part TEXT,
    last_net_score INTEGER DEFAULT 0,
    last_net_attempt TEXT,
    planning_net TEXT,
    target_university TEXT,
    target_field TEXT,
    target_score INTEGER,
    preferred_campus TEXT,
    additional_notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- SESSIONS TABLE
-- ============================================
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    user_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);

-- ============================================
-- TEST ATTEMPTS
-- ============================================
CREATE TABLE test_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    test_type TEXT NOT NULL,
    field TEXT NOT NULL,
    subject TEXT,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    unattempted INTEGER DEFAULT 0,
    score REAL DEFAULT 0,
    total_marks INTEGER NOT NULL,
    percentage REAL DEFAULT 0,
    time_taken INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    status TEXT DEFAULT 'in_progress',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- TEST ANSWERS (For Review)
-- ============================================
CREATE TABLE test_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    question_text TEXT,
    question_subject TEXT,
    options TEXT,
    correct_answer INTEGER NOT NULL,
    selected_answer INTEGER,
    is_correct INTEGER DEFAULT 0,
    marked_for_review INTEGER DEFAULT 0,
    FOREIGN KEY (attempt_id) REFERENCES test_attempts(id) ON DELETE CASCADE
);

-- ============================================
-- MERIT LISTS
-- ============================================
CREATE TABLE merit_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    field TEXT NOT NULL,
    year TEXT NOT NULL,
    program TEXT,
    campus TEXT,
    file_url TEXT,
    description TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- VIDEO LECTURES
-- ============================================
CREATE TABLE lectures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    thumbnail TEXT,
    subject TEXT NOT NULL,
    field TEXT NOT NULL,
    topic TEXT,
    instructor TEXT,
    duration TEXT,
    difficulty TEXT DEFAULT 'Medium',
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GROUP MESSAGES (Public Chat)
-- ============================================
CREATE TABLE group_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- PRIVATE MESSAGES
-- ============================================
CREATE TABLE private_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (to_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- COMMUNITY POSTS (Queries)
-- ============================================
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- POST LIKES
-- ============================================
CREATE TABLE post_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, student_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- POST COMMENTS
-- ============================================
CREATE TABLE post_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- WARNINGS
-- ============================================
CREATE TABLE warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    issued_by TEXT DEFAULT 'admin',
    is_read INTEGER DEFAULT 0,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- REPORTS (Student reporting other students)
-- ============================================
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id INTEGER NOT NULL,
    reported_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    chat_context TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (reporter_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT INTO settings (key, value) VALUES 
('site_name', 'NUSTology Prep.'),
('test_negative_marking', '0.25'),
('default_test_duration', '120');

-- ============================================
-- SAMPLE DATA: Add a test student
-- ============================================
INSERT INTO students (username, password, full_name, email, field) VALUES 
('student1', 'pass123', 'Demo Student', 'demo@nustology.com', 'Engineering'),
('student2', 'pass123', 'Test Student', 'test@nustology.com', 'Medical');

-- ============================================
-- SAMPLE LECTURES
-- ============================================
INSERT INTO lectures (title, description, youtube_url, subject, field, topic, instructor, duration, difficulty) VALUES
('Physics - Mechanics Complete', 'Complete Mechanics for NUST NET preparation', 'https://www.youtube.com/watch?v=ZM8ECpBuQYE', 'Physics', 'Engineering', 'Mechanics', 'Sir Khalid', '2h 30m', 'Medium'),
('Mathematics - Calculus Basics', 'Foundation of calculus for entry test', 'https://www.youtube.com/watch?v=HfACrKJ_Y2w', 'Mathematics', 'Engineering', 'Calculus', 'Sir Ahmed', '1h 45m', 'Easy'),
('Chemistry - Organic Chemistry', 'Important organic chemistry topics', 'https://www.youtube.com/watch?v=bka20Q9TN6M', 'Chemistry', 'Medical', 'Organic', 'Dr. Sarah', '3h 10m', 'Hard');

-- ============================================
-- SAMPLE MERIT LIST
-- ============================================
INSERT INTO merit_lists (title, field, year, program, campus, description) VALUES
('NUST Merit List 2025 - SEECS', 'Engineering', '2025', 'BS Computer Science', 'Islamabad (H-12)', 'Final merit list for BS Computer Science program 2025'),
('NUST Merit List 2025 - ASAB', 'Medical', '2025', 'BS Biotechnology', 'Islamabad (H-12)', 'Final merit list for BS Biotechnology program 2025'),
('NUST Merit List 2025 - NBS', 'Business', '2025', 'BBA', 'Islamabad (H-12)', 'Final merit list for BBA program 2025');

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_students_username ON students(username);
CREATE INDEX idx_test_attempts_student ON test_attempts(student_id);
CREATE INDEX idx_test_answers_attempt ON test_answers(attempt_id);
CREATE INDEX idx_group_messages_sent ON group_messages(sent_at);
CREATE INDEX idx_private_messages_users ON private_messages(from_id, to_id);
CREATE INDEX idx_posts_created ON posts(created_at);
