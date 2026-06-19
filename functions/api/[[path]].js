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
        // NEW: Student self-registration
        if (path === 'auth/register' && method === 'POST') {
            return await handleStudentRegister(request, db, env, corsHeaders);
        }
        // NEW: Check username availability
        if (path === 'auth/check-username' && method === 'POST') {
            return await checkUsernameAvailability(request, db, corsHeaders);
        }
        // NEW: Get bank/payment details for registration page
        if (path === 'auth/payment-info' && method === 'GET') {
            return await getPaymentInfo(request, db, corsHeaders);
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
        // NEW: Upload profile picture via R2
        if (path === 'student/upload-profile-pic' && method === 'POST') {
            return await uploadProfilePicture(request, db, env, corsHeaders);
        }
        // NEW: Get student notifications
        if (path === 'student/notifications' && method === 'GET') {
            return await getStudentNotifications(request, db, corsHeaders);
        }
        // NEW: Mark notification as read
        if (path === 'student/notifications/read' && method === 'POST') {
            return await markNotificationRead(request, db, corsHeaders);
        }
        // NEW: Mark all notifications as read
        if (path === 'student/notifications/read-all' && method === 'POST') {
            return await markAllNotificationsRead(request, db, corsHeaders);
        }
        // NEW: Get unread notification count
        if (path === 'student/notifications/unread-count' && method === 'GET') {
            return await getUnreadNotificationCount(request, db, corsHeaders);
        }
        // NEW: Get student payment status
        if (path === 'student/payment-status' && method === 'GET') {
            return await getStudentPaymentStatus(request, db, corsHeaders);
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
        // NEW: Category-based access check
        if (path === 'tests/check-access' && method === 'POST') {
            return await checkTestAccess(request, db, corsHeaders);
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

        // ---------- PDF RESOURCES ----------
        if (path === 'pdfs' && method === 'GET') {
            return await getPdfs(request, db, corsHeaders);
        }
        if (path === 'pdfs' && method === 'POST') {
            return await addPdf(request, db, env, corsHeaders);
        }
        if (path.startsWith('pdfs/') && path.endsWith('/download') && method === 'POST') {
            const id = path.split('/')[1];
            return await incrementPdfDownload(request, db, corsHeaders, id);
        }
        if (path.startsWith('pdfs/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await deletePdf(request, db, env, corsHeaders, id);
        }

        // ---------- NOTE RESOURCES ----------
        if (path === 'notes' && method === 'GET') {
            return await getNotes(request, db, corsHeaders);
        }
        if (path === 'notes' && method === 'POST') {
            return await addNote(request, db, env, corsHeaders);
        }
        if (path.startsWith('notes/') && path.endsWith('/download') && method === 'POST') {
            const id = path.split('/')[1];
            return await incrementNoteDownload(request, db, corsHeaders, id);
        }
        if (path.startsWith('notes/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await deleteNote(request, db, env, corsHeaders, id);
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
        if (path.startsWith('warnings/') && path.endsWith('/dismiss') && method === 'POST') {
            const warningId = path.split('/')[1];
            return await dismissWarning(request, db, corsHeaders, warningId);
        }

        // ============ ADMIN ROUTES ============

        // ---------- ADMIN DASHBOARD ----------
        if (path === 'admin/dashboard' && method === 'GET') {
            return await adminDashboard(request, db, corsHeaders);
        }

        // ---------- ADMIN STUDENTS ----------
        if (path === 'admin/students' && method === 'GET') {
            return await adminGetStudents(request, db, corsHeaders);
        }
        if (path === 'admin/students' && method === 'POST') {
            return await adminAddStudent(request, db, corsHeaders);
        }
        if (path.startsWith('admin/students/') && path.endsWith('/toggle-active') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminToggleStudentActive(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/students/') && path.endsWith('/reset-password') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminResetStudentPassword(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/students/') && method === 'GET') {
            const id = path.split('/')[2];
            return await adminGetStudentDetails(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/students/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteStudent(request, db, corsHeaders, id);
        }
        // NEW: Export students as CSV
        if (path === 'admin/students/export' && method === 'GET') {
            return await adminExportStudents(request, db, corsHeaders);
        }

        // ---------- ADMIN REGISTRATIONS (NEW) ----------
        if (path === 'admin/registrations' && method === 'GET') {
            return await adminGetRegistrations(request, db, corsHeaders);
        }
        if (path.startsWith('admin/registrations/') && path.endsWith('/approve') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminApproveRegistration(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/registrations/') && path.endsWith('/reject') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminRejectRegistration(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/registrations/') && method === 'GET') {
            const id = path.split('/')[2];
            return await adminGetRegistrationDetails(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/registrations/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteRegistration(request, db, corsHeaders, id);
        }

        // ---------- ADMIN NOTIFICATIONS (NEW) ----------
        if (path === 'admin/notifications' && method === 'GET') {
            return await adminGetNotifications(request, db, corsHeaders);
        }
        if (path === 'admin/notifications' && method === 'POST') {
            return await adminCreateNotification(request, db, corsHeaders);
        }
        if (path.startsWith('admin/notifications/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteNotification(request, db, corsHeaders, id);
        }

        // ---------- ADMIN PDF RESOURCES (NEW) ----------
        if (path === 'admin/pdfs' && method === 'GET') {
            return await adminGetPdfs(request, db, corsHeaders);
        }
        if (path === 'admin/pdfs' && method === 'POST') {
            return await adminUploadPdf(request, db, env, corsHeaders);
        }
        if (path.startsWith('admin/pdfs/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeletePdf(request, db, env, corsHeaders, id);
        }

        // ---------- ADMIN NOTE RESOURCES (NEW) ----------
        if (path === 'admin/notes' && method === 'GET') {
            return await adminGetNotes(request, db, corsHeaders);
        }
        if (path === 'admin/notes' && method === 'POST') {
            return await adminUploadNote(request, db, env, corsHeaders);
        }
        if (path.startsWith('admin/notes/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteNote(request, db, env, corsHeaders, id);
        }

        // ---------- ADMIN SETTINGS (NEW) ----------
        if (path === 'admin/settings' && method === 'GET') {
            return await adminGetSettings(request, db, corsHeaders);
        }
        if (path === 'admin/settings' && method === 'POST') {
            return await adminUpdateSettings(request, db, corsHeaders);
        }

        // ---------- ADMIN PAYMENT RECORDS (NEW) ----------
        if (path === 'admin/payments' && method === 'GET') {
            return await adminGetPayments(request, db, corsHeaders);
        }

        // ---------- ADMIN ANALYTICS (NEW) ----------
        if (path === 'admin/analytics' && method === 'GET') {
            return await adminGetAnalytics(request, db, corsHeaders);
        }

        // ---------- ADMIN EXISTING ----------
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

        // ---------- FILE UPLOAD (R2) ----------
        if (path === 'upload' && method === 'POST') {
            return await handleFileUpload(request, db, env, corsHeaders);
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
// CATEGORY ACCESS CONTROL HELPER
// ============================================

// Maps degree category to allowed test fields
function getAllowedFields(degreeCategory) {
    const mapping = {
        'Engineering': ['Engineering', 'NET-Engineering'],
        'CS': ['Engineering', 'NET-Engineering'],
        'Computing': ['Engineering', 'NET-Engineering'],
        'Applied Sciences': ['Applied Sciences', 'NET-Applied Sciences'],
        'Business': ['Business', 'NET-Business Studies'],
        'Architecture': ['Architecture', 'NET-Architecture'],
        'Natural Sciences': ['Natural Sciences', 'NET-Natural Sciences']
    };
    return mapping[degreeCategory] || ['Engineering', 'NET-Engineering'];
}

function canAccessField(degreeCategory, requestedField) {
    const allowed = getAllowedFields(degreeCategory);
    return allowed.some(f =>
        f.toLowerCase() === requestedField.toLowerCase() ||
        requestedField.toLowerCase().includes(f.toLowerCase()) ||
        f.toLowerCase().includes(requestedField.toLowerCase())
    );
}

// ============================================
// R2 FILE UPLOAD HELPER
// ============================================

async function uploadToR2(env, file, folder, fileName) {
    if (!env.R2_BUCKET) {
        throw new Error('R2 bucket not configured');
    }

    const key = `${folder}/${Date.now()}-${fileName}`;
    const arrayBuffer = await file.arrayBuffer();

    await env.R2_BUCKET.put(key, arrayBuffer, {
        httpMetadata: {
            contentType: file.type || 'application/octet-stream'
        }
    });

    // Return public URL (configure R2 public domain in wrangler.toml)
    const r2PublicUrl = env.R2_PUBLIC_URL || '';
    return `${r2PublicUrl}/${key}`;
}

async function deleteFromR2(env, fileUrl) {
    if (!env.R2_BUCKET || !fileUrl) return;
    try {
        const r2PublicUrl = env.R2_PUBLIC_URL || '';
        const key = fileUrl.replace(`${r2PublicUrl}/`, '');
        await env.R2_BUCKET.delete(key);
    } catch (e) {
        console.error('R2 delete error:', e);
    }
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

    // Check if student is approved
    if (!student.is_approved || student.approval_status !== 'approved') {
        return json({
            success: false,
            message: 'Your account is pending approval. Please wait for admin verification.',
            status: student.approval_status || 'pending'
        }, 403, headers);
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
            field: student.field,
            degreeCategory: student.degree_category,
            isApproved: student.is_approved === 1,
            approvalStatus: student.approval_status
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
        if (!student) return json({ success: false }, 401, headers);
        return json({
            success: true,
            user: {
                id: student.id,
                username: student.username,
                fullName: student.full_name,
                email: student.email,
                profilePicture: student.profile_picture,
                profileComplete: student.profile_complete === 1,
                field: student.field,
                degreeCategory: student.degree_category,
                isApproved: student.is_approved === 1,
                approvalStatus: student.approval_status
            }
        }, 200, headers);
    } else {
        const admin = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(session.user_id).first();
        if (!admin) return json({ success: false }, 401, headers);
        return json({ success: true, admin: { id: admin.id, username: admin.username } }, 200, headers);
    }
}

// NEW: Student self-registration
async function handleStudentRegister(request, db, env, headers) {
    let data;
    try {
        data = await request.json();
    } catch (e) {
        return json({ success: false, message: 'Invalid request data' }, 400, headers);
    }

    // Validate required fields
    const required = ['fullName', 'email', 'phone', 'degreeCategory', 'desiredUsername', 'desiredPassword'];
    for (const field of required) {
        if (!data[field] || !String(data[field]).trim()) {
            return json({ success: false, message: `${field} is required` }, 400, headers);
        }
    }

    // Check if username already exists in students OR registrations
    const existingStudent = await db.prepare(
        'SELECT id FROM students WHERE username = ?'
    ).bind(data.desiredUsername.trim()).first();
    if (existingStudent) {
        return json({ success: false, message: 'Username already taken. Please choose another.' }, 400, headers);
    }

    const existingReg = await db.prepare(
        'SELECT id, status FROM registrations WHERE desired_username = ?'
    ).bind(data.desiredUsername.trim()).first();
    if (existingReg && existingReg.status !== 'rejected') {
        return json({ success: false, message: 'Username already taken. Please choose another.' }, 400, headers);
    }

    // Check email uniqueness
    const existingEmail = await db.prepare(
        'SELECT id FROM students WHERE email = ?'
    ).bind(data.email.trim()).first();
    if (existingEmail) {
        return json({ success: false, message: 'Email already registered.' }, 400, headers);
    }

    // Insert registration
    const result = await db.prepare(`
        INSERT INTO registrations (
            full_name, email, phone, date_of_birth, gender,
            father_name, cnic, city, province, address,
            matric_marks, matric_total, matric_board, matric_year,
            fsc_marks, fsc_total, fsc_board, fsc_year, fsc_part,
            degree_category,
            preference_1, preference_2, preference_3, preference_4, preference_5,
            desired_username, desired_password,
            transaction_id, payment_screenshot_url, payment_method, payment_amount,
            payment_submitted_at, status
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
        data.fullName.trim(),
        data.email.trim(),
        data.phone.trim(),
        data.dateOfBirth || '',
        data.gender || '',
        data.fatherName || '',
        data.cnic || '',
        data.city || '',
        data.province || '',
        data.address || '',
        data.matricMarks || null,
        data.matricTotal || 1100,
        data.matricBoard || '',
        data.matricYear || '',
        data.fscMarks || null,
        data.fscTotal || 1100,
        data.fscBoard || '',
        data.fscYear || '',
        data.fscPart || '',
        data.degreeCategory,
        data.preference1 || '',
        data.preference2 || '',
        data.preference3 || '',
        data.preference4 || '',
        data.preference5 || '',
        data.desiredUsername.trim(),
        data.desiredPassword,
        data.transactionId || '',
        data.paymentScreenshotUrl || '',
        data.paymentMethod || '',
        data.paymentAmount || '500',
        data.transactionId ? new Date().toISOString() : null,
        'pending'
    ).run();

    const registrationId = result.meta.last_row_id;

    // Also create a payment record if payment info submitted
    if (data.transactionId) {
        await db.prepare(`
            INSERT INTO payment_records (
                registration_id, transaction_id, payment_method,
                payment_amount, payment_screenshot_url, payment_date,
                verification_status
            ) VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `).bind(
            registrationId,
            data.transactionId,
            data.paymentMethod || '',
            data.paymentAmount || '500',
            data.paymentScreenshotUrl || '',
            new Date().toISOString().split('T')[0]
        ).run();
    }

    return json({
        success: true,
        message: 'Registration submitted successfully! Please wait for admin approval. You will be notified via email.',
        registrationId
    }, 200, headers);
}

// NEW: Check username availability
async function checkUsernameAvailability(request, db, headers) {
    const { username } = await request.json();
    if (!username) return json({ success: false, available: false }, 400, headers);

    const existingStudent = await db.prepare(
        'SELECT id FROM students WHERE username = ?'
    ).bind(username.trim()).first();

    const existingReg = await db.prepare(
        'SELECT id, status FROM registrations WHERE desired_username = ?'
    ).bind(username.trim()).first();

    const taken = !!existingStudent || (existingReg && existingReg.status !== 'rejected');
    return json({ success: true, available: !taken }, 200, headers);
}

// NEW: Get payment/bank info for registration page
async function getPaymentInfo(request, db, headers) {
    const settings = await db.prepare('SELECT key, value FROM settings').all();
    const settingsMap = {};
    for (const s of settings.results || []) {
        settingsMap[s.key] = s.value;
    }

    return json({
        success: true,
        paymentInfo: {
            bankName: settingsMap['bank_name'] || '',
            bankAccountTitle: settingsMap['bank_account_title'] || '',
            bankAccountNumber: settingsMap['bank_account_number'] || '',
            bankIban: settingsMap['bank_iban'] || '',
            easypaisaNumber: settingsMap['easypaisa_number'] || '',
            jazzcashNumber: settingsMap['jazzcash_number'] || '',
            registrationFee: settingsMap['registration_fee'] || '500',
            instructions: settingsMap['payment_instructions'] || ''
        }
    }, 200, headers);
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

    const warnings = await db.prepare(
        `SELECT * FROM warnings 
         WHERE student_id = ? AND is_read = 0 
         AND datetime(issued_at) > datetime('now', '-2 days')
         ORDER BY issued_at DESC`
    ).bind(student.id).all();

    // Get unread notification count
    const unreadNotifCount = await db.prepare(`
        SELECT COUNT(*) as count FROM notifications n
        WHERE n.is_active = 1
        AND (n.target_audience = 'all' OR n.target_audience = ?)
        AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
        AND n.id NOT IN (
            SELECT notification_id FROM notification_reads WHERE student_id = ?
        )
    `).bind(student.degree_category || 'Engineering', student.id).first();

    return json({
        success: true,
        student: {
            id: student.id,
            username: student.username,
            fullName: student.full_name,
            email: student.email,
            phone: student.phone,
            profilePicture: student.profile_picture,
            profileComplete: student.profile_complete === 1,
            field: student.field,
            degreeCategory: student.degree_category,
            isApproved: student.is_approved === 1,
            approvalStatus: student.approval_status,
            allowedFields: getAllowedFields(student.degree_category || 'Engineering')
        },
        profile: profile || null,
        warnings: warnings.results || [],
        unreadNotifications: unreadNotifCount ? unreadNotifCount.count : 0
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
            cnic=?, matric_marks=?, matric_total=?, matric_board=?, matric_year=?, matric_grade=?,
            fsc_marks=?, fsc_total=?, fsc_board=?, fsc_year=?, fsc_part=?, fsc_grade=?,
            degree_category=?,
            preference_1=?, preference_2=?, preference_3=?, preference_4=?, preference_5=?,
            last_net_score=?, last_net_attempt=?, planning_net=?, 
            target_university=?, target_field=?, target_score=?, preferred_campus=?,
            additional_notes=?, updated_at=CURRENT_TIMESTAMP
            WHERE student_id = ?
        `).bind(
            data.phone || '', data.district || '', data.city || '', data.province || '', data.address || '',
            data.dateOfBirth || '', data.gender || '', data.fatherName || '', data.fatherOccupation || '',
            data.cnic || '',
            data.matricMarks || 0, data.matricTotal || 1100, data.matricBoard || '', data.matricYear || '', data.matricGrade || '',
            data.fscMarks || 0, data.fscTotal || 1100, data.fscBoard || '', data.fscYear || '', data.fscPart || '', data.fscGrade || '',
            data.degreeCategory || student.degree_category || 'Engineering',
            data.preference1 || '', data.preference2 || '', data.preference3 || '',
            data.preference4 || '', data.preference5 || '',
            data.lastNetScore || 0, data.lastNetAttempt || '', data.planningNet || '',
            data.targetUniversity || 'NUST', data.targetField || '', data.targetScore || 0, data.preferredCampus || '',
            data.additionalNotes || '',
            student.id
        ).run();
    } else {
        await db.prepare(`
            INSERT INTO student_profiles (
                student_id, phone, district, city, province, address,
                date_of_birth, gender, father_name, father_occupation, cnic,
                matric_marks, matric_total, matric_board, matric_year, matric_grade,
                fsc_marks, fsc_total, fsc_board, fsc_year, fsc_part, fsc_grade,
                degree_category,
                preference_1, preference_2, preference_3, preference_4, preference_5,
                last_net_score, last_net_attempt, planning_net,
                target_university, target_field, target_score, preferred_campus,
                additional_notes
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `).bind(
            student.id,
            data.phone || '', data.district || '', data.city || '', data.province || '', data.address || '',
            data.dateOfBirth || '', data.gender || '', data.fatherName || '', data.fatherOccupation || '',
            data.cnic || '',
            data.matricMarks || 0, data.matricTotal || 1100, data.matricBoard || '', data.matricYear || '', data.matricGrade || '',
            data.fscMarks || 0, data.fscTotal || 1100, data.fscBoard || '', data.fscYear || '', data.fscPart || '', data.fscGrade || '',
            data.degreeCategory || student.degree_category || 'Engineering',
            data.preference1 || '', data.preference2 || '', data.preference3 || '',
            data.preference4 || '', data.preference5 || '',
            data.lastNetScore || 0, data.lastNetAttempt || '', data.planningNet || '',
            data.targetUniversity || 'NUST', data.targetField || '', data.targetScore || 0, data.preferredCampus || '',
            data.additionalNotes || ''
        ).run();
    }

    await db.prepare(
        'UPDATE students SET profile_complete = 1, field = ?, degree_category = ? WHERE id = ?'
    ).bind(data.targetField || student.field, data.degreeCategory || student.degree_category, student.id).run();

    return json({ success: true, message: 'Profile updated successfully' }, 200, headers);
}

async function updateAccount(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { fullName, email, profilePicture } = await request.json();

    await db.prepare(
        'UPDATE students SET full_name = ?, email = ?, profile_picture = ? WHERE id = ?'
    ).bind(
        fullName || student.full_name,
        email || student.email,
        profilePicture || student.profile_picture,
        student.id
    ).run();

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

// NEW: Upload profile picture to R2
async function uploadProfilePicture(request, db, env, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) return json({ success: false, message: 'No file provided' }, 400, headers);

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return json({ success: false, message: 'Only JPG, PNG, WebP images allowed' }, 400, headers);
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return json({ success: false, message: 'Image must be under 2MB' }, 400, headers);
        }

        const fileUrl = await uploadToR2(env, file, 'profile-pictures', `${student.id}-${file.name}`);

        // Delete old profile picture from R2 if exists
        if (student.profile_picture && student.profile_picture.includes(env.R2_PUBLIC_URL)) {
            await deleteFromR2(env, student.profile_picture);
        }

        await db.prepare(
            'UPDATE students SET profile_picture = ? WHERE id = ?'
        ).bind(fileUrl, student.id).run();

        return json({ success: true, url: fileUrl, message: 'Profile picture updated' }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

// NEW: Get student notifications
async function getStudentNotifications(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const notifications = await db.prepare(`
        SELECT n.*,
            CASE WHEN nr.id IS NOT NULL THEN 1 ELSE 0 END as is_read
        FROM notifications n
        LEFT JOIN notification_reads nr ON n.id = nr.notification_id AND nr.student_id = ?
        WHERE n.is_active = 1
        AND (n.target_audience = 'all' OR n.target_audience = ?)
        AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
        ORDER BY n.created_at DESC
        LIMIT 50
    `).bind(student.id, student.degree_category || 'Engineering').all();

    return json({
        success: true,
        notifications: notifications.results || []
    }, 200, headers);
}

// NEW: Mark single notification as read
async function markNotificationRead(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { notificationId } = await request.json();

    await db.prepare(`
        INSERT OR IGNORE INTO notification_reads (notification_id, student_id)
        VALUES (?, ?)
    `).bind(notificationId, student.id).run();

    return json({ success: true }, 200, headers);
}

// NEW: Mark all notifications as read
async function markAllNotificationsRead(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    // Get all unread notifications for this student
    const notifications = await db.prepare(`
        SELECT n.id FROM notifications n
        WHERE n.is_active = 1
        AND (n.target_audience = 'all' OR n.target_audience = ?)
        AND n.id NOT IN (
            SELECT notification_id FROM notification_reads WHERE student_id = ?
        )
    `).bind(student.degree_category || 'Engineering', student.id).all();

    for (const notif of notifications.results || []) {
        await db.prepare(`
            INSERT OR IGNORE INTO notification_reads (notification_id, student_id)
            VALUES (?, ?)
        `).bind(notif.id, student.id).run();
    }

    return json({ success: true, message: 'All notifications marked as read' }, 200, headers);
}

// NEW: Get unread notification count
async function getUnreadNotificationCount(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const result = await db.prepare(`
        SELECT COUNT(*) as count FROM notifications n
        WHERE n.is_active = 1
        AND (n.target_audience = 'all' OR n.target_audience = ?)
        AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
        AND n.id NOT IN (
            SELECT notification_id FROM notification_reads WHERE student_id = ?
        )
    `).bind(student.degree_category || 'Engineering', student.id).first();

    return json({ success: true, count: result ? result.count : 0 }, 200, headers);
}

// NEW: Get student payment status
async function getStudentPaymentStatus(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const payment = await db.prepare(`
        SELECT * FROM payment_records WHERE student_id = ? ORDER BY submitted_at DESC LIMIT 1
    `).bind(student.id).first();

    return json({
        success: true,
        payment: payment || null,
        approvalStatus: student.approval_status
    }, 200, headers);
}

// ============================================
// TESTS
// ============================================

async function startTest(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { testType, field, subject, totalQuestions, totalMarks } = await request.json();

    // Category-based access control
    if (!canAccessField(student.degree_category || student.field, field)) {
        return json({
            success: false,
            message: `Access denied. Your category (${student.degree_category}) only allows access to ${getAllowedFields(student.degree_category).join(', ')} tests.`
        }, 403, headers);
    }

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
            attemptId, correct, wrong, unattempted,
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

// NEW: Check test category access
async function checkTestAccess(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const { field } = await request.json();
    const hasAccess = canAccessField(student.degree_category || student.field, field);

    return json({
        success: true,
        hasAccess,
        degreeCategory: student.degree_category,
        allowedFields: getAllowedFields(student.degree_category || 'Engineering'),
        message: hasAccess
            ? 'Access granted'
            : `Your category only allows access to ${getAllowedFields(student.degree_category).join(', ')} tests`
    }, 200, headers);
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
// PDF RESOURCES
// ============================================

async function getPdfs(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const url = new URL(request.url);
    const field = url.searchParams.get('field');
    const subject = url.searchParams.get('subject');
    const resourceType = url.searchParams.get('type');

    // Enforce category-based access
    const allowedFields = getAllowedFields(student.degree_category || student.field);

    let query = 'SELECT * FROM pdf_resources WHERE is_active = 1';
    const binds = [];

    // Only show PDFs from allowed fields (or general/all)
    if (field && field !== 'all') {
        if (!canAccessField(student.degree_category, field)) {
            return json({ success: false, message: 'Access denied for this field' }, 403, headers);
        }
        query += ' AND field = ?';
        binds.push(field);
    } else {
        // Show only their allowed fields
        const placeholders = allowedFields.map(() => '?').join(', ');
        query += ` AND field IN (${placeholders})`;
        binds.push(...allowedFields);
    }

    if (subject && subject !== 'all') {
        query += ' AND subject = ?';
        binds.push(subject);
    }
    if (resourceType && resourceType !== 'all') {
        query += ' AND resource_type = ?';
        binds.push(resourceType);
    }

    query += ' ORDER BY uploaded_at DESC';

    const result = await db.prepare(query).bind(...binds).all();
    return json({ success: true, pdfs: result.results || [] }, 200, headers);
}

async function addPdf(request, db, env, headers) {
    // Can be called from student-facing API (admin only)
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    return await adminUploadPdf(request, db, env, headers);
}

async function incrementPdfDownload(request, db, headers, id) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    await db.prepare(
        'UPDATE pdf_resources SET download_count = download_count + 1 WHERE id = ?'
    ).bind(id).run();

    return json({ success: true }, 200, headers);
}

async function deletePdf(request, db, env, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    return await adminDeletePdf(request, db, env, headers, id);
}

// ============================================
// NOTE RESOURCES
// ============================================

async function getNotes(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const url = new URL(request.url);
    const field = url.searchParams.get('field');
    const subject = url.searchParams.get('subject');
    const noteType = url.searchParams.get('type');

    const allowedFields = getAllowedFields(student.degree_category || student.field);

    let query = 'SELECT * FROM note_resources WHERE is_active = 1';
    const binds = [];

    if (field && field !== 'all') {
        if (!canAccessField(student.degree_category, field)) {
            return json({ success: false, message: 'Access denied for this field' }, 403, headers);
        }
        query += ' AND field = ?';
        binds.push(field);
    } else {
        const placeholders = allowedFields.map(() => '?').join(', ');
        query += ` AND field IN (${placeholders})`;
        binds.push(...allowedFields);
    }

    if (subject && subject !== 'all') {
        query += ' AND subject = ?';
        binds.push(subject);
    }
    if (noteType && noteType !== 'all') {
        query += ' AND note_type = ?';
        binds.push(noteType);
    }

    query += ' ORDER BY uploaded_at DESC';

    const result = await db.prepare(query).bind(...binds).all();
    return json({ success: true, notes: result.results || [] }, 200, headers);
}

async function addNote(request, db, env, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    return await adminUploadNote(request, db, env, headers);
}

async function incrementNoteDownload(request, db, headers, id) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    await db.prepare(
        'UPDATE note_resources SET download_count = download_count + 1 WHERE id = ?'
    ).bind(id).run();

    return json({ success: true }, 200, headers);
}

async function deleteNote(request, db, env, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    return await adminDeleteNote(request, db, env, headers, id);
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

    const result = await db.prepare(
        `SELECT * FROM warnings 
         WHERE student_id = ? 
         AND is_read = 0 
         AND datetime(issued_at) > datetime('now', '-2 days')
         ORDER BY issued_at DESC`
    ).bind(student.id).all();

    return json({ success: true, warnings: result.results || [] }, 200, headers);
}

async function dismissWarning(request, db, headers, warningId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    await db.prepare(
        'UPDATE warnings SET is_read = 1 WHERE id = ? AND student_id = ?'
    ).bind(warningId, student.id).run();

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
// FILE UPLOAD (R2 - General)
// ============================================

async function handleFileUpload(request, db, env, headers) {
    // Can be student (profile pic) or admin (PDFs, notes)
    const session = await getSession(request, db);
    if (!session) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'uploads';

        if (!file) return json({ success: false, message: 'No file provided' }, 400, headers);

        // For non-admin: only allow image uploads
        if (session.user_type !== 'admin') {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return json({ success: false, message: 'Only images allowed for students' }, 403, headers);
            }
            if (file.size > 2 * 1024 * 1024) {
                return json({ success: false, message: 'File too large (max 2MB)' }, 400, headers);
            }
        } else {
            // Admin: allow PDF and images, max 20MB
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return json({ success: false, message: 'Only PDF and images allowed' }, 400, headers);
            }
            if (file.size > 20 * 1024 * 1024) {
                return json({ success: false, message: 'File too large (max 20MB)' }, 400, headers);
            }
        }

        const fileUrl = await uploadToR2(env, file, folder, file.name);

        return json({
            success: true,
            url: fileUrl,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

async function adminDashboard(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const totalStudents = await db.prepare('SELECT COUNT(*) as count FROM students').first();
    const activeStudents = await db.prepare('SELECT COUNT(*) as count FROM students WHERE is_active = 1 AND is_approved = 1').first();
    const pendingStudents = await db.prepare('SELECT COUNT(*) as count FROM registrations WHERE status = "pending"').first();
    const totalTests = await db.prepare('SELECT COUNT(*) as count FROM test_attempts WHERE status = "completed"').first();
    const pendingReports = await db.prepare('SELECT COUNT(*) as count FROM reports WHERE status = "pending"').first();
    const totalLectures = await db.prepare('SELECT COUNT(*) as count FROM lectures').first();
    const totalPdfs = await db.prepare('SELECT COUNT(*) as count FROM pdf_resources WHERE is_active = 1').first();
    const totalNotes = await db.prepare('SELECT COUNT(*) as count FROM note_resources WHERE is_active = 1').first();
    const pendingPayments = await db.prepare('SELECT COUNT(*) as count FROM payment_records WHERE verification_status = "pending"').first();

    // Category-wise student count
    const categoryStats = await db.prepare(`
        SELECT degree_category, COUNT(*) as count 
        FROM students 
        WHERE is_approved = 1 
        GROUP BY degree_category
    `).all();

    // Recent registrations
    const recentRegistrations = await db.prepare(`
        SELECT * FROM registrations ORDER BY submitted_at DESC LIMIT 5
    `).all();

    return json({
        success: true,
        stats: {
            totalStudents: totalStudents.count,
            activeStudents: activeStudents.count,
            pendingStudents: pendingStudents.count,
            totalTests: totalTests.count,
            pendingReports: pendingReports.count,
            totalLectures: totalLectures.count,
            totalPdfs: totalPdfs.count,
            totalNotes: totalNotes.count,
            pendingPayments: pendingPayments.count
        },
        categoryStats: categoryStats.results || [],
        recentRegistrations: recentRegistrations.results || []
    }, 200, headers);
}

async function adminGetStudents(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const status = url.searchParams.get('status') || '';

    let query = `
        SELECT s.*, 
            (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as test_count,
            (SELECT AVG(percentage) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_score
        FROM students s WHERE 1=1
    `;
    const binds = [];

    if (search) {
        query += ' AND (s.username LIKE ? OR s.full_name LIKE ? OR s.email LIKE ?)';
        binds.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
        query += ' AND s.degree_category = ?';
        binds.push(category);
    }
    if (status === 'active') {
        query += ' AND s.is_active = 1 AND s.is_approved = 1';
    } else if (status === 'inactive') {
        query += ' AND s.is_active = 0';
    } else if (status === 'pending') {
        query += ' AND s.approval_status = "pending"';
    }

    query += ' ORDER BY s.created_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, students: result.results || [] }, 200, headers);
}

async function adminAddStudent(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const { username, password, fullName, email, field, degreeCategory } = await request.json();

    const existing = await db.prepare('SELECT id FROM students WHERE username = ?').bind(username).first();
    if (existing) return json({ success: false, message: 'Username already exists' }, 400, headers);

    const category = degreeCategory || field || 'Engineering';

    await db.prepare(
        'INSERT INTO students (username, password, full_name, email, field, degree_category, is_approved, approval_status) VALUES (?, ?, ?, ?, ?, ?, 1, "approved")'
    ).bind(username, password, fullName || '', email || '', field || 'Engineering', category).run();

    return json({ success: true, message: 'Student added' }, 200, headers);
}

// NEW: Toggle student active status
async function adminToggleStudentActive(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const student = await db.prepare('SELECT is_active FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    const newStatus = student.is_active === 1 ? 0 : 1;
    await db.prepare('UPDATE students SET is_active = ? WHERE id = ?').bind(newStatus, id).run();

    return json({ success: true, isActive: newStatus === 1 }, 200, headers);
}

// NEW: Admin reset student password (forgot password)
async function adminResetStudentPassword(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const { newPassword } = await request.json();
    if (!newPassword) return json({ success: false, message: 'New password required' }, 400, headers);

    await db.prepare('UPDATE students SET password = ? WHERE id = ?').bind(newPassword, id).run();

    // Send notification to the student
    await db.prepare(`
        INSERT INTO notifications (title, message, type, target_audience, created_by)
        VALUES (?, ?, 'system', 'all', 'admin')
    `).bind(
        'Password Reset',
        'Your password has been reset by the administrator. Please login with your new password.',
        'system'
    ).run();

    return json({ success: true, message: 'Password reset successfully' }, 200, headers);
}

async function adminGetStudentDetails(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    const profile = await db.prepare('SELECT * FROM student_profiles WHERE student_id = ?').bind(id).first();
    const attempts = await db.prepare(
        'SELECT * FROM test_attempts WHERE student_id = ? ORDER BY completed_at DESC'
    ).bind(id).all();
    const payments = await db.prepare(
        'SELECT * FROM payment_records WHERE student_id = ? ORDER BY submitted_at DESC'
    ).bind(id).all();

    const completedAttempts = (attempts.results || []).filter(a => a.status === 'completed');
    let performanceScore = 0;
    if (completedAttempts.length > 0) {
        const avgPerc = completedAttempts.reduce((sum, a) => sum + a.percentage, 0) / completedAttempts.length;
        const consistency = Math.min(100, (completedAttempts.length / 10) * 100);
        performanceScore = Math.round((avgPerc * 0.7) + (consistency * 0.3));
    }

    // Subject-wise performance
    const subjectPerformance = await db.prepare(`
        SELECT subject, 
            AVG(percentage) as avg_percentage,
            COUNT(*) as total_attempts,
            MAX(percentage) as best_percentage
        FROM test_attempts 
        WHERE student_id = ? AND status = 'completed' AND subject IS NOT NULL
        GROUP BY subject
        ORDER BY avg_percentage DESC
    `).bind(id).all();

    return json({
        success: true,
        student,
        profile,
        attempts: attempts.results || [],
        payments: payments.results || [],
        performanceScore,
        subjectPerformance: subjectPerformance.results || []
    }, 200, headers);
}

async function adminDeleteStudent(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    await db.prepare('DELETE FROM students WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

// NEW: Export students to CSV
async function adminExportStudents(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const category = url.searchParams.get('category') || '';

    let query = `
        SELECT 
            s.id, s.username, s.full_name, s.email, s.phone,
            s.degree_category, s.field, s.is_active, s.is_approved,
            s.approval_status, s.created_at, s.last_login,
            sp.father_name, sp.gender, sp.date_of_birth, sp.cnic,
            sp.city, sp.province, sp.phone as profile_phone,
            sp.matric_marks, sp.matric_total, sp.matric_board, sp.matric_year,
            sp.fsc_marks, sp.fsc_total, sp.fsc_board, sp.fsc_year,
            sp.preference_1, sp.preference_2, sp.preference_3,
            (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as total_tests,
            (SELECT ROUND(AVG(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_score,
            (SELECT MAX(percentage) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as best_score
        FROM students s
        LEFT JOIN student_profiles sp ON s.id = sp.student_id
        WHERE 1=1
    `;
    const binds = [];

    if (category) {
        query += ' AND s.degree_category = ?';
        binds.push(category);
    }

    query += ' ORDER BY s.created_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    const students = result.results || [];

    // Build CSV
    const headers_csv = [
        'ID', 'Username', 'Full Name', 'Email', 'Phone',
        'Degree Category', 'Field', 'Active', 'Approved',
        'Approval Status', 'Registered At', 'Last Login',
        'Father Name', 'Gender', 'Date of Birth', 'CNIC',
        'City', 'Province',
        'Matric Marks', 'Matric Total', 'Matric Board', 'Matric Year',
        'FSc Marks', 'FSc Total', 'FSc Board', 'FSc Year',
        'Preference 1', 'Preference 2', 'Preference 3',
        'Total Tests', 'Avg Score (%)', 'Best Score (%)'
    ];

    const csvRows = [headers_csv.join(',')];

    for (const s of students) {
        const row = [
            s.id,
            `"${(s.username || '').replace(/"/g, '""')}"`,
            `"${(s.full_name || '').replace(/"/g, '""')}"`,
            `"${(s.email || '').replace(/"/g, '""')}"`,
            `"${(s.phone || s.profile_phone || '').replace(/"/g, '""')}"`,
            `"${(s.degree_category || '').replace(/"/g, '""')}"`,
            `"${(s.field || '').replace(/"/g, '""')}"`,
            s.is_active ? 'Yes' : 'No',
            s.is_approved ? 'Yes' : 'No',
            `"${(s.approval_status || '').replace(/"/g, '""')}"`,
            `"${(s.created_at || '').replace(/"/g, '""')}"`,
            `"${(s.last_login || '').replace(/"/g, '""')}"`,
            `"${(s.father_name || '').replace(/"/g, '""')}"`,
            `"${(s.gender || '').replace(/"/g, '""')}"`,
            `"${(s.date_of_birth || '').replace(/"/g, '""')}"`,
            `"${(s.cnic || '').replace(/"/g, '""')}"`,
            `"${(s.city || '').replace(/"/g, '""')}"`,
            `"${(s.province || '').replace(/"/g, '""')}"`,
            s.matric_marks || '',
            s.matric_total || '',
            `"${(s.matric_board || '').replace(/"/g, '""')}"`,
            `"${(s.matric_year || '').replace(/"/g, '""')}"`,
            s.fsc_marks || '',
            s.fsc_total || '',
            `"${(s.fsc_board || '').replace(/"/g, '""')}"`,
            `"${(s.fsc_year || '').replace(/"/g, '""')}"`,
            `"${(s.preference_1 || '').replace(/"/g, '""')}"`,
            `"${(s.preference_2 || '').replace(/"/g, '""')}"`,
            `"${(s.preference_3 || '').replace(/"/g, '""')}"`,
            s.total_tests || 0,
            s.avg_score || 0,
            s.best_score || 0
        ];
        csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new Response(csvContent, {
        status: 200,
        headers: {
            ...headers,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="students_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
    });
}

// ============================================
// ADMIN REGISTRATIONS (NEW)
// ============================================

async function adminGetRegistrations(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const search = url.searchParams.get('search') || '';

    let query = 'SELECT * FROM registrations WHERE 1=1';
    const binds = [];

    if (status) {
        query += ' AND status = ?';
        binds.push(status);
    }
    if (search) {
        query += ' AND (full_name LIKE ? OR email LIKE ? OR desired_username LIKE ?)';
        binds.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY submitted_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, registrations: result.results || [] }, 200, headers);
}

async function adminGetRegistrationDetails(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const registration = await db.prepare(
        'SELECT * FROM registrations WHERE id = ?'
    ).bind(id).first();

    if (!registration) return json({ success: false, message: 'Registration not found' }, 404, headers);

    const payment = await db.prepare(
        'SELECT * FROM payment_records WHERE registration_id = ? ORDER BY submitted_at DESC LIMIT 1'
    ).bind(id).first();

    return json({ success: true, registration, payment: payment || null }, 200, headers);
}

async function adminApproveRegistration(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const registration = await db.prepare(
        'SELECT * FROM registrations WHERE id = ?'
    ).bind(id).first();

    if (!registration) return json({ success: false, message: 'Registration not found' }, 404, headers);
    if (registration.status === 'approved') return json({ success: false, message: 'Already approved' }, 400, headers);

    // Check if username still available
    const existing = await db.prepare(
        'SELECT id FROM students WHERE username = ?'
    ).bind(registration.desired_username).first();
    if (existing) {
        return json({
            success: false,
            message: 'Username is already taken. Please reject and ask student to re-register with a different username.'
        }, 400, headers);
    }

    // Create student account
    const result = await db.prepare(`
        INSERT INTO students (
            username, password, full_name, email, phone,
            field, degree_category, is_active, is_approved, approval_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, 'approved')
    `).bind(
        registration.desired_username,
        registration.desired_password,
        registration.full_name,
        registration.email,
        registration.phone,
        registration.degree_category,
        registration.degree_category
    ).run();

    const studentId = result.meta.last_row_id;

    // Create student profile
    await db.prepare(`
        INSERT INTO student_profiles (
            student_id, phone, city, province, address,
            date_of_birth, gender, father_name, cnic,
            matric_marks, matric_total, matric_board, matric_year,
            fsc_marks, fsc_total, fsc_board, fsc_year, fsc_part,
            degree_category, preference_1, preference_2, preference_3, preference_4, preference_5
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
        studentId,
        registration.phone || '',
        registration.city || '',
        registration.province || '',
        registration.address || '',
        registration.date_of_birth || '',
        registration.gender || '',
        registration.father_name || '',
        registration.cnic || '',
        registration.matric_marks || 0,
        registration.matric_total || 1100,
        registration.matric_board || '',
        registration.matric_year || '',
        registration.fsc_marks || 0,
        registration.fsc_total || 1100,
        registration.fsc_board || '',
        registration.fsc_year || '',
        registration.fsc_part || '',
        registration.degree_category || '',
        registration.preference_1 || '',
        registration.preference_2 || '',
        registration.preference_3 || '',
        registration.preference_4 || '',
        registration.preference_5 || ''
    ).run();

    // Update registration status
    await db.prepare(`
        UPDATE registrations SET 
        status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, student_id = ?
        WHERE id = ?
    `).bind(admin.username, studentId, id).run();

    // Update payment record
    await db.prepare(`
        UPDATE payment_records SET 
        verification_status = 'verified', verified_by = ?, verified_at = CURRENT_TIMESTAMP, student_id = ?
        WHERE registration_id = ?
    `).bind(admin.username, studentId, id).run();

    // Send approval notification
    await db.prepare(`
        INSERT INTO notifications (title, message, type, target_audience, created_by)
        VALUES (?, ?, 'system', 'all', 'admin')
    `).bind(
        'Registration Approved! 🎉',
        `Congratulations ${registration.full_name}! Your registration has been approved. You can now login with username: ${registration.desired_username}`,
        'system'
    ).run();

    return json({
        success: true,
        message: 'Registration approved. Student account created.',
        studentId
    }, 200, headers);
}

async function adminRejectRegistration(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const { reason } = await request.json();

    const registration = await db.prepare(
        'SELECT * FROM registrations WHERE id = ?'
    ).bind(id).first();

    if (!registration) return json({ success: false, message: 'Registration not found' }, 404, headers);

    await db.prepare(`
        UPDATE registrations SET 
        status = 'rejected', rejection_reason = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).bind(reason || 'Registration rejected by admin', admin.username, id).run();

    await db.prepare(`
        UPDATE payment_records SET verification_status = 'rejected' WHERE registration_id = ?
    `).bind(id).run();

    return json({ success: true, message: 'Registration rejected' }, 200, headers);
}

async function adminDeleteRegistration(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    await db.prepare('DELETE FROM registrations WHERE id = ?').bind(id).run();
    await db.prepare('DELETE FROM payment_records WHERE registration_id = ?').bind(id).run();

    return json({ success: true }, 200, headers);
}

// ============================================
// ADMIN NOTIFICATIONS (NEW)
// ============================================

async function adminGetNotifications(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const result = await db.prepare(
        'SELECT * FROM notifications ORDER BY created_at DESC'
    ).all();

    return json({ success: true, notifications: result.results || [] }, 200, headers);
}

async function adminCreateNotification(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const data = await request.json();

    if (!data.title || !data.message) {
        return json({ success: false, message: 'Title and message required' }, 400, headers);
    }

    await db.prepare(`
        INSERT INTO notifications (title, message, type, target_audience, created_by, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
        data.title,
        data.message,
        data.type || 'announcement',
        data.targetAudience || 'all',
        admin.username,
        data.expiresAt || null
    ).run();

    return json({ success: true, message: 'Notification created' }, 200, headers);
}

async function adminDeleteNotification(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    await db.prepare('DELETE FROM notifications WHERE id = ?').bind(id).run();
    await db.prepare('DELETE FROM notification_reads WHERE notification_id = ?').bind(id).run();

    return json({ success: true }, 200, headers);
}

// ============================================
// ADMIN PDF MANAGEMENT (NEW)
// ============================================

async function adminGetPdfs(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const field = url.searchParams.get('field') || '';
    const subject = url.searchParams.get('subject') || '';

    let query = 'SELECT * FROM pdf_resources WHERE 1=1';
    const binds = [];

    if (field) { query += ' AND field = ?'; binds.push(field); }
    if (subject) { query += ' AND subject = ?'; binds.push(subject); }

    query += ' ORDER BY uploaded_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, pdfs: result.results || [] }, 200, headers);
}

async function adminUploadPdf(request, db, env, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const title = formData.get('title');
        const description = formData.get('description') || '';
        const subject = formData.get('subject');
        const field = formData.get('field');
        const chapter = formData.get('chapter') || '';
        const resourceType = formData.get('resourceType') || 'past_paper';

        if (!file || !title || !subject || !field) {
            return json({ success: false, message: 'File, title, subject and field are required' }, 400, headers);
        }

        if (file.type !== 'application/pdf') {
            return json({ success: false, message: 'Only PDF files allowed' }, 400, headers);
        }

        if (file.size > 20 * 1024 * 1024) {
            return json({ success: false, message: 'PDF must be under 20MB' }, 400, headers);
        }

        const fileUrl = await uploadToR2(env, file, 'pdfs', file.name);
        const fileSizeKB = Math.round(file.size / 1024);

        await db.prepare(`
            INSERT INTO pdf_resources (title, description, file_url, file_name, file_size, subject, field, chapter, resource_type, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            title, description, fileUrl, file.name,
            `${fileSizeKB} KB`, subject, field, chapter,
            resourceType, admin.username
        ).run();

        // Create notification for new PDF
        await db.prepare(`
            INSERT INTO notifications (title, message, type, target_audience, created_by)
            VALUES (?, ?, 'new_content', ?, ?)
        `).bind(
            `New PDF: ${title}`,
            `A new ${resourceType.replace('_', ' ')} has been uploaded for ${subject} (${field}).`,
            field,
            admin.username
        ).run();

        return json({ success: true, message: 'PDF uploaded successfully', url: fileUrl }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

async function adminDeletePdf(request, db, env, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const pdf = await db.prepare('SELECT * FROM pdf_resources WHERE id = ?').bind(id).first();
    if (!pdf) return json({ success: false, message: 'PDF not found' }, 404, headers);

    // Delete from R2
    await deleteFromR2(env, pdf.file_url);

    await db.prepare('DELETE FROM pdf_resources WHERE id = ?').bind(id).run();

    return json({ success: true, message: 'PDF deleted' }, 200, headers);
}

// ============================================
// ADMIN NOTE MANAGEMENT (NEW)
// ============================================

async function adminGetNotes(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const field = url.searchParams.get('field') || '';
    const subject = url.searchParams.get('subject') || '';

    let query = 'SELECT * FROM note_resources WHERE 1=1';
    const binds = [];

    if (field) { query += ' AND field = ?'; binds.push(field); }
    if (subject) { query += ' AND subject = ?'; binds.push(subject); }

    query += ' ORDER BY uploaded_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, notes: result.results || [] }, 200, headers);
}

async function adminUploadNote(request, db, env, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const title = formData.get('title');
        const description = formData.get('description') || '';
        const subject = formData.get('subject');
        const field = formData.get('field');
        const chapter = formData.get('chapter') || '';
        const noteType = formData.get('noteType') || 'formula_sheet';

        if (!file || !title || !subject || !field) {
            return json({ success: false, message: 'File, title, subject and field are required' }, 400, headers);
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return json({ success: false, message: 'Only PDF and image files allowed for notes' }, 400, headers);
        }

        if (file.size > 20 * 1024 * 1024) {
            return json({ success: false, message: 'File must be under 20MB' }, 400, headers);
        }

        const fileUrl = await uploadToR2(env, file, 'notes', file.name);
        const fileSizeKB = Math.round(file.size / 1024);

        await db.prepare(`
            INSERT INTO note_resources (title, description, file_url, file_name, file_size, subject, field, chapter, note_type, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            title, description, fileUrl, file.name,
            `${fileSizeKB} KB`, subject, field, chapter,
            noteType, admin.username
        ).run();

        // Create notification for new note
        await db.prepare(`
            INSERT INTO notifications (title, message, type, target_audience, created_by)
            VALUES (?, ?, 'new_content', ?, ?)
        `).bind(
            `New Notes: ${title}`,
            `New ${noteType.replace('_', ' ')} has been uploaded for ${subject} (${field}).`,
            field,
            admin.username
        ).run();

        return json({ success: true, message: 'Note uploaded successfully', url: fileUrl }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

async function adminDeleteNote(request, db, env, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const note = await db.prepare('SELECT * FROM note_resources WHERE id = ?').bind(id).first();
    if (!note) return json({ success: false, message: 'Note not found' }, 404, headers);

    await deleteFromR2(env, note.file_url);
    await db.prepare('DELETE FROM note_resources WHERE id = ?').bind(id).run();

    return json({ success: true, message: 'Note deleted' }, 200, headers);
}

// ============================================
// ADMIN SETTINGS (NEW)
// ============================================

async function adminGetSettings(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const result = await db.prepare('SELECT key, value FROM settings').all();
    const settingsMap = {};
    for (const s of result.results || []) {
        settingsMap[s.key] = s.value;
    }

    return json({ success: true, settings: settingsMap }, 200, headers);
}

async function adminUpdateSettings(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const data = await request.json();

    for (const [key, value] of Object.entries(data)) {
        await db.prepare(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
        ).bind(key, String(value)).run();
    }

    return json({ success: true, message: 'Settings updated' }, 200, headers);
}

// ============================================
// ADMIN PAYMENTS (NEW)
// ============================================

async function adminGetPayments(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';

    let query = `
        SELECT pr.*, r.full_name, r.email, r.degree_category, r.desired_username
        FROM payment_records pr
        LEFT JOIN registrations r ON pr.registration_id = r.id
        WHERE 1=1
    `;
    const binds = [];

    if (status) {
        query += ' AND pr.verification_status = ?';
        binds.push(status);
    }

    query += ' ORDER BY pr.submitted_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, payments: result.results || [] }, 200, headers);
}

// ============================================
// ADMIN ANALYTICS (NEW)
// ============================================

async function adminGetAnalytics(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    // Total and active students
    const totalStudents = await db.prepare('SELECT COUNT(*) as count FROM students').first();
    const activeStudents = await db.prepare('SELECT COUNT(*) as count FROM students WHERE is_active = 1 AND is_approved = 1').first();
    const pendingApprovals = await db.prepare('SELECT COUNT(*) as count FROM registrations WHERE status = "pending"').first();

    // Category-wise breakdown
    const categoryBreakdown = await db.prepare(`
        SELECT degree_category, COUNT(*) as count 
        FROM students WHERE is_approved = 1 
        GROUP BY degree_category 
        ORDER BY count DESC
    `).all();

    // Test statistics
    const totalTests = await db.prepare('SELECT COUNT(*) as count FROM test_attempts WHERE status = "completed"').first();
    const avgScore = await db.prepare('SELECT ROUND(AVG(percentage), 2) as avg FROM test_attempts WHERE status = "completed"').first();

    // Most attempted test types
    const popularTests = await db.prepare(`
        SELECT test_type, field, COUNT(*) as attempts, ROUND(AVG(percentage), 2) as avg_score
        FROM test_attempts 
        WHERE status = 'completed'
        GROUP BY test_type, field 
        ORDER BY attempts DESC 
        LIMIT 10
    `).all();

    // Subject-wise performance
    const subjectPerformance = await db.prepare(`
        SELECT subject, 
            COUNT(*) as total_attempts,
            ROUND(AVG(percentage), 2) as avg_score,
            ROUND(MAX(percentage), 2) as best_score
        FROM test_attempts 
        WHERE status = 'completed' AND subject IS NOT NULL AND subject != ''
        GROUP BY subject 
        ORDER BY avg_score DESC
        LIMIT 15
    `).all();

    // Recent student registrations (last 30 days)
    const recentRegistrations = await db.prepare(`
        SELECT date(created_at) as date, COUNT(*) as count
        FROM students
        WHERE created_at > datetime('now', '-30 days')
        GROUP BY date(created_at)
        ORDER BY date ASC
    `).all();

    // Top performing students
    const topStudents = await db.prepare(`
        SELECT s.username, s.full_name, s.degree_category,
            ROUND(AVG(t.percentage), 2) as avg_score,
            COUNT(t.id) as total_tests,
            MAX(t.percentage) as best_score
        FROM students s
        JOIN test_attempts t ON s.id = t.student_id AND t.status = 'completed'
        GROUP BY s.id
        ORDER BY avg_score DESC
        LIMIT 10
    `).all();

    // Resource statistics
    const totalPdfs = await db.prepare('SELECT COUNT(*) as count, SUM(download_count) as downloads FROM pdf_resources WHERE is_active = 1').first();
    const totalNotes = await db.prepare('SELECT COUNT(*) as count, SUM(download_count) as downloads FROM note_resources WHERE is_active = 1').first();
    const totalLectures = await db.prepare('SELECT COUNT(*) as count FROM lectures').first();

    return json({
        success: true,
        analytics: {
            students: {
                total: totalStudents.count,
                active: activeStudents.count,
                pending: pendingApprovals.count,
                categoryBreakdown: categoryBreakdown.results || []
            },
            tests: {
                total: totalTests.count,
                avgScore: avgScore.avg || 0,
                popularTests: popularTests.results || [],
                subjectPerformance: subjectPerformance.results || []
            },
            registrations: {
                recentTrend: recentRegistrations.results || []
            },
            topStudents: topStudents.results || [],
            resources: {
                pdfs: totalPdfs.count || 0,
                pdfDownloads: totalPdfs.downloads || 0,
                notes: totalNotes.count || 0,
                noteDownloads: totalNotes.downloads || 0,
                lectures: totalLectures.count || 0
            }
        }
    }, 200, headers);
}

// ============================================
// ADMIN EXISTING FUNCTIONS
// ============================================

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

    const fields = [
        'Engineering', 'Applied Sciences',
        'Business', 'Architecture', 'Natural Sciences'
    ];
    const leaderboards = {};

    for (const field of fields) {
        const result = await db.prepare(`
            SELECT s.username, s.full_name, s.field, s.degree_category,
                MAX(t.score) as best_score,
                MAX(t.percentage) as best_percentage,
                COUNT(t.id) as total_tests,
                ROUND(AVG(t.percentage), 2) as avg_score
            FROM students s
            JOIN test_attempts t ON s.id = t.student_id
            WHERE t.status = 'completed' AND (t.field = ? OR t.field LIKE ?)
            GROUP BY s.id
            ORDER BY best_score DESC
            LIMIT 20
        `).bind(field, `%${field}%`).all();
        leaderboards[field] = result.results || [];
    }

    return json({ success: true, leaderboards }, 200, headers);
}
