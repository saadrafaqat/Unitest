// ============================================
// NUSTOLOGY PREP - CLOUDFLARE WORKER API
// File: functions/api/[[path]].js
// ============================================

export async function onRequest(context) {
    const { request, env, params } = context;
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/', '').replace('/api', '');
    const method = request.method;

    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const db = env.DB;
        if (!db) {
            return json({ success: false, message: 'Database not connected' }, 500, corsHeaders);
        }

        // ============ ROUTING ============
        
        // ---------- AUTH ----------
        if (path === 'auth/login' && method === 'POST') {
            return await handleStudentLogin(request, db, corsHeaders);
        }
        if (path === 'auth/admin-login' && method === 'POST') {
            return await handleAdminLogin(request, db, corsHeaders);
        }
        if (path === 'auth/logout' && method === 'POST') {
            return await handleLogout(request, db, corsHeaders);
        }
        if (path === 'auth/verify' && method === 'GET') {
            return await verifySession(request, db, corsHeaders);
        }

        // ---------- STUDENT PROFILE ----------
        if (path === 'student/me' && method === 'GET') {
            return await getStudentProfile(request, db, corsHeaders);
        }
        if (path === 'student/profile' && method === 'POST') {
            return await updateStudentProfile(request, db, corsHeaders);
        }
        if (path === 'student/update-account' && method === 'POST') {
            return await updateAccount(request, db, corsHeaders);
        }
        if (path === 'student/change-password' && method === 'POST') {
            return await changeStudentPassword(request, db, corsHeaders);
        }

        // ---------- TESTS ----------
        if (path === 'tests/start' && method === 'POST') {
            return await startTest(request, db, corsHeaders);
        }
        if (path === 'tests/submit' && method === 'POST') {
            return await submitTest(request, db, corsHeaders);
        }
        if (path === 'tests/my-attempts' && method === 'GET') {
            return await getMyAttempts(request, db, corsHeaders);
        }
        if (path.startsWith('tests/review/') && method === 'GET') {
            const attemptId = path.split('/')[2];
            return await getTestReview(request, db, corsHeaders, attemptId);
        }

        // ---------- LEADERBOARD ----------
        if (path === 'leaderboard' && method === 'GET') {
            return await getLeaderboard(request, db, corsHeaders);
        }
        if (path === 'leaderboard/streaks' && method === 'GET') {
            return await getStreaks(request, db, corsHeaders);
        }

        // ---------- LECTURES ----------
        if (path === 'lectures' && method === 'GET') {
            return await getLectures(request, db, corsHeaders);
        }
        if (path === 'lectures' && method === 'POST') {
            return await addLecture(request, db, corsHeaders);
        }
        if (path.startsWith('lectures/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await deleteLecture(request, db, corsHeaders, id);
        }

        // ---------- MERIT LISTS ----------
        if (path === 'merit-lists' && method === 'GET') {
            return await getMeritLists(request, db, corsHeaders);
        }
        if (path === 'merit-lists' && method === 'POST') {
            return await addMeritList(request, db, corsHeaders);
        }
        if (path.startsWith('merit-lists/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await deleteMeritList(request, db, corsHeaders, id);
        }

        // ---------- CHAT ----------
        if (path === 'chat/group/messages' && method === 'GET') {
            return await getGroupMessages(request, db, corsHeaders);
        }
        if (path === 'chat/group/send' && method === 'POST') {
            return await sendGroupMessage(request, db, corsHeaders);
        }
        if (path === 'chat/private/users' && method === 'GET') {
            return await getChatUsers(request, db, corsHeaders);
        }
        if (path.startsWith('chat/private/messages/') && method === 'GET') {
            const otherId = path.split('/')[3];
            return await getPrivateMessages(request, db, corsHeaders, otherId);
        }
        if (path === 'chat/private/send' && method === 'POST') {
            return await sendPrivateMessage(request, db, corsHeaders);
        }
        if (path === 'chat/report' && method === 'POST') {
            return await reportStudent(request, db, corsHeaders);
        }

        // ---------- POSTS ----------
        if (path === 'posts' && method === 'GET') {
            return await getPosts(request, db, corsHeaders);
        }
        if (path === 'posts' && method === 'POST') {
            return await createPost(request, db, corsHeaders);
        }
        if (path.startsWith('posts/') && path.endsWith('/like') && method === 'POST') {
            const postId = path.split('/')[1];
            return await likePost(request, db, corsHeaders, postId);
        }
        if (path.startsWith('posts/') && path.endsWith('/comments') && method === 'GET') {
            const postId = path.split('/')[1];
            return await getComments(request, db, corsHeaders, postId);
        }
        if (path.startsWith('posts/') && path.endsWith('/comments') && method === 'POST') {
            const postId = path.split('/')[1];
            return await addComment(request, db, corsHeaders, postId);
        }

        // ---------- WARNINGS ----------
        if (path === 'warnings/my' && method === 'GET') {
            return await getMyWarnings(request, db, corsHeaders);
        }
        // NEW: Student dismisses a warning
        if (path.startsWith('warnings/') && path.endsWith('/dismiss') && method === 'POST') {
            const warningId = path.split('/')[1];
            return await dismissWarning(request, db, corsHeaders, warningId);
        }

        // ============ ADMIN ROUTES ============
        if (path === 'admin/dashboard' && method === 'GET') {
            return await adminDashboard(request, db, corsHeaders);
        }
        if (path === 'admin/students' && method === 'GET') {
            return await adminGetStudents(request, db, corsHeaders);
        }
        if (path === 'admin/students' && method === 'POST') {
            return await adminAddStudent(request, db, corsHeaders);
        }
        if (path.startsWith('admin/students/') && method === 'GET') {
            const id = path.split('/')[2];
            return await adminGetStudentDetails(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/students/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteStudent(request, db, corsHeaders, id);
        }
        if (path === 'admin/warning' && method === 'POST') {
            return await adminIssueWarning(request, db, corsHeaders);
        }
        if (path === 'admin/reports' && method === 'GET') {
            return await adminGetReports(request, db, corsHeaders);
        }
        if (path.startsWith('admin/reports/') && path.endsWith('/status') && method === 'POST') {
            const reportId = path.split('/')[2];
            return await adminUpdateReportStatus(request, db, corsHeaders, reportId);
        }
        if (path.startsWith('admin/reports/') && method === 'DELETE') {
            const reportId = path.split('/')[2];
            return await adminDeleteReport(request, db, corsHeaders, reportId);
        }
        if (path === 'admin/group-messages' && method === 'GET') {
            return await adminGetGroupMessages(request, db, corsHeaders);
        }
        if (path === 'admin/change-password' && method === 'POST') {
            return await adminChangePassword(request, db, corsHeaders);
        }
        if (path === 'admin/leaderboard' && method === 'GET') {
            return await adminGetLeaderboard(request, db, corsHeaders);
        }

        return json({ success: false, message: 'Endpoint not found: ' + path }, 404, corsHeaders);

    } catch (error) {
        console.error('API Error:', error);
        return json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        }, 500, corsHeaders);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...headers, 'Content-Type': 'application/json' }
    });
}

