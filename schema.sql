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
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS pdf_resources;
DROP TABLE IF EXISTS note_resources;
DROP TABLE IF EXISTS payment_records;
DROP TABLE IF EXISTS registrations;
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
    phone TEXT,
    profile_picture TEXT DEFAULT '',
    profile_complete INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_approved INTEGER DEFAULT 0,
    approval_status TEXT DEFAULT 'pending',
    is_warned INTEGER DEFAULT 0,
    warning_message TEXT DEFAULT '',
    degree_category TEXT DEFAULT 'Engineering',
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
    cnic TEXT,
    -- Matric Details
    matric_marks INTEGER,
    matric_total INTEGER,
    matric_board TEXT,
    matric_year TEXT,
    matric_grade TEXT,
    -- FSc Details
    fsc_marks INTEGER,
    fsc_total INTEGER,
    fsc_board TEXT,
    fsc_year TEXT,
    fsc_part TEXT,
    fsc_grade TEXT,
    -- Degree & Preferences
    degree_category TEXT,
    preference_1 TEXT,
    preference_2 TEXT,
    preference_3 TEXT,
    preference_4 TEXT,
    preference_5 TEXT,
    -- NET Info
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
-- REGISTRATIONS TABLE
-- (Stores new self-registration requests)
-- ============================================
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Personal Details
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT,
    gender TEXT,
    father_name TEXT,
    cnic TEXT,
    city TEXT,
    province TEXT,
    address TEXT,
    -- Academic Details
    matric_marks INTEGER,
    matric_total INTEGER DEFAULT 1100,
    matric_board TEXT,
    matric_year TEXT,
    fsc_marks INTEGER,
    fsc_total INTEGER DEFAULT 1100,
    fsc_board TEXT,
    fsc_year TEXT,
    fsc_part TEXT,
    -- Degree & Preferences
    degree_category TEXT NOT NULL,
    preference_1 TEXT,
    preference_2 TEXT,
    preference_3 TEXT,
    preference_4 TEXT,
    preference_5 TEXT,
    -- Login Credentials (chosen by student)
    desired_username TEXT NOT NULL,
    desired_password TEXT NOT NULL,
    -- Payment Details
    transaction_id TEXT,
    payment_screenshot_url TEXT,
    payment_method TEXT,
    payment_amount TEXT DEFAULT '500',
    payment_submitted_at DATETIME,
    -- Status
    status TEXT DEFAULT 'pending',
    rejection_reason TEXT DEFAULT '',
    reviewed_by TEXT DEFAULT '',
    reviewed_at DATETIME,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- After approval, link to created student
    student_id INTEGER DEFAULT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- ============================================
-- PAYMENT RECORDS TABLE
-- ============================================
CREATE TABLE payment_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    registration_id INTEGER,
    transaction_id TEXT NOT NULL,
    payment_method TEXT,
    payment_amount TEXT DEFAULT '500',
    payment_screenshot_url TEXT,
    payment_date TEXT,
    verification_status TEXT DEFAULT 'pending',
    verified_by TEXT DEFAULT '',
    verified_at DATETIME,
    notes TEXT DEFAULT '',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE SET NULL
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
-- PDF RESOURCES
-- ============================================
CREATE TABLE pdf_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size TEXT,
    subject TEXT NOT NULL,
    field TEXT NOT NULL,
    chapter TEXT,
    resource_type TEXT DEFAULT 'past_paper',
    -- resource_type: past_paper | admission_guide | merit_list | other
    uploaded_by TEXT DEFAULT 'admin',
    is_active INTEGER DEFAULT 1,
    download_count INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTE RESOURCES (Formulas, Short Notes)
-- ============================================
CREATE TABLE note_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size TEXT,
    subject TEXT NOT NULL,
    field TEXT NOT NULL,
    chapter TEXT,
    note_type TEXT DEFAULT 'formula_sheet',
    -- note_type: formula_sheet | short_notes | summary | cheat_sheet | other
    uploaded_by TEXT DEFAULT 'admin',
    is_active INTEGER DEFAULT 1,
    download_count INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS / ANNOUNCEMENTS
-- ============================================
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'announcement',
    -- type: announcement | new_content | payment | system | warning
    target_audience TEXT DEFAULT 'all',
    -- target_audience: all | Engineering | Computing | Business | Applied Sciences | Architecture | Natural Sciences
    is_active INTEGER DEFAULT 1,
    created_by TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME DEFAULT NULL
);

-- ============================================
-- NOTIFICATION READS (Track who read what)
-- ============================================
CREATE TABLE notification_reads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(notification_id, student_id),
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
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
-- REPORTS
-- ============================================
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id INTEGER NOT NULL,
    reported_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    chat_context TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    admin_note TEXT DEFAULT '',
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
('default_test_duration', '120'),
-- Payment Bank Details (Admin configurable)
('bank_name', 'HBL Bank'),
('bank_account_title', 'NUSTology Prep Academy'),
('bank_account_number', '1234-5678-9012'),
('bank_iban', 'PK00HBL0000001234567890'),
('easypaisa_number', '0300-0000000'),
('jazzcash_number', '0300-0000000'),
('registration_fee', '500'),
('payment_instructions', 'Please pay the registration fee and upload your payment screenshot along with the transaction ID.');