function generateToken() {
    return crypto.randomUUID() + '-' + Date.now();
}

async function getSession(request, db) {
    const auth = request.headers.get('Authorization');
    if (!auth) return null;
    const token = auth.replace('Bearer ', '');
    const session = await db.prepare('SELECT * FROM sessions WHERE token = ?').bind(token).first();
    return session;
}

async function getStudent(request, db) {
    const session = await getSession(request, db);
    if (!session || session.user_type !== 'student') return null;
    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(session.user_id).first();
    return student;
}

async function getAdmin(request, db) {
    const session = await getSession(request, db);
    if (!session || session.user_type !== 'admin') return null;
    const admin = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(session.user_id).first();
    return admin;
}

// ============================================
// AUTH FUNCTIONS
// ============================================

async function handleStudentLogin(request, db, headers) {
    const { username, password } = await request.json();
    
    if (!username || !password) {
        return json({ success: false, message: 'Username and password required' }, 400, headers);
    }

    const student = await db.prepare(
        'SELECT * FROM students WHERE username = ? AND password = ? AND is_active = 1'
    ).bind(username, password).first();

    if (!student) {
        return json({ success: false, message: 'Invalid credentials or account inactive' }, 401, headers);
    }

    const token = generateToken();
    await db.prepare(
        'INSERT INTO sessions (token, user_id, user_type) VALUES (?, ?, ?)'
    ).bind(token, student.id, 'student').run();

    await db.prepare(
        'UPDATE students SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(student.id).run();

    return json({
        success: true,
        token,
        user: {
            id: student.id,
            username: student.username,
            fullName: student.full_name,
            email: student.email,
            profilePicture: student.profile_picture,
            profileComplete: student.profile_complete === 1,
            field: student.field
        }
    }, 200, headers);
}

async function handleAdminLogin(request, db, headers) {
    const { username, password } = await request.json();

    const admin = await db.prepare(
        'SELECT * FROM admins WHERE username = ? AND password = ?'
    ).bind(username, password).first();

    if (!admin) {
        return json({ success: false, message: 'Invalid admin credentials' }, 401, headers);
    }

    const token = generateToken();
    await db.prepare(
        'INSERT INTO sessions (token, user_id, user_type) VALUES (?, ?, ?)'
    ).bind(token, admin.id, 'admin').run();

    return json({
        success: true,
        token,
        admin: { id: admin.id, username: admin.username }
    }, 200, headers);
}

async function handleLogout(request, db, headers) {
    const auth = request.headers.get('Authorization');
    if (auth) {
        const token = auth.replace('Bearer ', '');
        await db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    }
    return json({ success: true }, 200, headers);
}

async function verifySession(request, db, headers) {
    const session = await getSession(request, db);
    if (!session) return json({ success: false }, 401, headers);
    
    if (session.user_type === 'student') {
        const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(session.user_id).first();
        return json({ 
            success: true, 
            user: {
                id: student.id,
                username: student.username,
                fullName: student.full_name,
                email: student.email,
                profilePicture: student.profile_picture,
                profileComplete: student.profile_complete === 1,
                field: student.field
            }
        }, 200, headers);
    } else {
        const admin = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(session.user_id).first();
        return json({ success: true, admin: { id: admin.id, username: admin.username } }, 200, headers);
    }
}

// ============================================
// STUDENT PROFILE
// ============================================

async function getStudentProfile(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const profile = await db.prepare(
        'SELECT * FROM student_profiles WHERE student_id = ?'
    ).bind(student.id).first();

    // Get unread warnings less than 2 days old
    const warnings = await db.prepare(
        `SELECT * FROM warnings 
         WHERE student_id = ? AND is_read = 0 
         AND datetime(issued_at) > datetime('now', '-2 days')
         ORDER BY issued_at DESC`
    ).bind(student.id).all();

    return json({ 
        success: true, 
        student: {
            id: student.id,
            username: student.username,
            fullName: student.full_name,
            email: student.email,
            profilePicture: student.profile_picture,
            profileComplete: student.profile_complete === 1,
            field: student.field
        },
        profile: profile || null,
        warnings: warnings.results || []
    }, 200, headers);
}

async function updateStudentProfile(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const data = await request.json();

    const existing = await db.prepare(
        'SELECT id FROM student_profiles WHERE student_id = ?'
    ).bind(student.id).first();

    if (existing) {
        await db.prepare(`
            UPDATE student_profiles SET 
            phone=?, district=?, city=?, province=?, address=?, 
            date_of_birth=?, gender=?, father_name=?, father_occupation=?,
            matric_marks=?, matric_total=?, matric_board=?, matric_year=?,
            fsc_marks=?, fsc_total=?, fsc_board=?, fsc_year=?, fsc_part=?,
            last_net_score=?, last_net_attempt=?, planning_net=?, 
            target_university=?, target_field=?, target_score=?, preferred_campus=?,
            additional_notes=?, updated_at=CURRENT_TIMESTAMP
            WHERE student_id = ?
        `).bind(
            data.phone || '', data.district || '', data.city || '', data.province || '', data.address || '',
            data.dateOfBirth || '', data.gender || '', data.fatherName || '', data.fatherOccupation || '',
            data.matricMarks || 0, data.matricTotal || 1100, data.matricBoard || '', data.matricYear || '',
            data.fscMarks || 0, data.fscTotal || 1100, data.fscBoard || '', data.fscYear || '', data.fscPart || '',
            data.lastNetScore || 0, data.lastNetAttempt || '', data.planningNet || '',
            data.targetUniversity || 'NUST', data.targetField || '', data.targetScore || 0, data.preferredCampus || '',
            data.additionalNotes || '',
            student.id
        ).run();
    } else {
        await db.prepare(`
            INSERT INTO student_profiles (
                student_id, phone, district, city, province, address,
                date_of_birth, gender, father_name, father_occupation,
                matric_marks, matric_total, matric_board, matric_year,
                fsc_marks, fsc_total, fsc_board, fsc_year, fsc_part,
                last_net_score, last_net_attempt, planning_net,
                target_university, target_field, target_score, preferred_campus,
                additional_notes
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `).bind(
            student.id,
            data.phone || '', data.district || '', data.city || '', data.province || '', data.address || '',
            data.dateOfBirth || '', data.gender || '', data.fatherName || '', data.fatherOccupation || '',
            data.matricMarks || 0, data.matricTotal || 1100, data.matricBoard || '', data.matricYear || '',
            data.fscMarks || 0, data.fscTotal || 1100, data.fscBoard || '', data.fscYear || '', data.fscPart || '',
            data.lastNetScore || 0, data.lastNetAttempt || '', data.planningNet || '',
            data.targetUniversity || 'NUST', data.targetField || '', data.targetScore || 0, data.preferredCampus || '',
            data.additionalNotes || ''
        ).run();
    }

    await db.prepare(
        'UPDATE students SET profile_complete = 1, field = ? WHERE id = ?'
    ).bind(data.targetField || student.field, student.id).run();

    return json({ success: true, message: 'Profile updated successfully' }, 200, headers);
}

async function updateAccount(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { fullName, email, profilePicture } = await request.json();
    
    await db.prepare(
        'UPDATE students SET full_name = ?, email = ?, profile_picture = ? WHERE id = ?'
    ).bind(fullName || student.full_name, email || student.email, profilePicture || student.profile_picture, student.id).run();

    return json({ success: true, message: 'Account updated' }, 200, headers);
}

async function changeStudentPassword(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { currentPassword, newPassword } = await request.json();

    if (student.password !== currentPassword) {
        return json({ success: false, message: 'Current password is incorrect' }, 400, headers);
    }

    await db.prepare('UPDATE students SET password = ? WHERE id = ?').bind(newPassword, student.id).run();
    return json({ success: true, message: 'Password changed successfully' }, 200, headers);
}

// ============================================
// TESTS
// ============================================

async function startTest(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { testType, field, subject, totalQuestions, totalMarks } = await request.json();

    const result = await db.prepare(`
        INSERT INTO test_attempts (student_id, test_type, field, subject, total_questions, total_marks, status)
        VALUES (?, ?, ?, ?, ?, ?, 'in_progress')
    `).bind(student.id, testType, field, subject || null, totalQuestions, totalMarks).run();

    return json({ 
        success: true, 
        attemptId: result.meta.last_row_id 
    }, 200, headers);
}

async function submitTest(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { attemptId, answers, timeTaken } = await request.json();

    let correct = 0, wrong = 0, unattempted = 0;
    let currentStreak = 0, maxStreak = 0;

    for (const ans of answers) {
        const isCorrect = ans.selectedAnswer !== null && ans.selectedAnswer === ans.correctAnswer;
        
        if (ans.selectedAnswer === null || ans.selectedAnswer === undefined) {
            unattempted++;
            currentStreak = 0;
        } else if (isCorrect) {
            correct++;
            currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
            wrong++;
            currentStreak = 0;
        }

        await db.prepare(`
            INSERT INTO test_answers (attempt_id, question_id, question_text, question_subject, options, correct_answer, selected_answer, is_correct, marked_for_review)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            attemptId,
            String(ans.questionId),
            ans.questionText || '',
            ans.subject || '',
            JSON.stringify(ans.options || []),
            ans.correctAnswer,
            ans.selectedAnswer ?? null,
            isCorrect ? 1 : 0,
            ans.markedForReview ? 1 : 0
        ).run();
    }

    const score = correct;
    const attempt = await db.prepare('SELECT * FROM test_attempts WHERE id = ?').bind(attemptId).first();
    const percentage = (score / attempt.total_marks) * 100;

    await db.prepare(`
        UPDATE test_attempts SET 
        correct_answers = ?, wrong_answers = ?, unattempted = ?,
        score = ?, percentage = ?, time_taken = ?, max_streak = ?,
        completed_at = CURRENT_TIMESTAMP, status = 'completed'
        WHERE id = ?
    `).bind(correct, wrong, unattempted, score, percentage, timeTaken || 0, maxStreak, attemptId).run();

    return json({ 
        success: true,
        result: {
            attemptId,
            correct, wrong, unattempted,
            score, percentage,
            totalQuestions: answers.length,
            maxStreak
        }
    }, 200, headers);
}

async function getMyAttempts(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const attempts = await db.prepare(
        'SELECT * FROM test_attempts WHERE student_id = ? AND status = "completed" ORDER BY completed_at DESC'
    ).bind(student.id).all();

    return json({ success: true, attempts: attempts.results || [] }, 200, headers);
}

async function getTestReview(request, db, headers, attemptId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const attempt = await db.prepare(
        'SELECT * FROM test_attempts WHERE id = ? AND student_id = ?'
    ).bind(attemptId, student.id).first();

    if (!attempt) return json({ success: false, message: 'Test not found' }, 404, headers);

    const answers = await db.prepare(
        'SELECT * FROM test_answers WHERE attempt_id = ? ORDER BY id ASC'
    ).bind(attemptId).all();

    const parsedAnswers = (answers.results || []).map(a => ({
        ...a,
        options: JSON.parse(a.options || '[]')
    }));

    return json({ success: true, attempt, answers: parsedAnswers }, 200, headers);
}

// ============================================
// LEADERBOARD
// ============================================

async function getLeaderboard(request, db, headers) {
    const url = new URL(request.url);
    const field = url.searchParams.get('field') || 'all';

    let query = `
        SELECT 
            s.id, s.username, s.full_name, s.profile_picture, s.field,
            MAX(t.score) as best_score,
            MAX(t.percentage) as best_percentage,
            COUNT(t.id) as total_tests,
            AVG(t.percentage) as avg_percentage
        FROM students s
        LEFT JOIN test_attempts t ON s.id = t.student_id AND t.status = 'completed'
        WHERE s.is_active = 1
    `;
    
    const binds = [];
    if (field !== 'all') {
        query += ' AND t.field = ?';
        binds.push(field);
    }
    
    query += ' GROUP BY s.id HAVING total_tests > 0 ORDER BY best_score DESC LIMIT 50';

    const result = binds.length 
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, leaderboard: result.results || [] }, 200, headers);
}

async function getStreaks(request, db, headers) {
    const result = await db.prepare(`
        SELECT 
            s.id, s.username, s.full_name, s.profile_picture, s.field,
            MAX(t.max_streak) as best_streak
        FROM students s
        LEFT JOIN test_attempts t ON s.id = t.student_id AND t.status = 'completed'
        WHERE s.is_active = 1
        GROUP BY s.id
        HAVING best_streak > 0
        ORDER BY best_streak DESC
        LIMIT 50
    `).all();

    return json({ success: true, streaks: result.results || [] }, 200, headers);
}

// ============================================
// LECTURES
// ============================================

async function getLectures(request, db, headers) {
    const url = new URL(request.url);
    const field = url.searchParams.get('field');
    const subject = url.searchParams.get('subject');

    let query = 'SELECT * FROM lectures WHERE 1=1';
    const binds = [];
    
    if (field && field !== 'all') {
        query += ' AND field = ?';
        binds.push(field);
    }
    if (subject && subject !== 'all') {
        query += ' AND subject = ?';
        binds.push(subject);
    }
    query += ' ORDER BY added_at DESC';

    const result = binds.length 
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, lectures: result.results || [] }, 200, headers);
}

async function addLecture(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const data = await request.json();
    
    let thumbnail = data.thumbnail || '';
    const videoIdMatch = (data.youtubeUrl || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
    if (videoIdMatch && !thumbnail) {
        thumbnail = `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
    }

    await db.prepare(`
        INSERT INTO lectures (title, description, youtube_url, thumbnail, subject, field, topic, instructor, duration, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        data.title, data.description || '', data.youtubeUrl, thumbnail,
        data.subject, data.field, data.topic || '', data.instructor || '',
        data.duration || '', data.difficulty || 'Medium'
    ).run();

    return json({ success: true, message: 'Lecture added' }, 200, headers);
}

async function deleteLecture(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    
    await db.prepare('DELETE FROM lectures WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// MERIT LISTS
// ============================================

async function getMeritLists(request, db, headers) {
    const result = await db.prepare('SELECT * FROM merit_lists ORDER BY uploaded_at DESC').all();
    return json({ success: true, merit_lists: result.results || [] }, 200, headers);
}

async function addMeritList(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const data = await request.json();
    await db.prepare(`
        INSERT INTO merit_lists (title, field, year, program, campus, file_url, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
        data.title, data.field, data.year, data.program || '',
        data.campus || '', data.fileUrl || '', data.description || ''
    ).run();

    return json({ success: true }, 200, headers);
}

async function deleteMeritList(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    
    await db.prepare('DELETE FROM merit_lists WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// CHAT
// ============================================

async function getGroupMessages(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const result = await db.prepare(`
        SELECT m.*, s.username, s.full_name, s.profile_picture 
        FROM group_messages m 
        JOIN students s ON m.student_id = s.id 
        ORDER BY m.sent_at DESC LIMIT 100
    `).all();

    return json({ success: true, messages: (result.results || []).reverse() }, 200, headers);
}

async function sendGroupMessage(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { message } = await request.json();
    if (!message || !message.trim()) return json({ success: false }, 400, headers);

    await db.prepare(
        'INSERT INTO group_messages (student_id, message) VALUES (?, ?)'
    ).bind(student.id, message.trim()).run();

    return json({ success: true }, 200, headers);
}

async function getChatUsers(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const result = await db.prepare(
        'SELECT id, username, full_name, profile_picture, field FROM students WHERE id != ? AND is_active = 1'
    ).bind(student.id).all();

    return json({ success: true, users: result.results || [] }, 200, headers);
}

async function getPrivateMessages(request, db, headers, otherId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const result = await db.prepare(`
        SELECT * FROM private_messages 
        WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)
        ORDER BY sent_at ASC
    `).bind(student.id, otherId, otherId, student.id).all();

    await db.prepare(
        'UPDATE private_messages SET is_read = 1 WHERE from_id = ? AND to_id = ?'
    ).bind(otherId, student.id).run();

    return json({ success: true, messages: result.results || [] }, 200, headers);
}

async function sendPrivateMessage(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { toId, message } = await request.json();
    if (!message || !message.trim()) return json({ success: false }, 400, headers);

    await db.prepare(
        'INSERT INTO private_messages (from_id, to_id, message) VALUES (?, ?, ?)'
    ).bind(student.id, toId, message.trim()).run();

    return json({ success: true }, 200, headers);
}

async function reportStudent(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { reportedId, reason, chatContext } = await request.json();

    await db.prepare(
        'INSERT INTO reports (reporter_id, reported_id, reason, chat_context) VALUES (?, ?, ?, ?)'
    ).bind(student.id, reportedId, reason, chatContext || '').run();

    return json({ success: true, message: 'Report submitted' }, 200, headers);
}

// ============================================
// POSTS / COMMUNITY
// ============================================

async function getPosts(request, db, headers) {
    const result = await db.prepare(`
        SELECT p.*, s.username, s.full_name, s.profile_picture 
        FROM posts p 
        JOIN students s ON p.student_id = s.id 
        ORDER BY p.created_at DESC
    `).all();

    return json({ success: true, posts: result.results || [] }, 200, headers);
}

async function createPost(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { title, content, category } = await request.json();
    if (!content || !content.trim()) return json({ success: false }, 400, headers);

    await db.prepare(
        'INSERT INTO posts (student_id, title, content, category) VALUES (?, ?, ?, ?)'
    ).bind(student.id, title || '', content.trim(), category || 'general').run();

    return json({ success: true }, 200, headers);
}

async function likePost(request, db, headers, postId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const existing = await db.prepare(
        'SELECT id FROM post_likes WHERE post_id = ? AND student_id = ?'
    ).bind(postId, student.id).first();

    if (existing) {
        await db.prepare('DELETE FROM post_likes WHERE id = ?').bind(existing.id).run();
        await db.prepare('UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').bind(postId).run();
        return json({ success: true, liked: false }, 200, headers);
    } else {
        await db.prepare('INSERT INTO post_likes (post_id, student_id) VALUES (?, ?)').bind(postId, student.id).run();
        await db.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?').bind(postId).run();
        return json({ success: true, liked: true }, 200, headers);
    }
}

async function getComments(request, db, headers, postId) {
    const result = await db.prepare(`
        SELECT c.*, s.username, s.full_name, s.profile_picture 
        FROM post_comments c 
        JOIN students s ON c.student_id = s.id 
        WHERE c.post_id = ? 
        ORDER BY c.created_at ASC
    `).bind(postId).all();

    return json({ success: true, comments: result.results || [] }, 200, headers);
}

async function addComment(request, db, headers, postId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { comment } = await request.json();
    if (!comment || !comment.trim()) return json({ success: false }, 400, headers);

    await db.prepare(
        'INSERT INTO post_comments (post_id, student_id, comment) VALUES (?, ?, ?)'
    ).bind(postId, student.id, comment.trim()).run();
    
    await db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').bind(postId).run();

    return json({ success: true }, 200, headers);
}

// ============================================
// WARNINGS
// ============================================

async function getMyWarnings(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    // Only fetch unread warnings less than 2 days old
    const result = await db.prepare(
        `SELECT * FROM warnings 
         WHERE student_id = ? 
         AND is_read = 0 
         AND datetime(issued_at) > datetime('now', '-2 days')
         ORDER BY issued_at DESC`
    ).bind(student.id).all();

    return json({ success: true, warnings: result.results || [] }, 200, headers);
}

// NEW: Student dismisses a warning
async function dismissWarning(request, db, headers, warningId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    // Mark warning as read (only for this student's warnings)
    await db.prepare(
        'UPDATE warnings SET is_read = 1 WHERE id = ? AND student_id = ?'
    ).bind(warningId, student.id).run();

    // If no more unread warnings, clear the is_warned flag
    const remaining = await db.prepare(
        `SELECT COUNT(*) as count FROM warnings 
         WHERE student_id = ? AND is_read = 0
         AND datetime(issued_at) > datetime('now', '-2 days')`
    ).bind(student.id).first();

    if (remaining.count === 0) {
        await db.prepare(
            'UPDATE students SET is_warned = 0 WHERE id = ?'
        ).bind(student.id).run();
    }

    return json({ success: true, message: 'Warning dismissed' }, 200, headers);
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

async function adminDashboard(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const totalStudents = await db.prepare('SELECT COUNT(*) as count FROM students').first();
    const activeStudents = await db.prepare('SELECT COUNT(*) as count FROM students WHERE is_active = 1').first();
    const totalTests = await db.prepare('SELECT COUNT(*) as count FROM test_attempts WHERE status = "completed"').first();
    const pendingReports = await db.prepare('SELECT COUNT(*) as count FROM reports WHERE status = "pending"').first();
    const totalLectures = await db.prepare('SELECT COUNT(*) as count FROM lectures').first();

    return json({
        success: true,
        stats: {
            totalStudents: totalStudents.count,
            activeStudents: activeStudents.count,
            totalTests: totalTests.count,
            pendingReports: pendingReports.count,
            totalLectures: totalLectures.count
        }
    }, 200, headers);
}

async function adminGetStudents(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const result = await db.prepare(`
        SELECT s.*, 
            (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as test_count,
            (SELECT AVG(percentage) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_score
        FROM students s ORDER BY s.created_at DESC
    `).all();

    return json({ success: true, students: result.results || [] }, 200, headers);
}

async function adminAddStudent(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const { username, password, fullName, email, field } = await request.json();

    const existing = await db.prepare('SELECT id FROM students WHERE username = ?').bind(username).first();
    if (existing) return json({ success: false, message: 'Username already exists' }, 400, headers);

    await db.prepare(
        'INSERT INTO students (username, password, full_name, email, field) VALUES (?, ?, ?, ?, ?)'
    ).bind(username, password, fullName || '', email || '', field || 'NET-Engineering').run();

    return json({ success: true, message: 'Student added' }, 200, headers);
}

async function adminGetStudentDetails(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    const profile = await db.prepare('SELECT * FROM student_profiles WHERE student_id = ?').bind(id).first();
    const attempts = await db.prepare('SELECT * FROM test_attempts WHERE student_id = ? ORDER BY completed_at DESC').bind(id).all();
    
    const completedAttempts = (attempts.results || []).filter(a => a.status === 'completed');
    let performanceScore = 0;
    if (completedAttempts.length > 0) {
        const avgPerc = completedAttempts.reduce((sum, a) => sum + a.percentage, 0) / completedAttempts.length;
        const consistency = Math.min(100, (completedAttempts.length / 10) * 100);
        performanceScore = Math.round((avgPerc * 0.7) + (consistency * 0.3));
    }

    return json({
        success: true,
        student,
        profile,
        attempts: attempts.results || [],
        performanceScore
    }, 200, headers);
}

async function adminDeleteStudent(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    await db.prepare('DELETE FROM students WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

async function adminIssueWarning(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const { studentId, message, reportId } = await request.json();
    
    await db.prepare(
        'INSERT INTO warnings (student_id, message) VALUES (?, ?)'
    ).bind(studentId, message).run();
    
    await db.prepare(
        'UPDATE students SET is_warned = 1, warning_message = ? WHERE id = ?'
    ).bind(message, studentId).run();

    // If warning was issued from a report, mark that report as resolved
    if (reportId) {
        await db.prepare(
            'UPDATE reports SET status = ?, admin_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind('resolved', 'Warning issued to student', reportId).run();
    }

    return json({ success: true }, 200, headers);
}

async function adminGetReports(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const result = await db.prepare(`
        SELECT r.*, 
            s1.username as reporter_username, s1.full_name as reporter_name,
            s2.username as reported_username, s2.full_name as reported_name
        FROM reports r
        JOIN students s1 ON r.reporter_id = s1.id
        JOIN students s2 ON r.reported_id = s2.id
        ORDER BY 
            CASE r.status 
                WHEN 'pending' THEN 1 
                WHEN 'reviewed' THEN 2 
                WHEN 'resolved' THEN 3 
                WHEN 'dismissed' THEN 4 
                ELSE 5 
            END,
            r.created_at DESC
    `).all();

    return json({ success: true, reports: result.results || [] }, 200, headers);
}

async function adminUpdateReportStatus(request, db, headers, reportId) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const { status, adminNote } = await request.json();
    const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    const newStatus = validStatuses.includes(status) ? status : 'reviewed';

    await db.prepare(
        'UPDATE reports SET status = ?, admin_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(newStatus, adminNote || '', reportId).run();

    return json({ success: true, message: 'Report status updated' }, 200, headers);
}

async function adminDeleteReport(request, db, headers, reportId) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    await db.prepare('DELETE FROM reports WHERE id = ?').bind(reportId).run();
    return json({ success: true }, 200, headers);
}

async function adminGetGroupMessages(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const result = await db.prepare(`
        SELECT m.*, s.username, s.full_name 
        FROM group_messages m 
        JOIN students s ON m.student_id = s.id 
        ORDER BY m.sent_at DESC LIMIT 200
    `).all();

    return json({ success: true, messages: result.results || [] }, 200, headers);
}

async function adminChangePassword(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const { currentPassword, newPassword, newUsername } = await request.json();

    if (admin.password !== currentPassword) {
        return json({ success: false, message: 'Current password incorrect' }, 400, headers);
    }

    await db.prepare(
        'UPDATE admins SET password = ?, username = ? WHERE id = ?'
    ).bind(newPassword, newUsername || admin.username, admin.id).run();

    return json({ success: true, message: 'Credentials updated' }, 200, headers);
}

async function adminGetLeaderboard(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const fields = ['NET-Engineering', 'NET-Applied Sciences', 'NET-Business Studies', 'NET-Architecture', 'NET-Natural Sciences'];
    const leaderboards = {};

    for (const field of fields) {
        const result = await db.prepare(`
            SELECT s.username, s.full_name, s.field,
                MAX(t.score) as best_score,
                MAX(t.percentage) as best_percentage,
                COUNT(t.id) as total_tests
            FROM students s
            JOIN test_attempts t ON s.id = t.student_id
            WHERE t.status = 'completed' AND t.field = ?
            GROUP BY s.id
            ORDER BY best_score DESC
            LIMIT 20
        `).bind(field).all();
        leaderboards[field] = result.results || [];
    }

    return json({ success: true, leaderboards }, 200, headers);
}