-- ============================================
-- SAMPLE DATA: Students
-- ============================================
INSERT INTO students (username, password, full_name, email, field, degree_category, is_approved, approval_status) VALUES 
('student1', 'pass123', 'Demo Student', 'demo@nustology.com', 'Engineering', 'Engineering', 1, 'approved'),
('student2', 'pass123', 'Test Student', 'test@nustology.com', 'Business', 'Business', 1, 'approved');

-- ============================================
-- SAMPLE LECTURES
-- ============================================
INSERT INTO lectures (title, description, youtube_url, subject, field, topic, instructor, duration, difficulty) VALUES
('Physics - Mechanics Complete', 'Complete Mechanics for NUST NET preparation', 'https://www.youtube.com/watch?v=ZM8ECpBuQYE', 'Physics', 'Engineering', 'Mechanics', 'Sir Khalid', '2h 30m', 'Medium'),
('Mathematics - Calculus Basics', 'Foundation of calculus for entry test', 'https://www.youtube.com/watch?v=HfACrKJ_Y2w', 'Mathematics', 'Engineering', 'Calculus', 'Sir Ahmed', '1h 45m', 'Easy'),
('Chemistry - Organic Chemistry', 'Important organic chemistry topics', 'https://www.youtube.com/watch?v=bka20Q9TN6M', 'Chemistry', 'Applied Sciences', 'Organic', 'Dr. Sarah', '3h 10m', 'Hard');

-- ============================================
-- SAMPLE MERIT LISTS
-- ============================================
INSERT INTO merit_lists (title, field, year, program, campus, description) VALUES
('NUST Merit List 2025 - SEECS', 'Engineering', '2025', 'BS Computer Science', 'Islamabad (H-12)', 'Final merit list for BS Computer Science program 2025'),
('NUST Merit List 2025 - NBS', 'Business', '2025', 'BBA', 'Islamabad (H-12)', 'Final merit list for BBA program 2025'),
('NUST Merit List 2025 - SINES', 'Natural Sciences', '2025', 'BS Mathematics', 'Islamabad (H-12)', 'Final merit list for BS Mathematics program 2025');

-- ============================================
-- SAMPLE NOTIFICATIONS
-- ============================================
INSERT INTO notifications (title, message, type, target_audience) VALUES
('Welcome to NUSTology Prep!', 'Welcome to NUSTology Prep platform. Start your preparation journey today!', 'announcement', 'all'),
('New Mock Tests Available', 'New Engineering mock tests have been added. Check them out now!', 'new_content', 'Engineering'),
('Payment Verification', 'If your payment is pending, please ensure you submitted the correct transaction ID.', 'payment', 'all');

-- ============================================
-- SAMPLE PDF RESOURCES
-- ============================================
INSERT INTO pdf_resources (title, description, file_url, subject, field, chapter, resource_type) VALUES
('Physics Past Paper 2024', 'NUST NET Physics past paper 2024', 'https://example.com/physics2024.pdf', 'Physics', 'Engineering', 'Full Paper', 'past_paper'),
('Mathematics Formula Sheet', 'Important mathematics formulas for NET', 'https://example.com/mathformulas.pdf', 'Mathematics', 'Engineering', 'All Chapters', 'other'),
('Business Studies Past Paper 2024', 'NUST NET Business Studies past paper 2024', 'https://example.com/business2024.pdf', 'Business Studies', 'Business', 'Full Paper', 'past_paper');

-- ============================================
-- SAMPLE NOTE RESOURCES
-- ============================================
INSERT INTO note_resources (title, description, file_url, subject, field, chapter, note_type) VALUES
('Physics Formula Sheet', 'All important physics formulas for NET preparation', 'https://example.com/physicsformulas.pdf', 'Physics', 'Engineering', 'All Chapters', 'formula_sheet'),
('Chemistry Short Notes', 'Concise chemistry notes for quick revision', 'https://example.com/chemnotes.pdf', 'Chemistry', 'Applied Sciences', 'Organic Chemistry', 'short_notes'),
('Mathematics Cheat Sheet', 'Quick reference for math formulas and rules', 'https://example.com/mathcheat.pdf', 'Mathematics', 'Engineering', 'Calculus', 'cheat_sheet');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_students_username ON students(username);
CREATE INDEX idx_students_approval ON students(approval_status);
CREATE INDEX idx_students_category ON students(degree_category);
CREATE INDEX idx_test_attempts_student ON test_attempts(student_id);
CREATE INDEX idx_test_answers_attempt ON test_answers(attempt_id);
CREATE INDEX idx_group_messages_sent ON group_messages(sent_at);
CREATE INDEX idx_private_messages_users ON private_messages(from_id, to_id);
CREATE INDEX idx_posts_created ON posts(created_at);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_pdf_resources_field ON pdf_resources(field);
CREATE INDEX idx_note_resources_field ON note_resources(field);
CREATE INDEX idx_notifications_audience ON notifications(target_audience);
CREATE INDEX idx_notification_reads_student ON notification_reads(student_id);
CREATE INDEX idx_payment_records_status ON payment_records(verification_status);
