// ============================================
// UNITEST / NUSTOLOGY PREP - CLOUDFLARE WORKER API
// File: functions/api/[[path]].js
// ============================================

export async function onRequest(context) {
    const { request, env, params } = context;
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/', '').replace('/api', '');
    const method = request.method;

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

        // ---------- AUTH ----------
        if (path === 'auth/login' && method === 'POST') return await handleStudentLogin(request, db, corsHeaders);
        if (path === 'auth/admin-login' && method === 'POST') return await handleAdminLogin(request, db, corsHeaders);
        if (path === 'auth/logout' && method === 'POST') return await handleLogout(request, db, corsHeaders);
        if (path === 'auth/verify' && method === 'GET') return await verifySession(request, db, corsHeaders);
        if (path === 'auth/register' && method === 'POST') return await handleStudentRegister(request, db, env, corsHeaders);
        if (path === 'auth/check-username' && method === 'POST') return await checkUsernameAvailability(request, db, corsHeaders);
        if (path === 'auth/payment-info' && method === 'GET') return await getPaymentInfo(request, db, corsHeaders);
        if (path === 'auth/forgot-password' && method === 'POST') return await handleForgotPassword(request, db, corsHeaders);

        // ---------- STUDENT PROFILE ----------
        if (path === 'student/me' && method === 'GET') return await getStudentProfile(request, db, corsHeaders);
        if (path === 'student/profile' && method === 'POST') return await updateStudentProfile(request, db, corsHeaders);
        if (path === 'student/update-account' && method === 'POST') return await updateAccount(request, db, corsHeaders);
        if (path === 'student/change-password' && method === 'POST') return await changeStudentPassword(request, db, corsHeaders);
        if (path === 'student/upload-profile-pic' && method === 'POST') return await uploadProfilePicture(request, db, env, corsHeaders);
        if (path === 'student/notifications' && method === 'GET') return await getStudentNotifications(request, db, corsHeaders);
        if (path === 'student/notifications/read' && method === 'POST') return await markNotificationRead(request, db, corsHeaders);
        if (path === 'student/notifications/read-all' && method === 'POST') return await markAllNotificationsRead(request, db, corsHeaders);
        if (path === 'student/notifications/unread-count' && method === 'GET') return await getUnreadNotificationCount(request, db, corsHeaders);
        if (path === 'student/payment-status' && method === 'GET') return await getStudentPaymentStatus(request, db, corsHeaders);

        // ---------- TESTS ----------
        if (path === 'tests/start' && method === 'POST') return await startTest(request, db, corsHeaders);
        if (path === 'tests/submit' && method === 'POST') return await submitTest(request, db, corsHeaders);
        if (path === 'tests/my-attempts' && method === 'GET') return await getMyAttempts(request, db, corsHeaders);
        if (path.startsWith('tests/review/') && method === 'GET') {
            const attemptId = path.split('/')[2];
            return await getTestReview(request, db, corsHeaders, attemptId);
        }
        if (path === 'tests/check-access' && method === 'POST') return await checkTestAccess(request, db, corsHeaders);

        // ---------- LEADERBOARD ----------
        if (path === 'leaderboard' && method === 'GET') return await getLeaderboard(request, db, corsHeaders);
        if (path === 'leaderboard/streaks' && method === 'GET') return await getStreaks(request, db, corsHeaders);

        // ---------- LECTURES ----------
        if (path === 'lectures' && method === 'GET') return await getLectures(request, db, corsHeaders);
        if (path === 'lectures' && method === 'POST') return await addLecture(request, db, corsHeaders);
        if (path.startsWith('lectures/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await deleteLecture(request, db, corsHeaders, id);
        }

        // ---------- MERIT LISTS ----------
        if (path === 'merit-lists' && method === 'GET') return await getMeritLists(request, db, corsHeaders);
        if (path === 'merit-lists' && method === 'POST') return await addMeritList(request, db, corsHeaders);
        if (path.startsWith('merit-lists/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await deleteMeritList(request, db, corsHeaders, id);
        }

        // ---------- PDF RESOURCES ----------
        if (path === 'pdfs' && method === 'GET') return await getPdfs(request, db, corsHeaders);
        if (path === 'pdfs' && method === 'POST') {
            const ct = request.headers.get('Content-Type') || '';
            if (ct.includes('application/json')) return await adminAddPdfJson(request, db, corsHeaders);
            return await adminUploadPdf(request, db, env, corsHeaders);
        }
        if (path.startsWith('pdfs/') && path.endsWith('/download') && method === 'POST') {
            const id = path.split('/')[1];
            return await incrementPdfDownload(request, db, corsHeaders, id);
        }
        if (path.startsWith('pdfs/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await adminDeletePdf(request, db, env, corsHeaders, id);
        }

        // ---------- NOTE RESOURCES ----------
        if (path === 'notes' && method === 'GET') return await getNotes(request, db, corsHeaders);
        if (path === 'notes' && method === 'POST') {
            const ct = request.headers.get('Content-Type') || '';
            if (ct.includes('application/json')) return await adminAddNoteJson(request, db, corsHeaders);
            return await adminUploadNote(request, db, env, corsHeaders);
        }
        if (path.startsWith('notes/') && path.endsWith('/download') && method === 'POST') {
            const id = path.split('/')[1];
            return await incrementNoteDownload(request, db, corsHeaders, id);
        }
        if (path.startsWith('notes/') && method === 'DELETE') {
            const id = path.split('/')[1];
            return await adminDeleteNote(request, db, env, corsHeaders, id);
        }

        // ---------- CHAT (Private Students) ----------
        if (path === 'chat/group/messages' && method === 'GET') return await getGroupMessages(request, db, corsHeaders);
        if (path === 'chat/group/send' && method === 'POST') return await sendGroupMessage(request, db, corsHeaders);
        if (path === 'chat/private/users' && method === 'GET') return await getChatUsers(request, db, corsHeaders);
        if (path.startsWith('chat/private/messages/') && method === 'GET') {
            const otherId = path.split('/')[3];
            return await getPrivateMessages(request, db, corsHeaders, otherId);
        }
        if (path === 'chat/private/send' && method === 'POST') return await sendPrivateMessage(request, db, corsHeaders);
        if (path === 'chat/report' && method === 'POST') return await reportStudent(request, db, corsHeaders);

        // ---------- CHAT (College Students) ----------
        if (path === 'chat/college/messages' && method === 'GET') return await getCollegeGroupMessages(request, db, corsHeaders);
        if (path === 'chat/college/send' && method === 'POST') return await sendCollegeGroupMessage(request, db, corsHeaders);

        // ---------- POSTS ----------
        if (path === 'posts' && method === 'GET') return await getPosts(request, db, corsHeaders);
        if (path === 'posts' && method === 'POST') return await createPost(request, db, corsHeaders);
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
        if (path === 'warnings/my' && method === 'GET') return await getMyWarnings(request, db, corsHeaders);
        if (path.startsWith('warnings/') && path.endsWith('/dismiss') && method === 'POST') {
            const warningId = path.split('/')[1];
            return await dismissWarning(request, db, corsHeaders, warningId);
        }

        // ============ PLATFORM OWNER (ADMIN) ROUTES ============
        if (path === 'admin/dashboard' && method === 'GET') return await adminDashboard(request, db, corsHeaders);

        if (path === 'admin/students' && method === 'GET') return await adminGetStudents(request, db, corsHeaders);
        if (path === 'admin/students' && method === 'POST') return await adminAddStudent(request, db, corsHeaders);
        if (path === 'admin/students/export' && method === 'GET') return await adminExportStudents(request, db, corsHeaders);
        if (path.startsWith('admin/students/') && path.endsWith('/toggle-active') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminToggleStudentActive(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/students/') && path.endsWith('/reset-password') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminResetStudentPassword(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/students/') && path.includes('/attempts/') && method === 'GET') {
            const parts = path.split('/');
            const studentId = parts[2];
            const attemptId = parts[4];
            return await adminGetTestReview(request, db, corsHeaders, studentId, attemptId);
        }
        if (path.startsWith('admin/students/') && method === 'GET') {
            const id = path.split('/')[2];
            return await adminGetStudentDetails(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/students/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteStudent(request, db, corsHeaders, id);
        }

        if (path === 'admin/registrations' && method === 'GET') return await adminGetRegistrations(request, db, corsHeaders);
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

        if (path === 'admin/notifications' && method === 'GET') return await adminGetNotifications(request, db, corsHeaders);
        if (path === 'admin/notifications' && method === 'POST') return await adminCreateNotification(request, db, corsHeaders);
        if (path.startsWith('admin/notifications/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteNotification(request, db, corsHeaders, id);
        }

        if (path === 'admin/pdfs' && method === 'GET') return await adminGetPdfs(request, db, corsHeaders);
        if (path === 'admin/pdfs' && method === 'POST') {
            const ct = request.headers.get('Content-Type') || '';
            if (ct.includes('application/json')) return await adminAddPdfJson(request, db, corsHeaders);
            return await adminUploadPdf(request, db, env, corsHeaders);
        }
        if (path.startsWith('admin/pdfs/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeletePdf(request, db, env, corsHeaders, id);
        }

        if (path === 'admin/notes' && method === 'GET') return await adminGetNotes(request, db, corsHeaders);
        if (path === 'admin/notes' && method === 'POST') {
            const ct = request.headers.get('Content-Type') || '';
            if (ct.includes('application/json')) return await adminAddNoteJson(request, db, corsHeaders);
            return await adminUploadNote(request, db, env, corsHeaders);
        }
        if (path.startsWith('admin/notes/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteNote(request, db, env, corsHeaders, id);
        }

        if (path === 'admin/settings' && method === 'GET') return await adminGetSettings(request, db, corsHeaders);
        if (path === 'admin/settings' && method === 'POST') return await adminUpdateSettings(request, db, corsHeaders);
        if (path === 'admin/payments' && method === 'GET') return await adminGetPayments(request, db, corsHeaders);
        if (path === 'admin/analytics' && method === 'GET') return await adminGetAnalytics(request, db, corsHeaders);
        if (path === 'admin/warning' && method === 'POST') return await adminIssueWarning(request, db, corsHeaders);
        if (path === 'admin/reports' && method === 'GET') return await adminGetReports(request, db, corsHeaders);
        if (path.startsWith('admin/reports/') && path.endsWith('/status') && method === 'POST') {
            const reportId = path.split('/')[2];
            return await adminUpdateReportStatus(request, db, corsHeaders, reportId);
        }
        if (path.startsWith('admin/reports/') && method === 'DELETE') {
            const reportId = path.split('/')[2];
            return await adminDeleteReport(request, db, corsHeaders, reportId);
        }
        if (path === 'admin/group-messages' && method === 'GET') return await adminGetGroupMessages(request, db, corsHeaders);
        if (path === 'admin/change-password' && method === 'POST') return await adminChangePassword(request, db, corsHeaders);
        if (path === 'admin/leaderboard' && method === 'GET') return await adminGetLeaderboard(request, db, corsHeaders);

        // ---------- ADMIN COLLEGES ----------
        if (path === 'admin/colleges' && method === 'GET') return await adminGetColleges(request, db, corsHeaders);
        if (path === 'admin/colleges' && method === 'POST') return await adminCreateCollege(request, db, corsHeaders);
        if (path.startsWith('admin/colleges/') && path.endsWith('/toggle-status') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminToggleCollegeStatus(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/colleges/') && path.endsWith('/reset-admin-password') && method === 'POST') {
            const id = path.split('/')[2];
            return await adminResetCollegeAdminPassword(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/colleges/') && method === 'PUT') {
            const id = path.split('/')[2];
            return await adminUpdateCollege(request, db, corsHeaders, id);
        }
        if (path.startsWith('admin/colleges/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await adminDeleteCollege(request, db, corsHeaders, id);
        }

        // ============ COLLEGE ADMIN ROUTES ============
        if (path === 'college-admin/me' && method === 'GET') return await collegeAdminMe(request, db, corsHeaders);
        if (path === 'college-admin/dashboard' && method === 'GET') return await collegeAdminDashboard(request, db, corsHeaders);
        if (path === 'college-admin/analytics' && method === 'GET') return await collegeAdminAnalytics(request, db, corsHeaders);
        if (path === 'college-admin/students' && method === 'GET') return await collegeAdminGetStudents(request, db, corsHeaders);
        if (path === 'college-admin/students' && method === 'POST') return await collegeAdminAddStudent(request, db, corsHeaders);
        if (path === 'college-admin/students/export' && method === 'GET') return await collegeAdminExportStudents(request, db, corsHeaders);
        if (path.startsWith('college-admin/students/') && path.endsWith('/toggle-active') && method === 'POST') {
            const id = path.split('/')[2];
            return await collegeAdminToggleStudent(request, db, corsHeaders, id);
        }
        if (path.startsWith('college-admin/students/') && path.endsWith('/reset-password') && method === 'POST') {
            const id = path.split('/')[2];
            return await collegeAdminResetPassword(request, db, corsHeaders, id);
        }
        if (path.startsWith('college-admin/students/') && path.includes('/attempts/') && method === 'GET') {
            const parts = path.split('/');
            const studentId = parts[2];
            const attemptId = parts[4];
            return await collegeAdminGetTestReview(request, db, corsHeaders, studentId, attemptId);
        }
        if (path.startsWith('college-admin/students/') && method === 'GET') {
            const id = path.split('/')[2];
            return await collegeAdminGetStudentDetails(request, db, corsHeaders, id);
        }
        if (path.startsWith('college-admin/students/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await collegeAdminDeleteStudent(request, db, corsHeaders, id);
        }
        if (path === 'college-admin/warning' && method === 'POST') return await collegeAdminIssueWarning(request, db, corsHeaders);
        if (path === 'college-admin/notifications' && method === 'GET') return await collegeAdminGetNotifications(request, db, corsHeaders);
        if (path === 'college-admin/notifications' && method === 'POST') return await collegeAdminCreateNotification(request, db, corsHeaders);
        if (path.startsWith('college-admin/notifications/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await collegeAdminDeleteNotification(request, db, corsHeaders, id);
        }
        if (path === 'college-admin/leaderboard' && method === 'GET') return await collegeAdminGetLeaderboard(request, db, corsHeaders);
        if (path === 'college-admin/group-messages' && method === 'GET') return await collegeAdminGetGroupMessages(request, db, corsHeaders);
        if (path === 'college-admin/reports' && method === 'GET') return await collegeAdminGetReports(request, db, corsHeaders);
        if (path.startsWith('college-admin/reports/') && path.endsWith('/status') && method === 'POST') {
            const id = path.split('/')[2];
            return await collegeAdminUpdateReportStatus(request, db, corsHeaders, id);
        }
        if (path.startsWith('college-admin/reports/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await collegeAdminDeleteReport(request, db, corsHeaders, id);
        }
        if (path === 'college-admin/change-password' && method === 'POST') return await collegeAdminChangePassword(request, db, corsHeaders);

        // ---------- FILE UPLOAD ----------
        if (path === 'upload' && method === 'POST') return await handleFileUpload(request, db, env, corsHeaders);

        return json({ success: false, message: 'Endpoint not found: ' + path }, 404, corsHeaders);

    } catch (error) {
        console.error('API Error:', error);
        return json({ success: false, message: 'Server error', error: error.message }, 500, corsHeaders);
    }
}

// ============================================
// HELPERS
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
    return await db.prepare('SELECT * FROM sessions WHERE token = ?').bind(token).first();
}

async function getStudent(request, db) {
    const session = await getSession(request, db);
    if (!session || session.user_type !== 'student') return null;
    return await db.prepare('SELECT * FROM students WHERE id = ?').bind(session.user_id).first();
}

async function getAdmin(request, db) {
    const session = await getSession(request, db);
    if (!session || session.user_type !== 'admin') return null;
    return await db.prepare('SELECT * FROM admins WHERE id = ?').bind(session.user_id).first();
}

// Get college admin from token
async function getCollegeAdmin(request, db) {
    const session = await getSession(request, db);
    if (!session || session.user_type !== 'college_admin') return null;
    const college = await db.prepare('SELECT * FROM colleges WHERE id = ?').bind(session.college_id).first();
    if (!college) return null;
    return { session, college, college_id: session.college_id };
}

// Ensure college admin can only access their own college's data
function enforceCollegeScope(adminCollege, targetCollegeId, headers) {
    if (String(adminCollege) !== String(targetCollegeId)) {
        return json({ success: false, message: 'Access denied: outside your college scope' }, 403, headers);
    }
    return null;
}

function getAllowedFields(degreeCategory) {
    const mapping = {
        'Engineering':       ['Engineering', 'NET-Engineering'],
        'CS':                ['Engineering', 'NET-Engineering'],
        'Computing':         ['Engineering', 'NET-Engineering'],
        'Applied Sciences':  ['Applied Sciences', 'NET-Applied Sciences'],
        'Business':          ['Business', 'NET-Business Studies'],
        'Architecture':      ['Architecture', 'NET-Architecture'],
        'Natural Sciences':  ['Natural Sciences', 'NET-Natural Sciences']
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
// CLOUDINARY
// ============================================
async function uploadToCloudinary(env, file, folder) {
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error('Cloudinary not configured');

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    const dataUri = `data:${file.type};base64,${base64}`;

    const isImage = file.type.startsWith('image/');
    const resourceType = isImage ? 'image' : 'raw';

    const formData = new FormData();
    formData.append('file', dataUri);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `nustology/${folder}`);
    formData.append('resource_type', resourceType);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: 'POST', body: formData }
    );

    const result = await response.json();
    if (result.error) throw new Error('Cloudinary error: ' + result.error.message);

    return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        resourceType: result.resource_type,
        size: result.bytes
    };
}

async function deleteFromCloudinary(env, publicId) {
    if (!publicId) return;
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return;

    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(signatureStr);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('signature', signature);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);

        await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: 'POST', body: formData });
    } catch (e) { console.error('Cloudinary delete error:', e); }
}

function extractPublicId(url) {
    if (!url) return null;
    try {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
        return match ? match[1] : null;
    } catch (e) { return null; }
}

// ============================================
// AUTH
// ============================================
async function handleStudentLogin(request, db, headers) {
    const body = await request.json();
    const { username, password } = body;
    const accountType = body.accountType || 'private';

    if (!username || !password) {
        return json({ success: false, message: 'Username and password required' }, 400, headers);
    }

    // College Admin login
    if (accountType === 'college_admin') {
        const college = await db.prepare(
            'SELECT * FROM colleges WHERE admin_username = ? AND admin_password = ? AND status = "active"'
        ).bind(username, password).first();

        if (!college) {
            return json({ success: false, message: 'Invalid college admin credentials or college inactive' }, 401, headers);
        }

        const token = generateToken();
        await db.prepare(
            'INSERT INTO sessions (token, user_id, user_type, account_type, college_id) VALUES (?, ?, ?, ?, ?)'
        ).bind(token, college.id, 'college_admin', 'college_admin', college.id).run();

        return json({
            success: true, token,
            accountType: 'college_admin',
            college: {
                id: college.id,
                name: college.name,
                city: college.city,
                seatsTotal: college.seats_total,
                seatsUsed: college.seats_used
            }
        }, 200, headers);
    }

    // Private or College Student login
    const student = await db.prepare(
        'SELECT * FROM students WHERE username = ? AND password = ? AND is_active = 1'
    ).bind(username, password).first();

    if (!student) {
        return json({ success: false, message: 'Invalid credentials or account inactive' }, 401, headers);
    }

    if (!student.is_approved || student.approval_status !== 'approved') {
        return json({
            success: false,
            message: 'Your account is pending approval.',
            status: student.approval_status || 'pending'
        }, 403, headers);
    }

    // Validate account type matches
    const studentAccountType = student.account_type || 'private';
    if (accountType === 'college_student' && studentAccountType !== 'college_student') {
        return json({ success: false, message: 'This account is not a college student account.' }, 403, headers);
    }

    const token = generateToken();
    await db.prepare(
        'INSERT INTO sessions (token, user_id, user_type, account_type, college_id) VALUES (?, ?, ?, ?, ?)'
    ).bind(token, student.id, 'student', studentAccountType, student.college_id || null).run();

    await db.prepare('UPDATE students SET last_login = CURRENT_TIMESTAMP WHERE id = ?').bind(student.id).run();

    return json({
        success: true, token,
        accountType: studentAccountType,
        user: {
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
            accountType: studentAccountType,
            collegeId: student.college_id || null,
            preferredUniversity: student.preferred_university || null
        }
    }, 200, headers);
}

async function handleAdminLogin(request, db, headers) {
    const { username, password } = await request.json();
    const admin = await db.prepare(
        'SELECT * FROM admins WHERE username = ? AND password = ?'
    ).bind(username, password).first();

    if (!admin) return json({ success: false, message: 'Invalid admin credentials' }, 401, headers);

    const token = generateToken();
    await db.prepare(
        'INSERT INTO sessions (token, user_id, user_type, account_type, college_id) VALUES (?, ?, ?, ?, ?)'
    ).bind(token, admin.id, 'admin', 'platform_owner', null).run();

    return json({
        success: true, token,
        accountType: 'platform_owner',
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

    if (session.user_type === 'college_admin') {
        const college = await db.prepare('SELECT * FROM colleges WHERE id = ?').bind(session.college_id).first();
        if (!college) return json({ success: false }, 401, headers);
        return json({
            success: true,
            accountType: 'college_admin',
            college: {
                id: college.id, name: college.name, city: college.city,
                seatsTotal: college.seats_total, seatsUsed: college.seats_used
            }
        }, 200, headers);
    }

    if (session.user_type === 'admin') {
        const admin = await db.prepare('SELECT * FROM admins WHERE id = ?').bind(session.user_id).first();
        if (!admin) return json({ success: false }, 401, headers);
        return json({
            success: true,
            accountType: 'platform_owner',
            admin: { id: admin.id, username: admin.username }
        }, 200, headers);
    }

    // Student (private or college)
    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(session.user_id).first();
    if (!student) return json({ success: false }, 401, headers);

    return json({
        success: true,
        accountType: student.account_type || 'private',
        user: {
            id: student.id, username: student.username, fullName: student.full_name,
            email: student.email, phone: student.phone, profilePicture: student.profile_picture,
            profileComplete: student.profile_complete === 1, field: student.field,
            degreeCategory: student.degree_category, isApproved: student.is_approved === 1,
            approvalStatus: student.approval_status,
            accountType: student.account_type || 'private',
            collegeId: student.college_id || null,
            preferredUniversity: student.preferred_university || null
        }
    }, 200, headers);
}

async function handleStudentRegister(request, db, env, headers) {
    let data;
    try { data = await request.json(); }
    catch (e) { return json({ success: false, message: 'Invalid request data' }, 400, headers); }

    const required = ['fullName', 'email', 'phone', 'degreeCategory', 'desiredUsername', 'desiredPassword'];
    for (const field of required) {
        if (!data[field] || !String(data[field]).trim()) {
            return json({ success: false, message: `${field} is required` }, 400, headers);
        }
    }

    const existingStudent = await db.prepare('SELECT id FROM students WHERE username = ?').bind(data.desiredUsername.trim()).first();
    if (existingStudent) return json({ success: false, message: 'Username already taken.' }, 400, headers);

    const existingReg = await db.prepare('SELECT id, status FROM registrations WHERE desired_username = ?').bind(data.desiredUsername.trim()).first();
    if (existingReg && existingReg.status !== 'rejected') return json({ success: false, message: 'Username already taken.' }, 400, headers);

    const existingEmail = await db.prepare('SELECT id FROM students WHERE email = ?').bind(data.email.trim()).first();
    if (existingEmail) return json({ success: false, message: 'Email already registered.' }, 400, headers);

    const result = await db.prepare(`
        INSERT INTO registrations (
            full_name, email, phone, date_of_birth, gender,
            father_name, cnic, city, province, address,
            matric_marks, matric_total, matric_board, matric_year,
            fsc_marks, fsc_total, fsc_board, fsc_year, fsc_part,
            degree_category, preferred_university,
            preference_1, preference_2, preference_3, preference_4, preference_5,
            desired_username, desired_password,
            transaction_id, payment_screenshot_url, payment_method, payment_amount,
            payment_submitted_at, status
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
        data.fullName.trim(), data.email.trim(), data.phone.trim(),
        data.dateOfBirth || '', data.gender || '', data.fatherName || '',
        data.cnic || '', data.city || '', data.province || '', data.address || '',
        data.matricMarks || null, data.matricTotal || 1100, data.matricBoard || '', data.matricYear || '',
        data.fscMarks || null, data.fscTotal || 1100, data.fscBoard || '', data.fscYear || '', data.fscPart || '',
        data.degreeCategory, data.preferredUniversity || 'NUST',
        data.preference1 || '', data.preference2 || '', data.preference3 || '',
        data.preference4 || '', data.preference5 || '',
        data.desiredUsername.trim(), data.desiredPassword,
        data.transactionId || '', data.paymentScreenshotUrl || '', data.paymentMethod || '',
        data.paymentAmount || '500',
        data.transactionId ? new Date().toISOString() : null,
        'pending'
    ).run();

    const registrationId = result.meta.last_row_id;

    await db.prepare(`
        INSERT INTO payment_records (
            registration_id, transaction_id, payment_method,
            payment_amount, payment_screenshot_url, payment_date,
            verification_status, sender_name, sender_number
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).bind(
        registrationId, data.transactionId || '', data.paymentMethod || '',
        data.paymentAmount || '500', data.paymentScreenshotUrl || '',
        new Date().toISOString().split('T')[0],
        data.senderName || '', data.senderNumber || ''
    ).run().catch(async () => {
        await db.prepare(`
            INSERT INTO payment_records (
                registration_id, transaction_id, payment_method,
                payment_amount, payment_screenshot_url, payment_date, verification_status
            ) VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `).bind(
            registrationId, data.transactionId || '', data.paymentMethod || '',
            data.paymentAmount || '500', data.paymentScreenshotUrl || '',
            new Date().toISOString().split('T')[0]
        ).run();
    });

    return json({
        success: true,
        message: 'Registration submitted successfully! Please wait for admin approval.',
        registrationId
    }, 200, headers);
}

async function checkUsernameAvailability(request, db, headers) {
    const { username } = await request.json();
    if (!username) return json({ success: false, available: false }, 400, headers);
    const existingStudent = await db.prepare('SELECT id FROM students WHERE username = ?').bind(username.trim()).first();
    const existingReg = await db.prepare('SELECT id, status FROM registrations WHERE desired_username = ?').bind(username.trim()).first();
    const taken = !!existingStudent || (existingReg && existingReg.status !== 'rejected');
    return json({ success: true, available: !taken }, 200, headers);
}

async function getPaymentInfo(request, db, headers) {
    const settings = await db.prepare('SELECT key, value FROM settings').all();
    const settingsMap = {};
    for (const s of settings.results || []) settingsMap[s.key] = s.value;
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

async function handleForgotPassword(request, db, headers) {
    const { email, username } = await request.json();
    if (!email && !username) return json({ success: false, message: 'Email or username required' }, 400, headers);
    let student;
    if (email) student = await db.prepare('SELECT id, full_name, email, username FROM students WHERE email = ?').bind(email.trim()).first();
    else student = await db.prepare('SELECT id, full_name, email, username FROM students WHERE username = ?').bind(username.trim()).first();
    if (!student) return json({ success: true, message: 'If your account exists, admin has been notified.' }, 200, headers);
    await db.prepare(`INSERT INTO notifications (title, message, type, target_audience, created_by) VALUES (?, ?, 'system', 'all', 'system')`).bind(
        '🔐 Password Reset Request',
        `Student "${student.full_name}" (${student.username}, ${student.email}) has requested a password reset.`
    ).run();
    return json({ success: true, message: 'Password reset request submitted.' }, 200, headers);
}

// ============================================
// STUDENT PROFILE
// ============================================
async function getStudentProfile(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    const profile = await db.prepare('SELECT * FROM student_profiles WHERE student_id = ?').bind(student.id).first();
    const warnings = await db.prepare(`
        SELECT * FROM warnings WHERE student_id = ? AND is_read = 0
        AND datetime(issued_at) > datetime('now', '-2 days') ORDER BY issued_at DESC
    `).bind(student.id).all();

    // Notification count — scoped by account type
    let notifQuery, notifBinds;
    if ((student.account_type || 'private') === 'college_student' && student.college_id) {
        notifQuery = `SELECT COUNT(*) as count FROM notifications n
            WHERE n.is_active = 1
            AND (n.scope = 'all' OR n.scope = 'college' OR n.college_id = ?)
            AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
            AND n.id NOT IN (SELECT notification_id FROM notification_reads WHERE student_id = ?)`;
        notifBinds = [student.college_id, student.id];
    } else {
        notifQuery = `SELECT COUNT(*) as count FROM notifications n
            WHERE n.is_active = 1
            AND (n.scope IS NULL OR n.scope = 'all' OR n.scope = 'private' OR n.target_audience = ? OR n.target_audience = 'all')
            AND (n.college_id IS NULL)
            AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
            AND n.id NOT IN (SELECT notification_id FROM notification_reads WHERE student_id = ?)`;
        notifBinds = [student.degree_category || 'Engineering', student.id];
    }

    const unreadNotifCount = await db.prepare(notifQuery).bind(...notifBinds).first();

    return json({
        success: true,
        student: {
            id: student.id, username: student.username, fullName: student.full_name,
            email: student.email, phone: student.phone, profilePicture: student.profile_picture,
            profileComplete: student.profile_complete === 1, field: student.field,
            degreeCategory: student.degree_category, isApproved: student.is_approved === 1,
            approvalStatus: student.approval_status,
            accountType: student.account_type || 'private',
            collegeId: student.college_id || null,
            preferredUniversity: student.preferred_university || null,
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
    const existing = await db.prepare('SELECT id FROM student_profiles WHERE student_id = ?').bind(student.id).first();

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
            data.additionalNotes || '', student.id
        ).run();
    } else {
        await db.prepare(`
            INSERT INTO student_profiles (
                student_id, phone, district, city, province, address,
                date_of_birth, gender, father_name, father_occupation, cnic,
                matric_marks, matric_total, matric_board, matric_year, matric_grade,
                fsc_marks, fsc_total, fsc_board, fsc_year, fsc_part, fsc_grade,
                degree_category, preference_1, preference_2, preference_3, preference_4, preference_5,
                last_net_score, last_net_attempt, planning_net,
                target_university, target_field, target_score, preferred_campus, additional_notes
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

    await db.prepare('UPDATE students SET profile_complete = 1, field = ?, degree_category = ?, phone = ? WHERE id = ?').bind(
        data.targetField || student.field, data.degreeCategory || student.degree_category,
        data.phone || student.phone || '', student.id
    ).run();

    return json({ success: true, message: 'Profile updated' }, 200, headers);
}

async function updateAccount(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { fullName, email, profilePicture } = await request.json();
    await db.prepare('UPDATE students SET full_name = ?, email = ?, profile_picture = ? WHERE id = ?').bind(
        fullName || student.full_name, email || student.email,
        profilePicture !== undefined ? profilePicture : student.profile_picture, student.id
    ).run();
    return json({ success: true, message: 'Account updated' }, 200, headers);
}

async function changeStudentPassword(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { currentPassword, newPassword } = await request.json();
    if (student.password !== currentPassword) return json({ success: false, message: 'Current password incorrect' }, 400, headers);
    await db.prepare('UPDATE students SET password = ? WHERE id = ?').bind(newPassword, student.id).run();
    return json({ success: true, message: 'Password changed' }, 200, headers);
}

async function uploadProfilePicture(request, db, env, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file) return json({ success: false, message: 'No file provided' }, 400, headers);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) return json({ success: false, message: 'Only JPG, PNG, WebP allowed' }, 400, headers);
        if (file.size > 2 * 1024 * 1024) return json({ success: false, message: 'Image must be under 2MB' }, 400, headers);
        const result = await uploadToCloudinary(env, file, 'profile-pictures');
        if (student.profile_picture && student.profile_picture.includes('cloudinary.com')) {
            const oldPublicId = extractPublicId(student.profile_picture);
            if (oldPublicId) await deleteFromCloudinary(env, oldPublicId);
        }
        await db.prepare('UPDATE students SET profile_picture = ? WHERE id = ?').bind(result.url, student.id).run();
        return json({ success: true, url: result.url, message: 'Profile picture updated' }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

async function getStudentNotifications(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    let query, binds;
    if ((student.account_type || 'private') === 'college_student' && student.college_id) {
        query = `SELECT n.*, CASE WHEN nr.id IS NOT NULL THEN 1 ELSE 0 END as is_read
            FROM notifications n
            LEFT JOIN notification_reads nr ON n.id = nr.notification_id AND nr.student_id = ?
            WHERE n.is_active = 1
            AND (n.scope = 'all' OR n.scope = 'college' OR n.college_id = ?)
            AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
            ORDER BY n.created_at DESC LIMIT 50`;
        binds = [student.id, student.college_id];
    } else {
        query = `SELECT n.*, CASE WHEN nr.id IS NOT NULL THEN 1 ELSE 0 END as is_read
            FROM notifications n
            LEFT JOIN notification_reads nr ON n.id = nr.notification_id AND nr.student_id = ?
            WHERE n.is_active = 1
            AND (n.scope IS NULL OR n.scope = 'all' OR n.scope = 'private' OR n.target_audience = ? OR n.target_audience = 'all')
            AND (n.college_id IS NULL)
            AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
            ORDER BY n.created_at DESC LIMIT 50`;
        binds = [student.id, student.degree_category || 'Engineering'];
    }

    const notifications = await db.prepare(query).bind(...binds).all();
    return json({ success: true, notifications: notifications.results || [] }, 200, headers);
}

async function markNotificationRead(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { notificationId } = await request.json();
    await db.prepare('INSERT OR IGNORE INTO notification_reads (notification_id, student_id) VALUES (?, ?)').bind(notificationId, student.id).run();
    return json({ success: true }, 200, headers);
}

async function markAllNotificationsRead(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    let query, binds;
    if ((student.account_type || 'private') === 'college_student' && student.college_id) {
        query = `SELECT n.id FROM notifications n
            WHERE n.is_active = 1
            AND (n.scope = 'all' OR n.scope = 'college' OR n.college_id = ?)
            AND n.id NOT IN (SELECT notification_id FROM notification_reads WHERE student_id = ?)`;
        binds = [student.college_id, student.id];
    } else {
        query = `SELECT n.id FROM notifications n
            WHERE n.is_active = 1
            AND (n.scope IS NULL OR n.scope = 'all' OR n.scope = 'private' OR n.target_audience = ? OR n.target_audience = 'all')
            AND (n.college_id IS NULL)
            AND n.id NOT IN (SELECT notification_id FROM notification_reads WHERE student_id = ?)`;
        binds = [student.degree_category || 'Engineering', student.id];
    }
    const notifications = await db.prepare(query).bind(...binds).all();
    for (const notif of notifications.results || []) {
        await db.prepare('INSERT OR IGNORE INTO notification_reads (notification_id, student_id) VALUES (?, ?)').bind(notif.id, student.id).run();
    }
    return json({ success: true }, 200, headers);
}

async function getUnreadNotificationCount(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    let query, binds;
    if ((student.account_type || 'private') === 'college_student' && student.college_id) {
        query = `SELECT COUNT(*) as count FROM notifications n
            WHERE n.is_active = 1
            AND (n.scope = 'all' OR n.scope = 'college' OR n.college_id = ?)
            AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
            AND n.id NOT IN (SELECT notification_id FROM notification_reads WHERE student_id = ?)`;
        binds = [student.college_id, student.id];
    } else {
        query = `SELECT COUNT(*) as count FROM notifications n
            WHERE n.is_active = 1
            AND (n.scope IS NULL OR n.scope = 'all' OR n.scope = 'private' OR n.target_audience = ? OR n.target_audience = 'all')
            AND (n.college_id IS NULL)
            AND (n.expires_at IS NULL OR datetime(n.expires_at) > datetime('now'))
            AND n.id NOT IN (SELECT notification_id FROM notification_reads WHERE student_id = ?)`;
        binds = [student.degree_category || 'Engineering', student.id];
    }
    const result = await db.prepare(query).bind(...binds).first();
    return json({ success: true, count: result ? result.count : 0 }, 200, headers);
}

async function getStudentPaymentStatus(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const payment = await db.prepare('SELECT * FROM payment_records WHERE student_id = ? ORDER BY submitted_at DESC LIMIT 1').bind(student.id).first();
    return json({ success: true, payment: payment || null, approvalStatus: student.approval_status }, 200, headers);
}

// ============================================
// TESTS
// ============================================
async function startTest(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { testType, field, subject, totalQuestions, totalMarks, university } = await request.json();

    if (!canAccessField(student.degree_category || student.field, field)) {
        return json({
            success: false,
            message: `Access denied. Your category (${student.degree_category}) only allows ${getAllowedFields(student.degree_category).join(', ')}`
        }, 403, headers);
    }

    const result = await db.prepare(
        'INSERT INTO test_attempts (student_id, test_type, field, subject, total_questions, total_marks, university, status) VALUES (?, ?, ?, ?, ?, ?, ?, "in_progress")'
    ).bind(student.id, testType, field, subject || null, totalQuestions, totalMarks, university || null).run();

    return json({ success: true, attemptId: result.meta.last_row_id }, 200, headers);
}

async function submitTest(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { attemptId, answers, timeTaken } = await request.json();

    let correct = 0, wrong = 0, unattempted = 0, currentStreak = 0, maxStreak = 0;
    for (const ans of answers) {
        const isCorrect = ans.selectedAnswer !== null && ans.selectedAnswer === ans.correctAnswer;
        if (ans.selectedAnswer === null || ans.selectedAnswer === undefined) {
            unattempted++; currentStreak = 0;
        } else if (isCorrect) {
            correct++; currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
            wrong++; currentStreak = 0;
        }
        await db.prepare(
            `INSERT INTO test_answers (attempt_id, question_id, question_text, question_subject, options, correct_answer, selected_answer, is_correct, marked_for_review) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            attemptId, String(ans.questionId), ans.questionText || '', ans.subject || '',
            JSON.stringify(ans.options || []), ans.correctAnswer, ans.selectedAnswer ?? null,
            isCorrect ? 1 : 0, ans.markedForReview ? 1 : 0
        ).run();
    }

    const score = correct;
    const attempt = await db.prepare('SELECT * FROM test_attempts WHERE id = ?').bind(attemptId).first();
    const percentage = (score / attempt.total_marks) * 100;

    await db.prepare(
        `UPDATE test_attempts SET correct_answers = ?, wrong_answers = ?, unattempted = ?, score = ?, percentage = ?, time_taken = ?, max_streak = ?, completed_at = CURRENT_TIMESTAMP, status = 'completed' WHERE id = ?`
    ).bind(correct, wrong, unattempted, score, percentage, timeTaken || 0, maxStreak, attemptId).run();

    return json({
        success: true,
        result: { attemptId, correct, wrong, unattempted, score, percentage, totalQuestions: answers.length, maxStreak }
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
    const attempt = await db.prepare('SELECT * FROM test_attempts WHERE id = ? AND student_id = ?').bind(attemptId, student.id).first();
    if (!attempt) return json({ success: false, message: 'Test not found' }, 404, headers);
    const answers = await db.prepare('SELECT * FROM test_answers WHERE attempt_id = ? ORDER BY id ASC').bind(attemptId).all();
    const parsedAnswers = (answers.results || []).map(a => ({ ...a, options: JSON.parse(a.options || '[]') }));
    return json({ success: true, attempt, answers: parsedAnswers }, 200, headers);
}

async function checkTestAccess(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { field } = await request.json();
    const hasAccess = canAccessField(student.degree_category || student.field, field);
    return json({
        success: true, hasAccess,
        degreeCategory: student.degree_category,
        allowedFields: getAllowedFields(student.degree_category || 'Engineering')
    }, 200, headers);
}

// ============================================
// LEADERBOARD
// ============================================
async function getLeaderboard(request, db, headers) {
    const url = new URL(request.url);
    const field = url.searchParams.get('field') || 'all';
    const university = url.searchParams.get('university') || '';

    // Only show private students in public leaderboard
    let query = `SELECT s.id, s.username, s.full_name, s.profile_picture, s.field,
        MAX(t.score) as best_score, MAX(t.percentage) as best_percentage,
        COUNT(t.id) as total_tests, AVG(t.percentage) as avg_percentage
        FROM students s
        LEFT JOIN test_attempts t ON s.id = t.student_id AND t.status = 'completed'
        WHERE s.is_active = 1 AND (s.account_type IS NULL OR s.account_type = 'private')`;
    const binds = [];

    if (field !== 'all') { query += ' AND t.field = ?'; binds.push(field); }
    if (university) { query += ' AND t.university = ?'; binds.push(university); }
    query += ' GROUP BY s.id HAVING total_tests > 0 ORDER BY best_score DESC LIMIT 50';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, leaderboard: result.results || [] }, 200, headers);
}

async function getStreaks(request, db, headers) {
    const result = await db.prepare(`
        SELECT s.id, s.username, s.full_name, s.profile_picture, s.field,
        MAX(t.max_streak) as best_streak
        FROM students s
        LEFT JOIN test_attempts t ON s.id = t.student_id AND t.status = 'completed'
        WHERE s.is_active = 1 AND (s.account_type IS NULL OR s.account_type = 'private')
        GROUP BY s.id HAVING best_streak > 0 ORDER BY best_streak DESC LIMIT 50
    `).all();
    return json({ success: true, streaks: result.results || [] }, 200, headers);
}
// ============================================
// LECTURES
// ============================================
async function getLectures(request, db, headers) {
    const session = await getSession(request, db);
    const isAdmin = session && session.user_type === 'admin';

    const url = new URL(request.url);
    const field = url.searchParams.get('field');
    const subject = url.searchParams.get('subject');
    const university = url.searchParams.get('university') || '';

    let query = 'SELECT * FROM lectures WHERE 1=1';
    const binds = [];

    if (isAdmin) {
        if (field && field !== 'all') { query += ' AND field = ?'; binds.push(field); }
    } else {
        const student = await getStudent(request, db);
        if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
        const allowedFields = getAllowedFields(student.degree_category || student.field);

        if (field && field !== 'all') {
            if (!canAccessField(student.degree_category, field)) {
                return json({ success: false, message: 'Access denied for this field' }, 403, headers);
            }
            query += ' AND field = ?'; binds.push(field);
        } else {
            const placeholders = allowedFields.map(() => '?').join(', ');
            query += ` AND field IN (${placeholders})`;
            binds.push(...allowedFields);
        }
    }

    if (subject && subject !== 'all') { query += ' AND subject = ?'; binds.push(subject); }
    if (university) { query += ' AND (university = ? OR university IS NULL OR university = "")'; binds.push(university); }
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

    let cleanUrl = (data.youtubeUrl || '').trim();
    const urls = cleanUrl.match(/https?:\/\/[^\s]+/g);
    if (urls && urls.length > 0) {
        cleanUrl = urls[0];
        try {
            cleanUrl = decodeURIComponent(cleanUrl);
            const decodedUrls = cleanUrl.match(/https?:\/\/[^\s]+/g);
            if (decodedUrls && decodedUrls.length > 1) {
                const driveLink = decodedUrls.find(u => u.includes('drive.google.com'));
                const ytLink = decodedUrls.find(u => u.includes('youtube.com') || u.includes('youtu.be'));
                cleanUrl = driveLink || ytLink || decodedUrls[0];
            }
        } catch(e) {}
        cleanUrl = cleanUrl.split(/[\s]/)[0];
    }

    if (!cleanUrl) return json({ success: false, message: 'Invalid URL provided' }, 400, headers);

    let thumbnail = data.thumbnail || '';
    const videoIdMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
    if (videoIdMatch && !thumbnail) thumbnail = `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;

    await db.prepare(
        `INSERT INTO lectures (title, description, youtube_url, thumbnail, subject, field, topic, instructor, duration, difficulty, university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        data.title, data.description || '', cleanUrl, thumbnail,
        data.subject, data.field, data.topic || '', data.instructor || '',
        data.duration || '', data.difficulty || 'Medium', data.university || null
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
    const url = new URL(request.url);
    const university = url.searchParams.get('university') || '';
    let query = 'SELECT * FROM merit_lists WHERE 1=1';
    const binds = [];
    if (university) { query += ' AND (university = ? OR university IS NULL OR university = "")'; binds.push(university); }
    query += ' ORDER BY uploaded_at DESC';
    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();
    return json({ success: true, merit_lists: result.results || [] }, 200, headers);
}

async function addMeritList(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const data = await request.json();
    await db.prepare(
        `INSERT INTO merit_lists (title, field, year, program, campus, file_url, description, university) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        data.title, data.field, data.year, data.program || '',
        data.campus || '', data.fileUrl || '', data.description || '',
        data.university || null
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
    const university = url.searchParams.get('university') || '';
    const allowedFields = getAllowedFields(student.degree_category || student.field);

    let query = 'SELECT * FROM pdf_resources WHERE is_active = 1';
    const binds = [];

    if (field && field !== 'all') {
        if (!canAccessField(student.degree_category, field)) return json({ success: false, message: 'Access denied' }, 403, headers);
        query += ' AND field = ?'; binds.push(field);
    } else {
        const placeholders = allowedFields.map(() => '?').join(', ');
        query += ` AND field IN (${placeholders})`;
        binds.push(...allowedFields);
    }

    if (subject && subject !== 'all') { query += ' AND subject = ?'; binds.push(subject); }
    if (resourceType && resourceType !== 'all') { query += ' AND resource_type = ?'; binds.push(resourceType); }
    if (university) { query += ' AND (university = ? OR university IS NULL OR university = "")'; binds.push(university); }
    query += ' ORDER BY uploaded_at DESC';

    const result = await db.prepare(query).bind(...binds).all();
    return json({ success: true, pdfs: result.results || [] }, 200, headers);
}

async function incrementPdfDownload(request, db, headers, id) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    await db.prepare('UPDATE pdf_resources SET download_count = download_count + 1 WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
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
    const university = url.searchParams.get('university') || '';
    const allowedFields = getAllowedFields(student.degree_category || student.field);

    let query = 'SELECT * FROM note_resources WHERE is_active = 1';
    const binds = [];

    if (field && field !== 'all') {
        if (!canAccessField(student.degree_category, field)) return json({ success: false, message: 'Access denied' }, 403, headers);
        query += ' AND field = ?'; binds.push(field);
    } else {
        const placeholders = allowedFields.map(() => '?').join(', ');
        query += ` AND field IN (${placeholders})`;
        binds.push(...allowedFields);
    }

    if (subject && subject !== 'all') { query += ' AND subject = ?'; binds.push(subject); }
    if (noteType && noteType !== 'all') { query += ' AND note_type = ?'; binds.push(noteType); }
    if (university) { query += ' AND (university = ? OR university IS NULL OR university = "")'; binds.push(university); }
    query += ' ORDER BY uploaded_at DESC';

    const result = await db.prepare(query).bind(...binds).all();
    return json({ success: true, notes: result.results || [] }, 200, headers);
}

async function incrementNoteDownload(request, db, headers, id) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    await db.prepare('UPDATE note_resources SET download_count = download_count + 1 WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// CHAT — PUBLIC (Private Students Only)
// ============================================
async function getGroupMessages(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    // College students cannot access public chat
    if ((student.account_type || 'private') === 'college_student') {
        return json({ success: false, message: 'College students use the college chat.' }, 403, headers);
    }

    const result = await db.prepare(`
        SELECT m.*, s.username, s.full_name, s.profile_picture
        FROM group_messages m
        JOIN students s ON m.student_id = s.id
        WHERE (m.scope IS NULL OR m.scope = 'public')
        ORDER BY m.sent_at DESC LIMIT 100
    `).all();

    return json({ success: true, messages: (result.results || []).reverse() }, 200, headers);
}

async function sendGroupMessage(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    // College students cannot post in public chat
    if ((student.account_type || 'private') === 'college_student') {
        return json({ success: false, message: 'College students use the college chat.' }, 403, headers);
    }

    const { message } = await request.json();
    if (!message || !message.trim()) return json({ success: false }, 400, headers);
    await db.prepare(
        'INSERT INTO group_messages (student_id, message, scope, college_id) VALUES (?, ?, ?, ?)'
    ).bind(student.id, message.trim(), 'public', null).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// CHAT — COLLEGE (College Students Only)
// ============================================
async function getCollegeGroupMessages(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    if ((student.account_type || 'private') !== 'college_student' || !student.college_id) {
        return json({ success: false, message: 'Only college students can access college chat.' }, 403, headers);
    }

    const result = await db.prepare(`
        SELECT m.*, s.username, s.full_name, s.profile_picture
        FROM group_messages m
        JOIN students s ON m.student_id = s.id
        WHERE m.scope = 'college' AND m.college_id = ?
        ORDER BY m.sent_at DESC LIMIT 100
    `).bind(student.college_id).all();

    return json({ success: true, messages: (result.results || []).reverse() }, 200, headers);
}

async function sendCollegeGroupMessage(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    if ((student.account_type || 'private') !== 'college_student' || !student.college_id) {
        return json({ success: false, message: 'Only college students can post in college chat.' }, 403, headers);
    }

    const { message } = await request.json();
    if (!message || !message.trim()) return json({ success: false }, 400, headers);
    await db.prepare(
        'INSERT INTO group_messages (student_id, message, scope, college_id) VALUES (?, ?, ?, ?)'
    ).bind(student.id, message.trim(), 'college', student.college_id).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// CHAT — PRIVATE MESSAGES
// ============================================
async function getChatUsers(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    let query, binds;
    if ((student.account_type || 'private') === 'college_student' && student.college_id) {
        // College students only see their college peers
        query = 'SELECT id, username, full_name, profile_picture, field FROM students WHERE id != ? AND is_active = 1 AND college_id = ?';
        binds = [student.id, student.college_id];
    } else {
        // Private students only see other private students
        query = 'SELECT id, username, full_name, profile_picture, field FROM students WHERE id != ? AND is_active = 1 AND (account_type IS NULL OR account_type = "private")';
        binds = [student.id];
    }

    const result = await db.prepare(query).bind(...binds).all();
    return json({ success: true, users: result.results || [] }, 200, headers);
}

async function getPrivateMessages(request, db, headers, otherId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);

    // Verify the other user is in the same scope
    const otherStudent = await db.prepare('SELECT * FROM students WHERE id = ?').bind(otherId).first();
    if (!otherStudent) return json({ success: false, message: 'User not found' }, 404, headers);

    const myType = student.account_type || 'private';
    const otherType = otherStudent.account_type || 'private';

    if (myType === 'college_student' && (otherType !== 'college_student' || otherStudent.college_id !== student.college_id)) {
        return json({ success: false, message: 'Cannot message outside your college.' }, 403, headers);
    }
    if (myType === 'private' && otherType === 'college_student') {
        return json({ success: false, message: 'Cannot message college students.' }, 403, headers);
    }

    const result = await db.prepare(
        `SELECT * FROM private_messages WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) ORDER BY sent_at ASC`
    ).bind(student.id, otherId, otherId, student.id).all();

    await db.prepare('UPDATE private_messages SET is_read = 1 WHERE from_id = ? AND to_id = ?').bind(otherId, student.id).run();
    return json({ success: true, messages: result.results || [] }, 200, headers);
}

async function sendPrivateMessage(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { toId, message } = await request.json();
    if (!message || !message.trim()) return json({ success: false }, 400, headers);

    const otherStudent = await db.prepare('SELECT * FROM students WHERE id = ?').bind(toId).first();
    if (!otherStudent) return json({ success: false, message: 'User not found' }, 404, headers);

    const myType = student.account_type || 'private';
    const otherType = otherStudent.account_type || 'private';

    if (myType === 'college_student' && (otherType !== 'college_student' || otherStudent.college_id !== student.college_id)) {
        return json({ success: false, message: 'Cannot message outside your college.' }, 403, headers);
    }
    if (myType === 'private' && otherType === 'college_student') {
        return json({ success: false, message: 'Cannot message college students.' }, 403, headers);
    }

    await db.prepare('INSERT INTO private_messages (from_id, to_id, message) VALUES (?, ?, ?)').bind(student.id, toId, message.trim()).run();
    return json({ success: true }, 200, headers);
}

async function reportStudent(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { reportedId, reason, chatContext } = await request.json();

    const reportedStudent = await db.prepare('SELECT * FROM students WHERE id = ?').bind(reportedId).first();
    const collegeId = (student.account_type === 'college_student') ? student.college_id : null;

    await db.prepare(
        'INSERT INTO reports (reporter_id, reported_id, reason, chat_context, college_id) VALUES (?, ?, ?, ?, ?)'
    ).bind(student.id, reportedId, reason, chatContext || '', collegeId).run();

    return json({ success: true, message: 'Report submitted' }, 200, headers);
}

// ============================================
// POSTS
// ============================================
async function getPosts(request, db, headers) {
    const result = await db.prepare(
        `SELECT p.*, s.username, s.full_name, s.profile_picture FROM posts p JOIN students s ON p.student_id = s.id ORDER BY p.created_at DESC`
    ).all();
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
    const existing = await db.prepare('SELECT id FROM post_likes WHERE post_id = ? AND student_id = ?').bind(postId, student.id).first();
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
    const result = await db.prepare(
        `SELECT c.*, s.username, s.full_name, s.profile_picture FROM post_comments c JOIN students s ON c.student_id = s.id WHERE c.post_id = ? ORDER BY c.created_at ASC`
    ).bind(postId).all();
    return json({ success: true, comments: result.results || [] }, 200, headers);
}

async function addComment(request, db, headers, postId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const { comment } = await request.json();
    if (!comment || !comment.trim()) return json({ success: false }, 400, headers);
    await db.prepare('INSERT INTO post_comments (post_id, student_id, comment) VALUES (?, ?, ?)').bind(postId, student.id, comment.trim()).run();
    await db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').bind(postId).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// WARNINGS
// ============================================
async function getMyWarnings(request, db, headers) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    const result = await db.prepare(`
        SELECT * FROM warnings WHERE student_id = ? AND is_read = 0
        AND datetime(issued_at) > datetime('now', '-2 days') ORDER BY issued_at DESC
    `).bind(student.id).all();
    return json({ success: true, warnings: result.results || [] }, 200, headers);
}

async function dismissWarning(request, db, headers, warningId) {
    const student = await getStudent(request, db);
    if (!student) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    await db.prepare('UPDATE warnings SET is_read = 1 WHERE id = ? AND student_id = ?').bind(warningId, student.id).run();
    const remaining = await db.prepare(`
        SELECT COUNT(*) as count FROM warnings WHERE student_id = ? AND is_read = 0
        AND datetime(issued_at) > datetime('now', '-2 days')
    `).bind(student.id).first();
    if (remaining.count === 0) await db.prepare('UPDATE students SET is_warned = 0 WHERE id = ?').bind(student.id).run();
    return json({ success: true, message: 'Warning dismissed' }, 200, headers);
}

// ============================================
// FILE UPLOAD
// ============================================
async function handleFileUpload(request, db, env, headers) {
    const session = await getSession(request, db);
    if (!session) return json({ success: false, message: 'Unauthorized' }, 401, headers);
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'uploads';
        if (!file) return json({ success: false, message: 'No file provided' }, 400, headers);

        if (session.user_type !== 'admin') {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) return json({ success: false, message: 'Only images allowed' }, 400, headers);
            if (file.size > 2 * 1024 * 1024) return json({ success: false, message: 'File too large (max 2MB)' }, 400, headers);
        } else {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) return json({ success: false, message: 'Only PDF/images allowed' }, 400, headers);
            if (file.size > 20 * 1024 * 1024) return json({ success: false, message: 'File too large (max 20MB)' }, 400, headers);
        }

        const result = await uploadToCloudinary(env, file, folder);
        return json({
            success: true, url: result.url, publicId: result.publicId,
            fileName: file.name, fileSize: file.size, fileType: file.type
        }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

// ============================================
// PLATFORM OWNER — DASHBOARD
// ============================================
async function adminDashboard(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const totalStudents = await db.prepare('SELECT COUNT(*) as count FROM students WHERE account_type IS NULL OR account_type = "private"').first();
    const activeStudents = await db.prepare('SELECT COUNT(*) as count FROM students WHERE is_active = 1 AND is_approved = 1 AND (account_type IS NULL OR account_type = "private")').first();
    const totalColleges = await db.prepare('SELECT COUNT(*) as count FROM colleges').first();
    const activeColleges = await db.prepare('SELECT COUNT(*) as count FROM colleges WHERE status = "active"').first();
    const totalCollegeStudents = await db.prepare('SELECT COUNT(*) as count FROM students WHERE account_type = "college_student"').first();
    const pendingStudents = await db.prepare('SELECT COUNT(*) as count FROM registrations WHERE status = "pending"').first();
    const totalTests = await db.prepare('SELECT COUNT(*) as count FROM test_attempts WHERE status = "completed"').first();
    const pendingReports = await db.prepare('SELECT COUNT(*) as count FROM reports WHERE status = "pending" AND college_id IS NULL').first();
    const totalLectures = await db.prepare('SELECT COUNT(*) as count FROM lectures').first();
    const totalPdfs = await db.prepare('SELECT COUNT(*) as count FROM pdf_resources WHERE is_active = 1').first();
    const totalNotes = await db.prepare('SELECT COUNT(*) as count FROM note_resources WHERE is_active = 1').first();
    const pendingPayments = await db.prepare('SELECT COUNT(*) as count FROM payment_records WHERE verification_status = "pending"').first();
    const categoryStats = await db.prepare(`SELECT degree_category, COUNT(*) as count FROM students WHERE is_approved = 1 AND (account_type IS NULL OR account_type = 'private') GROUP BY degree_category`).all();
    const recentRegistrations = await db.prepare(`SELECT * FROM registrations ORDER BY submitted_at DESC LIMIT 5`).all();

    return json({
        success: true,
        stats: {
            totalStudents: totalStudents.count,
            activeStudents: activeStudents.count,
            totalColleges: totalColleges.count,
            activeColleges: activeColleges.count,
            totalCollegeStudents: totalCollegeStudents.count,
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

// ============================================
// PLATFORM OWNER — STUDENTS
// ============================================
async function adminGetStudents(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const status = url.searchParams.get('status') || '';
    const scope = url.searchParams.get('scope') || 'private'; // private | college | all
    const university = url.searchParams.get('university') || '';

    let query = `SELECT s.*,
        (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as test_count,
        (SELECT AVG(percentage) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_score
        FROM students s WHERE 1=1`;
    const binds = [];

    // Scope filter
    if (scope === 'private') {
        query += ' AND (s.account_type IS NULL OR s.account_type = "private")';
    } else if (scope === 'college') {
        query += ' AND s.account_type = "college_student"';
    }
    // scope = 'all' → no filter

    if (search) {
        query += ' AND (s.username LIKE ? OR s.full_name LIKE ? OR s.email LIKE ?)';
        binds.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) { query += ' AND s.degree_category = ?'; binds.push(category); }
    if (university) { query += ' AND s.preferred_university = ?'; binds.push(university); }
    if (status === 'active') query += ' AND s.is_active = 1 AND s.is_approved = 1';
    else if (status === 'inactive') query += ' AND s.is_active = 0';
    else if (status === 'pending') query += ' AND s.approval_status = "pending"';
    query += ' ORDER BY s.created_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, students: result.results || [] }, 200, headers);
}

async function adminGetStudentDetails(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    // Option A: College students are private — return friendly message
    if ((student.account_type || 'private') === 'college_student') {
        return json({
            success: false,
            restricted: true,
            message: 'College student details are private. Contact the College Admin for full reports.',
            basicInfo: {
                id: student.id,
                fullName: student.full_name,
                username: student.username,
                collegeId: student.college_id,
                degreeCategory: student.degree_category,
                accountType: 'college_student'
            }
        }, 403, headers);
    }

    const profile = await db.prepare('SELECT * FROM student_profiles WHERE student_id = ?').bind(id).first();
    const attempts = await db.prepare('SELECT * FROM test_attempts WHERE student_id = ? ORDER BY completed_at DESC').bind(id).all();
    const payments = await db.prepare('SELECT * FROM payment_records WHERE student_id = ? ORDER BY submitted_at DESC').bind(id).all();

    const completedAttempts = (attempts.results || []).filter(a => a.status === 'completed');
    let performanceScore = 0;
    if (completedAttempts.length > 0) {
        const avgPerc = completedAttempts.reduce((sum, a) => sum + a.percentage, 0) / completedAttempts.length;
        const consistency = Math.min(100, (completedAttempts.length / 10) * 100);
        performanceScore = Math.round((avgPerc * 0.7) + (consistency * 0.3));
    }

    const subjectPerformance = await db.prepare(`
        SELECT subject, AVG(percentage) as avg_percentage, COUNT(*) as total_attempts, MAX(percentage) as best_percentage
        FROM test_attempts WHERE student_id = ? AND status = 'completed' AND subject IS NOT NULL
        GROUP BY subject ORDER BY avg_percentage DESC
    `).bind(id).all();

    return json({
        success: true, student, profile,
        attempts: attempts.results || [],
        payments: payments.results || [],
        performanceScore,
        subjectPerformance: subjectPerformance.results || []
    }, 200, headers);
}

async function adminAddStudent(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const { username, password, fullName, email, field, degreeCategory } = await request.json();
    const existing = await db.prepare('SELECT id FROM students WHERE username = ?').bind(username).first();
    if (existing) return json({ success: false, message: 'Username already exists' }, 400, headers);
    const category = degreeCategory || field || 'Engineering';
    await db.prepare(
        'INSERT INTO students (username, password, full_name, email, field, degree_category, account_type, is_approved, approval_status) VALUES (?, ?, ?, ?, ?, ?, "private", 1, "approved")'
    ).bind(username, password, fullName || '', email || '', field || 'Engineering', category).run();
    return json({ success: true, message: 'Student added' }, 200, headers);
}

async function adminToggleStudentActive(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const student = await db.prepare('SELECT is_active, account_type FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);
    if ((student.account_type || 'private') === 'college_student') {
        return json({ success: false, message: 'Manage college students through the College Admin panel.' }, 403, headers);
    }
    const newStatus = student.is_active === 1 ? 0 : 1;
    await db.prepare('UPDATE students SET is_active = ? WHERE id = ?').bind(newStatus, id).run();
    return json({ success: true, isActive: newStatus === 1 }, 200, headers);
}

async function adminResetStudentPassword(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    let body;
    try { body = await request.json(); }
    catch (e) { return json({ success: false, message: 'Invalid request body' }, 400, headers); }

    const { newPassword } = body;
    if (!newPassword || newPassword.length < 6) {
        return json({ success: false, message: 'New password required (min 6 chars)' }, 400, headers);
    }

    const student = await db.prepare('SELECT id, username, account_type FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    if ((student.account_type || 'private') === 'college_student') {
        return json({ success: false, message: 'Manage college students through the College Admin panel.' }, 403, headers);
    }

    await db.prepare('UPDATE students SET password = ? WHERE id = ?').bind(newPassword, id).run();
    return json({ success: true, message: 'Password reset successfully', username: student.username }, 200, headers);
}

async function adminGetTestReview(request, db, headers, studentId, attemptId) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(studentId).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    if ((student.account_type || 'private') === 'college_student') {
        return json({
            success: false,
            restricted: true,
            message: 'College student test reviews are private. Contact the College Admin for full reports.'
        }, 403, headers);
    }

    const attempt = await db.prepare('SELECT * FROM test_attempts WHERE id = ? AND student_id = ?').bind(attemptId, studentId).first();
    if (!attempt) return json({ success: false, message: 'Test attempt not found' }, 404, headers);

    const answers = await db.prepare('SELECT * FROM test_answers WHERE attempt_id = ? ORDER BY id ASC').bind(attemptId).all();
    const parsedAnswers = (answers.results || []).map(a => {
        let options = [];
        try { options = JSON.parse(a.options || '[]'); } catch (e) {}
        return {
            id: a.id, question_id: a.question_id,
            question_text: a.question_text, question_subject: a.question_subject,
            options, correct_answer: a.correct_answer,
            student_answer: a.selected_answer, selected_answer: a.selected_answer,
            is_correct: a.is_correct === 1, marked_for_review: a.marked_for_review === 1
        };
    });

    return json({
        success: true, attempt, answers: parsedAnswers,
        student: { id: student.id, username: student.username, full_name: student.full_name, email: student.email }
    }, 200, headers);
}

async function adminDeleteStudent(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const student = await db.prepare('SELECT account_type FROM students WHERE id = ?').bind(id).first();
    if (student && (student.account_type || 'private') === 'college_student') {
        return json({ success: false, message: 'Delete college students through the College Admin panel.' }, 403, headers);
    }
    await db.prepare('DELETE FROM students WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

async function adminExportStudents(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const category = url.searchParams.get('category') || '';
    const scope = url.searchParams.get('scope') || 'private';

    let query = `SELECT s.id, s.username, s.full_name, s.email, s.phone, s.degree_category, s.field,
        s.account_type, s.preferred_university, s.is_active, s.is_approved, s.approval_status,
        s.created_at, s.last_login,
        sp.father_name, sp.gender, sp.date_of_birth, sp.cnic, sp.city, sp.province,
        sp.matric_marks, sp.matric_total, sp.matric_board, sp.matric_year,
        sp.fsc_marks, sp.fsc_total, sp.fsc_board, sp.fsc_year,
        sp.preference_1, sp.preference_2, sp.preference_3,
        (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as total_tests,
        (SELECT ROUND(AVG(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_score,
        (SELECT MAX(percentage) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as best_score
        FROM students s LEFT JOIN student_profiles sp ON s.id = sp.student_id WHERE 1=1`;
    const binds = [];

    if (scope === 'private') query += ' AND (s.account_type IS NULL OR s.account_type = "private")';
    else if (scope === 'college') query += ' AND s.account_type = "college_student"';

    if (category) { query += ' AND s.degree_category = ?'; binds.push(category); }
    query += ' ORDER BY s.created_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();
    const students = result.results || [];

    const csvHeaders = ['ID','Username','Full Name','Email','Phone','Degree Category','Field','Account Type','University','Active','Approved','Status','Registered At','Last Login','Father Name','Gender','DOB','CNIC','City','Province','Matric Marks','Matric Total','Matric Board','Matric Year','FSc Marks','FSc Total','FSc Board','FSc Year','Pref 1','Pref 2','Pref 3','Total Tests','Avg Score (%)','Best Score (%)'];
    const csvRows = [csvHeaders.join(',')];

    for (const s of students) {
        const row = [
            s.id, `"${(s.username||'').replace(/"/g,'""')}"`,
            `"${(s.full_name||'').replace(/"/g,'""')}"`,
            `"${(s.email||'').replace(/"/g,'""')}"`,
            `"${(s.phone||'').replace(/"/g,'""')}"`,
            `"${(s.degree_category||'').replace(/"/g,'""')}"`,
            `"${(s.field||'').replace(/"/g,'""')}"`,
            `"${(s.account_type||'private').replace(/"/g,'""')}"`,
            `"${(s.preferred_university||'').replace(/"/g,'""')}"`,
            s.is_active?'Yes':'No', s.is_approved?'Yes':'No',
            `"${(s.approval_status||'').replace(/"/g,'""')}"`,
            `"${(s.created_at||'').replace(/"/g,'""')}"`,
            `"${(s.last_login||'').replace(/"/g,'""')}"`,
            `"${(s.father_name||'').replace(/"/g,'""')}"`,
            `"${(s.gender||'').replace(/"/g,'""')}"`,
            `"${(s.date_of_birth||'').replace(/"/g,'""')}"`,
            `"${(s.cnic||'').replace(/"/g,'""')}"`,
            `"${(s.city||'').replace(/"/g,'""')}"`,
            `"${(s.province||'').replace(/"/g,'""')}"`,
            s.matric_marks||'', s.matric_total||'',
            `"${(s.matric_board||'').replace(/"/g,'""')}"`,
            `"${(s.matric_year||'').replace(/"/g,'""')}"`,
            s.fsc_marks||'', s.fsc_total||'',
            `"${(s.fsc_board||'').replace(/"/g,'""')}"`,
            `"${(s.fsc_year||'').replace(/"/g,'""')}"`,
            `"${(s.preference_1||'').replace(/"/g,'""')}"`,
            `"${(s.preference_2||'').replace(/"/g,'""')}"`,
            `"${(s.preference_3||'').replace(/"/g,'""')}"`,
            s.total_tests||0, s.avg_score||0, s.best_score||0
        ];
        csvRows.push(row.join(','));
    }

    return new Response(csvRows.join('\n'), {
        status: 200,
        headers: {
            ...headers,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="students_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
    });
}

// ============================================
// PLATFORM OWNER — REGISTRATIONS
// ============================================
async function adminGetRegistrations(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const search = url.searchParams.get('search') || '';
    let query = 'SELECT * FROM registrations WHERE 1=1';
    const binds = [];
    if (status) { query += ' AND status = ?'; binds.push(status); }
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
    const registration = await db.prepare('SELECT * FROM registrations WHERE id = ?').bind(id).first();
    if (!registration) return json({ success: false, message: 'Registration not found' }, 404, headers);
    const payment = await db.prepare('SELECT * FROM payment_records WHERE registration_id = ? ORDER BY submitted_at DESC LIMIT 1').bind(id).first();
    return json({ success: true, registration, payment: payment || null }, 200, headers);
}

async function adminApproveRegistration(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const registration = await db.prepare('SELECT * FROM registrations WHERE id = ?').bind(id).first();
    if (!registration) return json({ success: false, message: 'Registration not found' }, 404, headers);
    if (registration.status === 'approved') return json({ success: false, message: 'Already approved' }, 400, headers);

    const existing = await db.prepare('SELECT id FROM students WHERE username = ?').bind(registration.desired_username).first();
    if (existing) return json({ success: false, message: 'Username already taken.' }, 400, headers);

    const result = await db.prepare(
        `INSERT INTO students (username, password, full_name, email, phone, field, degree_category, account_type, preferred_university, is_active, is_approved, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'private', ?, 1, 1, 'approved')`
    ).bind(
        registration.desired_username, registration.desired_password,
        registration.full_name, registration.email, registration.phone,
        registration.degree_category, registration.degree_category,
        registration.preferred_university || 'NUST'
    ).run();

    const studentId = result.meta.last_row_id;

    await db.prepare(`
        INSERT INTO student_profiles (
            student_id, phone, city, province, address, date_of_birth, gender,
            father_name, cnic, matric_marks, matric_total, matric_board, matric_year,
            fsc_marks, fsc_total, fsc_board, fsc_year, fsc_part, degree_category,
            preference_1, preference_2, preference_3, preference_4, preference_5
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
        studentId, registration.phone || '', registration.city || '',
        registration.province || '', registration.address || '',
        registration.date_of_birth || '', registration.gender || '',
        registration.father_name || '', registration.cnic || '',
        registration.matric_marks || 0, registration.matric_total || 1100,
        registration.matric_board || '', registration.matric_year || '',
        registration.fsc_marks || 0, registration.fsc_total || 1100,
        registration.fsc_board || '', registration.fsc_year || '', registration.fsc_part || '',
        registration.degree_category || '',
        registration.preference_1 || '', registration.preference_2 || '',
        registration.preference_3 || '', registration.preference_4 || '', registration.preference_5 || ''
    ).run();

    await db.prepare(
        `UPDATE registrations SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, student_id = ? WHERE id = ?`
    ).bind(admin.username, studentId, id).run();

    await db.prepare(
        `UPDATE payment_records SET verification_status = 'verified', verified_by = ?, verified_at = CURRENT_TIMESTAMP, student_id = ? WHERE registration_id = ?`
    ).bind(admin.username, studentId, id).run();

    await db.prepare(
        `INSERT INTO notifications (title, message, type, target_audience, created_by) VALUES (?, ?, 'system', 'all', 'admin')`
    ).bind(
        'Registration Approved! 🎉',
        `Congratulations ${registration.full_name}! Your registration has been approved. Login with username: ${registration.desired_username}`
    ).run();

    return json({ success: true, message: 'Registration approved.', studentId }, 200, headers);
}

async function adminRejectRegistration(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const { reason } = await request.json();
    const registration = await db.prepare('SELECT * FROM registrations WHERE id = ?').bind(id).first();
    if (!registration) return json({ success: false, message: 'Not found' }, 404, headers);
    await db.prepare(
        `UPDATE registrations SET status = 'rejected', rejection_reason = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(reason || 'Rejected by admin', admin.username, id).run();
    await db.prepare(`UPDATE payment_records SET verification_status = 'rejected' WHERE registration_id = ?`).bind(id).run();
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
// PLATFORM OWNER — NOTIFICATIONS
// ============================================
async function adminGetNotifications(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const result = await db.prepare('SELECT * FROM notifications ORDER BY created_at DESC').all();
    return json({ success: true, notifications: result.results || [] }, 200, headers);
}

async function adminCreateNotification(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const data = await request.json();
    if (!data.title || !data.message) return json({ success: false, message: 'Title and message required' }, 400, headers);
    await db.prepare(
        `INSERT INTO notifications (title, message, type, target_audience, scope, created_by, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        data.title, data.message, data.type || 'announcement',
        data.targetAudience || data.target || 'all',
        data.scope || 'all',
        admin.username, data.expiresAt || null
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
// PLATFORM OWNER — PDFS
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

        if (!file || !title || !subject || !field) return json({ success: false, message: 'File, title, subject and field required' }, 400, headers);
        if (file.type !== 'application/pdf') return json({ success: false, message: 'Only PDF allowed' }, 400, headers);
        if (file.size > 20 * 1024 * 1024) return json({ success: false, message: 'PDF must be under 20MB' }, 400, headers);

        const result = await uploadToCloudinary(env, file, 'pdfs');
        const fileSizeKB = Math.round(file.size / 1024);

        await db.prepare(
            `INSERT INTO pdf_resources (title, description, file_url, file_name, file_size, subject, field, chapter, resource_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(title, description, result.url, file.name, `${fileSizeKB} KB`, subject, field, chapter, resourceType, admin.username).run();

        await db.prepare(
            `INSERT INTO notifications (title, message, type, target_audience, created_by) VALUES (?, ?, 'new_content', ?, ?)`
        ).bind(`New PDF: ${title}`, `New ${resourceType.replace('_', ' ')} for ${subject} (${field}).`, field, admin.username).run();

        return json({ success: true, message: 'PDF uploaded', url: result.url }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

async function adminAddPdfJson(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    let data;
    try { data = await request.json(); }
    catch (e) { return json({ success: false, message: 'Invalid JSON body' }, 400, headers); }

    const title = (data.title || '').trim();
    const fileUrl = (data.fileUrl || data.file_url || data.url || '').trim();
    const field = data.field || 'Engineering';
    const subject = data.subject || 'General';
    const resourceType = data.type || data.resource_type || 'past_paper';

    if (!title) return json({ success: false, message: 'Title is required' }, 400, headers);
    if (!fileUrl) return json({ success: false, message: 'File URL is required' }, 400, headers);

    await db.prepare(
        `INSERT INTO pdf_resources (title, description, file_url, file_name, file_size, subject, field, chapter, resource_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        title, data.description || '', fileUrl,
        data.fileName || data.file_name || title,
        data.fileSize || data.file_size || '',
        subject, field, data.chapter || data.year || '',
        resourceType, admin.username
    ).run();

    await db.prepare(
        `INSERT INTO notifications (title, message, type, target_audience, created_by) VALUES (?, ?, 'new_content', ?, ?)`
    ).bind(`New PDF: ${title}`, `A new ${String(resourceType).replace('_', ' ')} has been uploaded for ${subject} (${field}).`, field, admin.username).run();

    return json({ success: true, message: 'PDF added successfully', url: fileUrl }, 200, headers);
}

async function adminDeletePdf(request, db, env, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const pdf = await db.prepare('SELECT * FROM pdf_resources WHERE id = ?').bind(id).first();
    if (!pdf) return json({ success: false, message: 'PDF not found' }, 404, headers);
    const publicId = extractPublicId(pdf.file_url);
    if (publicId) await deleteFromCloudinary(env, publicId);
    await db.prepare('DELETE FROM pdf_resources WHERE id = ?').bind(id).run();
    return json({ success: true, message: 'PDF deleted' }, 200, headers);
}

// ============================================
// PLATFORM OWNER — NOTES
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

        if (!file || !title || !subject || !field) return json({ success: false, message: 'File, title, subject and field required' }, 400, headers);
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) return json({ success: false, message: 'Only PDF and images allowed' }, 400, headers);
        if (file.size > 20 * 1024 * 1024) return json({ success: false, message: 'File must be under 20MB' }, 400, headers);

        const result = await uploadToCloudinary(env, file, 'notes');
        const fileSizeKB = Math.round(file.size / 1024);

        await db.prepare(
            `INSERT INTO note_resources (title, description, file_url, file_name, file_size, subject, field, chapter, note_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(title, description, result.url, file.name, `${fileSizeKB} KB`, subject, field, chapter, noteType, admin.username).run();

        await db.prepare(
            `INSERT INTO notifications (title, message, type, target_audience, created_by) VALUES (?, ?, 'new_content', ?, ?)`
        ).bind(`New Notes: ${title}`, `New ${noteType.replace('_', ' ')} for ${subject} (${field}).`, field, admin.username).run();

        return json({ success: true, message: 'Note uploaded', url: result.url }, 200, headers);
    } catch (e) {
        return json({ success: false, message: 'Upload failed: ' + e.message }, 500, headers);
    }
}

async function adminAddNoteJson(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    let data;
    try { data = await request.json(); }
    catch (e) { return json({ success: false, message: 'Invalid JSON body' }, 400, headers); }

    const title = (data.title || '').trim();
    const fileUrl = (data.fileUrl || data.file_url || data.url || '').trim();
    const field = data.field || 'Engineering';
    const subject = data.subject || 'General';
    const noteType = data.type || data.note_type || 'formula_sheet';

    if (!title) return json({ success: false, message: 'Title is required' }, 400, headers);
    if (!fileUrl) return json({ success: false, message: 'File URL is required' }, 400, headers);

    await db.prepare(
        `INSERT INTO note_resources (title, description, file_url, file_name, file_size, subject, field, chapter, note_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        title, data.description || '', fileUrl,
        data.fileName || data.file_name || title,
        data.fileSize || data.file_size || '',
        subject, field, data.chapter || '',
        noteType, admin.username
    ).run();

    await db.prepare(
        `INSERT INTO notifications (title, message, type, target_audience, created_by) VALUES (?, ?, 'new_content', ?, ?)`
    ).bind(`New Notes: ${title}`, `New ${String(noteType).replace('_', ' ')} for ${subject} (${field}).`, field, admin.username).run();

    return json({ success: true, message: 'Note added successfully', url: fileUrl }, 200, headers);
}

async function adminDeleteNote(request, db, env, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const note = await db.prepare('SELECT * FROM note_resources WHERE id = ?').bind(id).first();
    if (!note) return json({ success: false, message: 'Note not found' }, 404, headers);
    const publicId = extractPublicId(note.file_url);
    if (publicId) await deleteFromCloudinary(env, publicId);
    await db.prepare('DELETE FROM note_resources WHERE id = ?').bind(id).run();
    return json({ success: true, message: 'Note deleted' }, 200, headers);
}

// ============================================
// PLATFORM OWNER — SETTINGS & PAYMENTS
// ============================================
async function adminGetSettings(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const result = await db.prepare('SELECT key, value FROM settings').all();
    const settingsMap = {};
    for (const s of result.results || []) settingsMap[s.key] = s.value;
    return json({ success: true, settings: settingsMap }, 200, headers);
}

async function adminUpdateSettings(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
        await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(key, String(value)).run();
    }
    return json({ success: true, message: 'Settings updated' }, 200, headers);
}

async function adminGetPayments(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    let query = `SELECT pr.*, r.full_name, r.email, r.degree_category, r.desired_username
        FROM payment_records pr LEFT JOIN registrations r ON pr.registration_id = r.id WHERE 1=1`;
    const binds = [];
    if (status) { query += ' AND pr.verification_status = ?'; binds.push(status); }
    query += ' ORDER BY pr.submitted_at DESC';
    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();
    return json({ success: true, payments: result.results || [] }, 200, headers);
}

// ============================================
// PLATFORM OWNER — ANALYTICS
// ============================================
async function adminGetAnalytics(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const fieldFilter = url.searchParams.get('field') || '';
    const scope = url.searchParams.get('scope') || 'private';
    const university = url.searchParams.get('university') || '';

    const scopeFilter = scope === 'private'
        ? 'AND (s.account_type IS NULL OR s.account_type = "private")'
        : scope === 'college' ? 'AND s.account_type = "college_student"' : '';

    const totalStudents = await db.prepare(`SELECT COUNT(*) as count FROM students s WHERE 1=1 ${scopeFilter}`).first();
    const activeStudents = await db.prepare(`SELECT COUNT(*) as count FROM students s WHERE s.is_active = 1 AND s.is_approved = 1 ${scopeFilter}`).first();
    const pendingApprovals = await db.prepare('SELECT COUNT(*) as count FROM registrations WHERE status = "pending"').first();

    const categoryBreakdown = await db.prepare(`
        SELECT degree_category, COUNT(*) as count FROM students s
        WHERE is_approved = 1 ${scopeFilter} GROUP BY degree_category ORDER BY count DESC
    `).all();

    const totalTests = await db.prepare('SELECT COUNT(*) as count FROM test_attempts WHERE status = "completed"').first();
    const avgScore = await db.prepare('SELECT ROUND(AVG(percentage), 2) as avg FROM test_attempts WHERE status = "completed"').first();

    const testsOverTime = await db.prepare(`
        SELECT date(completed_at) as date, COUNT(*) as count
        FROM test_attempts WHERE status='completed' AND completed_at > datetime('now', '-30 days')
        GROUP BY date(completed_at) ORDER BY date ASC
    `).all();

    const scoreDistRaw = await db.prepare(`
        SELECT
        SUM(CASE WHEN percentage BETWEEN 0 AND 20 THEN 1 ELSE 0 END) as d1,
        SUM(CASE WHEN percentage BETWEEN 21 AND 40 THEN 1 ELSE 0 END) as d2,
        SUM(CASE WHEN percentage BETWEEN 41 AND 60 THEN 1 ELSE 0 END) as d3,
        SUM(CASE WHEN percentage BETWEEN 61 AND 80 THEN 1 ELSE 0 END) as d4,
        SUM(CASE WHEN percentage BETWEEN 81 AND 100 THEN 1 ELSE 0 END) as d5
        FROM test_attempts WHERE status = 'completed'
    `).first();
    const scoreDistribution = [
        scoreDistRaw?.d1 || 0, scoreDistRaw?.d2 || 0, scoreDistRaw?.d3 || 0,
        scoreDistRaw?.d4 || 0, scoreDistRaw?.d5 || 0
    ];

    const fieldDistRaw = await db.prepare(`
        SELECT degree_category, COUNT(*) as count FROM students s
        WHERE is_approved = 1 ${scopeFilter} GROUP BY degree_category
    `).all();
    const fieldDistribution = {};
    for (const r of fieldDistRaw.results || []) fieldDistribution[r.degree_category || 'Unknown'] = r.count;

    const subjectPerformance = await db.prepare(`
        SELECT subject, COUNT(*) as total_attempts,
        ROUND(AVG(percentage), 2) as avg_percentage,
        ROUND(MAX(percentage), 2) as best_percentage
        FROM test_attempts WHERE status = 'completed' AND subject IS NOT NULL AND subject != ''
        GROUP BY subject ORDER BY avg_percentage DESC LIMIT 15
    `).all();

    // Per-student analytics
    let studentsQuery = `SELECT s.id, s.username, s.full_name, s.degree_category, s.preferred_university,
        (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status='completed') as test_count,
        (SELECT ROUND(AVG(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status='completed') as avg_percentage,
        (SELECT ROUND(MAX(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status='completed') as best_percentage
        FROM students s WHERE s.is_approved = 1 AND s.is_active = 1 ${scopeFilter}`;
    const sBinds = [];
    if (fieldFilter) { studentsQuery += ' AND s.degree_category = ?'; sBinds.push(fieldFilter); }
    if (university) { studentsQuery += ' AND s.preferred_university = ?'; sBinds.push(university); }
    studentsQuery += ' ORDER BY avg_percentage DESC LIMIT 100';

    const studentsRes = sBinds.length
        ? await db.prepare(studentsQuery).bind(...sBinds).all()
        : await db.prepare(studentsQuery).all();

    const students = [];
    for (const s of studentsRes.results || []) {
        const subjPerf = await db.prepare(`
            SELECT subject, ROUND(AVG(percentage), 2) as avg_percentage, COUNT(*) as attempts
            FROM test_attempts WHERE student_id = ? AND status='completed'
            AND subject IS NOT NULL AND subject != '' GROUP BY subject
        `).bind(s.id).all();
        students.push({
            ...s,
            avg_percentage: s.avg_percentage || 0,
            best_percentage: s.best_percentage || 0,
            test_count: s.test_count || 0,
            subject_performance: subjPerf.results || []
        });
    }

    return json({
        success: true,
        students,
        testsOverTime: testsOverTime.results || [],
        scoreDistribution,
        fieldDistribution,
        subjectPerformance: subjectPerformance.results || [],
        analytics: {
            students: {
                total: totalStudents.count, active: activeStudents.count,
                pending: pendingApprovals.count, categoryBreakdown: categoryBreakdown.results || []
            },
            tests: { total: totalTests.count, avgScore: avgScore.avg || 0, subjectPerformance: subjectPerformance.results || [] }
        }
    }, 200, headers);
}

// ============================================
// PLATFORM OWNER — MISC
// ============================================
async function adminIssueWarning(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const { studentId, message, reportId } = await request.json();
    await db.prepare('INSERT INTO warnings (student_id, message) VALUES (?, ?)').bind(studentId, message).run();
    await db.prepare('UPDATE students SET is_warned = 1, warning_message = ? WHERE id = ?').bind(message, studentId).run();
    if (reportId) await db.prepare('UPDATE reports SET status = ?, admin_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?').bind('resolved', 'Warning issued', reportId).run();
    return json({ success: true }, 200, headers);
}

async function adminGetReports(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    // Platform owner only sees reports from private students (college_id IS NULL)
    const result = await db.prepare(`
        SELECT r.*, s1.username as reporter_username, s1.full_name as reporter_name,
        s2.username as reported_username, s2.full_name as reported_name
        FROM reports r
        JOIN students s1 ON r.reporter_id = s1.id
        JOIN students s2 ON r.reported_id = s2.id
        WHERE r.college_id IS NULL
        ORDER BY CASE r.status WHEN 'pending' THEN 1 WHEN 'reviewed' THEN 2 WHEN 'resolved' THEN 3 WHEN 'dismissed' THEN 4 ELSE 5 END, r.created_at DESC
    `).all();
    return json({ success: true, reports: result.results || [] }, 200, headers);
}

async function adminUpdateReportStatus(request, db, headers, reportId) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const { status, adminNote } = await request.json();
    const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    const newStatus = validStatuses.includes(status) ? status : 'reviewed';
    await db.prepare('UPDATE reports SET status = ?, admin_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?').bind(newStatus, adminNote || '', reportId).run();
    return json({ success: true, message: 'Status updated' }, 200, headers);
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
    // Platform owner only sees public chat (private students)
    const result = await db.prepare(`
        SELECT m.*, s.username, s.full_name FROM group_messages m
        JOIN students s ON m.student_id = s.id
        WHERE (m.scope IS NULL OR m.scope = 'public')
        ORDER BY m.sent_at DESC LIMIT 200
    `).all();
    return json({ success: true, messages: result.results || [] }, 200, headers);
}

async function adminChangePassword(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const { currentPassword, newPassword, newUsername } = await request.json();
    if (admin.password !== currentPassword) return json({ success: false, message: 'Current password incorrect' }, 400, headers);
    await db.prepare('UPDATE admins SET password = ?, username = ? WHERE id = ?').bind(newPassword, newUsername || admin.username, admin.id).run();
    return json({ success: true, message: 'Credentials updated' }, 200, headers);
}

async function adminGetLeaderboard(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const fields = ['Engineering', 'Applied Sciences', 'Business', 'Architecture', 'Natural Sciences'];
    const leaderboards = {};
    for (const field of fields) {
        const result = await db.prepare(`
            SELECT s.username, s.full_name, s.field, s.degree_category,
            MAX(t.score) as best_score, MAX(t.percentage) as best_percentage,
            COUNT(t.id) as total_tests, ROUND(AVG(t.percentage), 2) as avg_score
            FROM students s JOIN test_attempts t ON s.id = t.student_id
            WHERE t.status = 'completed' AND (t.field = ? OR t.field LIKE ?)
            AND (s.account_type IS NULL OR s.account_type = 'private')
            GROUP BY s.id ORDER BY best_score DESC LIMIT 20
        `).bind(field, `%${field}%`).all();
        leaderboards[field] = result.results || [];
    }
    return json({ success: true, leaderboards }, 200, headers);
}

// ============================================
// PLATFORM OWNER — COLLEGES
// ============================================
async function adminGetColleges(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    let query = `SELECT c.*,
        (SELECT COUNT(*) FROM students WHERE college_id = c.id AND account_type = 'college_student') as actual_students
        FROM colleges c WHERE 1=1`;
    const binds = [];

    if (search) {
        query += ' AND (c.name LIKE ? OR c.city LIKE ? OR c.admin_username LIKE ?)';
        binds.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) { query += ' AND c.status = ?'; binds.push(status); }
    query += ' ORDER BY c.created_at DESC';

    const result = binds.length
        ? await db.prepare(query).bind(...binds).all()
        : await db.prepare(query).all();

    return json({ success: true, colleges: result.results || [] }, 200, headers);
}

async function adminCreateCollege(request, db, headers) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const data = await request.json();
    const required = ['name', 'adminUsername', 'adminPassword'];
    for (const f of required) {
        if (!data[f] || !String(data[f]).trim()) {
            return json({ success: false, message: `${f} is required` }, 400, headers);
        }
    }

    // Check admin username uniqueness
    const existing = await db.prepare('SELECT id FROM colleges WHERE admin_username = ?').bind(data.adminUsername.trim()).first();
    if (existing) return json({ success: false, message: 'Admin username already taken.' }, 400, headers);

    const result = await db.prepare(`
        INSERT INTO colleges (
            name, city, contact_email, contact_phone,
            admin_username, admin_password,
            seats_total, seats_used, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).bind(
        data.name.trim(), data.city || '', data.contactEmail || '', data.contactPhone || '',
        data.adminUsername.trim(), data.adminPassword,
        data.seatsTotal || 50, data.status || 'active', data.notes || ''
    ).run();

    return json({ success: true, message: 'College created', collegeId: result.meta.last_row_id }, 200, headers);
}

async function adminUpdateCollege(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const data = await request.json();
    const college = await db.prepare('SELECT * FROM colleges WHERE id = ?').bind(id).first();
    if (!college) return json({ success: false, message: 'College not found' }, 404, headers);

    await db.prepare(`
        UPDATE colleges SET
        name = ?, city = ?, contact_email = ?, contact_phone = ?,
        admin_username = ?, admin_password = ?,
        seats_total = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).bind(
        data.name || college.name, data.city || college.city,
        data.contactEmail || college.contact_email, data.contactPhone || college.contact_phone,
        data.adminUsername || college.admin_username, data.adminPassword || college.admin_password,
        data.seatsTotal || college.seats_total, data.status || college.status,
        data.notes || college.notes, id
    ).run();

    return json({ success: true, message: 'College updated' }, 200, headers);
}

async function adminToggleCollegeStatus(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const college = await db.prepare('SELECT status FROM colleges WHERE id = ?').bind(id).first();
    if (!college) return json({ success: false, message: 'College not found' }, 404, headers);
    const newStatus = college.status === 'active' ? 'inactive' : 'active';
    await db.prepare('UPDATE colleges SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(newStatus, id).run();
    return json({ success: true, status: newStatus }, 200, headers);
}

async function adminResetCollegeAdminPassword(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);
    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 6) return json({ success: false, message: 'Password too short (min 6 chars)' }, 400, headers);
    const college = await db.prepare('SELECT id FROM colleges WHERE id = ?').bind(id).first();
    if (!college) return json({ success: false, message: 'College not found' }, 404, headers);
    await db.prepare('UPDATE colleges SET admin_password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(newPassword, id).run();
    return json({ success: true, message: 'College admin password reset' }, 200, headers);
}

async function adminDeleteCollege(request, db, headers, id) {
    const admin = await getAdmin(request, db);
    if (!admin) return json({ success: false, message: 'Admin access required' }, 401, headers);

    const college = await db.prepare('SELECT * FROM colleges WHERE id = ?').bind(id).first();
    if (!college) return json({ success: false, message: 'College not found' }, 404, headers);

    const studentCount = await db.prepare('SELECT COUNT(*) as count FROM students WHERE college_id = ?').bind(id).first();
    if (studentCount.count > 0) {
        return json({
            success: false,
            message: `Cannot delete college with ${studentCount.count} active students. Remove all students first.`
        }, 400, headers);
    }

    await db.prepare('DELETE FROM colleges WHERE id = ?').bind(id).run();
    // Clean up sessions for this college's admin
    await db.prepare('DELETE FROM sessions WHERE college_id = ?').bind(id).run();
    return json({ success: true, message: 'College deleted' }, 200, headers);
}
// ============================================
// COLLEGE ADMIN — ME
// ============================================
async function collegeAdminMe(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const college = ca.college;
    const actualStudents = await db.prepare(
        'SELECT COUNT(*) as count FROM students WHERE college_id = ? AND account_type = "college_student"'
    ).bind(ca.college_id).first();

    return json({
        success: true,
        college: {
            id: college.id,
            name: college.name,
            city: college.city,
            contactEmail: college.contact_email,
            contactPhone: college.contact_phone,
            adminUsername: college.admin_username,
            seatsTotal: college.seats_total,
            seatsUsed: college.seats_used,
            actualStudents: actualStudents.count,
            status: college.status,
            notes: college.notes,
            createdAt: college.created_at
        }
    }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — DASHBOARD
// ============================================
async function collegeAdminDashboard(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;

    const totalStudents = await db.prepare(
        'SELECT COUNT(*) as count FROM students WHERE college_id = ? AND account_type = "college_student"'
    ).bind(collegeId).first();

    const activeStudents = await db.prepare(
        'SELECT COUNT(*) as count FROM students WHERE college_id = ? AND account_type = "college_student" AND is_active = 1'
    ).bind(collegeId).first();

    const totalTests = await db.prepare(`
        SELECT COUNT(*) as count FROM test_attempts ta
        JOIN students s ON ta.student_id = s.id
        WHERE s.college_id = ? AND ta.status = 'completed'
    `).bind(collegeId).first();

    const avgScore = await db.prepare(`
        SELECT ROUND(AVG(ta.percentage), 2) as avg FROM test_attempts ta
        JOIN students s ON ta.student_id = s.id
        WHERE s.college_id = ? AND ta.status = 'completed'
    `).bind(collegeId).first();

    const pendingReports = await db.prepare(
        'SELECT COUNT(*) as count FROM reports WHERE college_id = ? AND status = "pending"'
    ).bind(collegeId).first();

    const seatsTotal = ca.college.seats_total || 0;
    const seatsUsed = ca.college.seats_used || 0;
    const seatsRemaining = Math.max(0, seatsTotal - seatsUsed);

    // University distribution of students in this college
    const universityDist = await db.prepare(`
        SELECT preferred_university, COUNT(*) as count
        FROM students WHERE college_id = ? AND account_type = 'college_student'
        GROUP BY preferred_university ORDER BY count DESC
    `).bind(collegeId).all();

    // Recent test activity (last 10)
    const recentActivity = await db.prepare(`
        SELECT ta.*, s.username, s.full_name
        FROM test_attempts ta
        JOIN students s ON ta.student_id = s.id
        WHERE s.college_id = ? AND ta.status = 'completed'
        ORDER BY ta.completed_at DESC LIMIT 10
    `).bind(collegeId).all();

    return json({
        success: true,
        stats: {
            totalStudents: totalStudents.count,
            activeStudents: activeStudents.count,
            totalTests: totalTests.count,
            avgScore: avgScore.avg || 0,
            pendingReports: pendingReports.count,
            seatsTotal,
            seatsUsed,
            seatsRemaining
        },
        universityDistribution: universityDist.results || [],
        recentActivity: recentActivity.results || [],
        college: {
            id: ca.college.id,
            name: ca.college.name,
            city: ca.college.city
        }
    }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — ANALYTICS
// ============================================
async function collegeAdminAnalytics(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;
    const url = new URL(request.url);
    const university = url.searchParams.get('university') || '';

    // Tests over time (last 30 days)
    const testsOverTime = await db.prepare(`
        SELECT date(ta.completed_at) as date, COUNT(*) as count
        FROM test_attempts ta
        JOIN students s ON ta.student_id = s.id
        WHERE s.college_id = ? AND ta.status = 'completed'
        AND ta.completed_at > datetime('now', '-30 days')
        GROUP BY date(ta.completed_at) ORDER BY date ASC
    `).bind(collegeId).all();

    // Score distribution
    const scoreDistRaw = await db.prepare(`
        SELECT
        SUM(CASE WHEN ta.percentage BETWEEN 0 AND 20 THEN 1 ELSE 0 END) as d1,
        SUM(CASE WHEN ta.percentage BETWEEN 21 AND 40 THEN 1 ELSE 0 END) as d2,
        SUM(CASE WHEN ta.percentage BETWEEN 41 AND 60 THEN 1 ELSE 0 END) as d3,
        SUM(CASE WHEN ta.percentage BETWEEN 61 AND 80 THEN 1 ELSE 0 END) as d4,
        SUM(CASE WHEN ta.percentage BETWEEN 81 AND 100 THEN 1 ELSE 0 END) as d5
        FROM test_attempts ta
        JOIN students s ON ta.student_id = s.id
        WHERE s.college_id = ? AND ta.status = 'completed'
    `).bind(collegeId).first();

    const scoreDistribution = [
        scoreDistRaw?.d1 || 0, scoreDistRaw?.d2 || 0, scoreDistRaw?.d3 || 0,
        scoreDistRaw?.d4 || 0, scoreDistRaw?.d5 || 0
    ];

    // Subject performance
    const subjectPerformance = await db.prepare(`
        SELECT ta.subject,
        COUNT(*) as total_attempts,
        ROUND(AVG(ta.percentage), 2) as avg_percentage,
        ROUND(MAX(ta.percentage), 2) as best_percentage
        FROM test_attempts ta
        JOIN students s ON ta.student_id = s.id
        WHERE s.college_id = ? AND ta.status = 'completed'
        AND ta.subject IS NOT NULL AND ta.subject != ''
        GROUP BY ta.subject ORDER BY avg_percentage DESC LIMIT 15
    `).bind(collegeId).all();

    // University distribution
    const universityDist = await db.prepare(`
        SELECT preferred_university, COUNT(*) as count
        FROM students WHERE college_id = ? AND account_type = 'college_student'
        GROUP BY preferred_university
    `).bind(collegeId).all();

    // Per-student weak/strong analysis
    let studentsQuery = `
        SELECT s.id, s.username, s.full_name, s.degree_category, s.preferred_university,
        (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as test_count,
        (SELECT ROUND(AVG(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_percentage,
        (SELECT ROUND(MAX(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as best_percentage
        FROM students s
        WHERE s.college_id = ? AND s.account_type = 'college_student' AND s.is_active = 1
    `;
    const sBinds = [collegeId];

    if (university) {
        studentsQuery += ' AND s.preferred_university = ?';
        sBinds.push(university);
    }
    studentsQuery += ' ORDER BY avg_percentage DESC LIMIT 100';

    const studentsRes = await db.prepare(studentsQuery).bind(...sBinds).all();
    const students = [];

    for (const s of studentsRes.results || []) {
        const subjPerf = await db.prepare(`
            SELECT subject,
            ROUND(AVG(percentage), 2) as avg_percentage,
            COUNT(*) as attempts
            FROM test_attempts
            WHERE student_id = ? AND status = 'completed'
            AND subject IS NOT NULL AND subject != ''
            GROUP BY subject ORDER BY avg_percentage ASC
        `).bind(s.id).all();

        const allSubjects = subjPerf.results || [];
        const weakSubjects = allSubjects.slice(0, 3);
        const strongSubjects = [...allSubjects].sort((a, b) => b.avg_percentage - a.avg_percentage).slice(0, 3);

        students.push({
            ...s,
            avg_percentage: s.avg_percentage || 0,
            best_percentage: s.best_percentage || 0,
            test_count: s.test_count || 0,
            subject_performance: allSubjects,
            weak_subjects: weakSubjects,
            strong_subjects: strongSubjects
        });
    }

    return json({
        success: true,
        testsOverTime: testsOverTime.results || [],
        scoreDistribution,
        subjectPerformance: subjectPerformance.results || [],
        universityDistribution: universityDist.results || [],
        students
    }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — STUDENTS (LIST)
// ============================================
async function collegeAdminGetStudents(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const university = url.searchParams.get('university') || '';
    const status = url.searchParams.get('status') || '';

    let query = `
        SELECT s.*,
        (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as test_count,
        (SELECT ROUND(AVG(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_score,
        (SELECT MAX(percentage) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as best_score
        FROM students s
        WHERE s.college_id = ? AND s.account_type = 'college_student'
    `;
    const binds = [collegeId];

    if (search) {
        query += ' AND (s.username LIKE ? OR s.full_name LIKE ? OR s.email LIKE ?)';
        binds.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (university) { query += ' AND s.preferred_university = ?'; binds.push(university); }
    if (status === 'active') query += ' AND s.is_active = 1';
    else if (status === 'inactive') query += ' AND s.is_active = 0';

    query += ' ORDER BY s.created_at DESC';

    const result = await db.prepare(query).bind(...binds).all();
    return json({ success: true, students: result.results || [] }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — ADD STUDENT
// ============================================
async function collegeAdminAddStudent(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;
    const college = ca.college;

    // Check seats
    if (college.seats_used >= college.seats_total) {
        return json({
            success: false,
            message: `Seat limit reached (${college.seats_total}/${college.seats_total}). Contact the platform owner to increase seats.`
        }, 400, headers);
    }

    const data = await request.json();
    const { username, password, fullName, email, degreeCategory, preferredUniversity } = data;

    if (!username || !password || !fullName) {
        return json({ success: false, message: 'Username, password and full name are required' }, 400, headers);
    }

    const existing = await db.prepare('SELECT id FROM students WHERE username = ?').bind(username.trim()).first();
    if (existing) return json({ success: false, message: 'Username already taken' }, 400, headers);

    await db.prepare(`
        INSERT INTO students (
            username, password, full_name, email, field,
            degree_category, account_type, college_id,
            preferred_university, is_active, is_approved, approval_status
        ) VALUES (?, ?, ?, ?, ?, ?, 'college_student', ?, ?, 1, 1, 'approved')
    `).bind(
        username.trim(), password, fullName.trim(),
        email || '', degreeCategory || 'Engineering',
        degreeCategory || 'Engineering',
        collegeId,
        preferredUniversity || 'NUST'
    ).run();

    // Increment seats_used
    await db.prepare(
        'UPDATE colleges SET seats_used = seats_used + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(collegeId).run();

    return json({ success: true, message: 'Student added successfully' }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — STUDENT DETAILS
// ============================================
async function collegeAdminGetStudentDetails(request, db, headers, id) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    // Enforce college scope
    if (String(student.college_id) !== String(collegeId)) {
        return json({ success: false, message: 'Access denied: student not in your college' }, 403, headers);
    }

    const profile = await db.prepare('SELECT * FROM student_profiles WHERE student_id = ?').bind(id).first();

    const attempts = await db.prepare(`
        SELECT * FROM test_attempts WHERE student_id = ? ORDER BY completed_at DESC
    `).bind(id).all();

    const completedAttempts = (attempts.results || []).filter(a => a.status === 'completed');

    let performanceScore = 0;
    if (completedAttempts.length > 0) {
        const avgPerc = completedAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completedAttempts.length;
        const consistency = Math.min(100, (completedAttempts.length / 10) * 100);
        performanceScore = Math.round((avgPerc * 0.7) + (consistency * 0.3));
    }

    const subjectPerformance = await db.prepare(`
        SELECT subject,
        ROUND(AVG(percentage), 2) as avg_percentage,
        COUNT(*) as total_attempts,
        ROUND(MAX(percentage), 2) as best_percentage
        FROM test_attempts
        WHERE student_id = ? AND status = 'completed' AND subject IS NOT NULL
        GROUP BY subject ORDER BY avg_percentage DESC
    `).bind(id).all();

    return json({
        success: true,
        student,
        profile: profile || null,
        attempts: attempts.results || [],
        performanceScore,
        subjectPerformance: subjectPerformance.results || []
    }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — TEST REVIEW
// ============================================
async function collegeAdminGetTestReview(request, db, headers, studentId, attemptId) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(studentId).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    // Enforce college scope
    if (String(student.college_id) !== String(collegeId)) {
        return json({ success: false, message: 'Access denied: student not in your college' }, 403, headers);
    }

    const attempt = await db.prepare(
        'SELECT * FROM test_attempts WHERE id = ? AND student_id = ?'
    ).bind(attemptId, studentId).first();
    if (!attempt) return json({ success: false, message: 'Test attempt not found' }, 404, headers);

    const answers = await db.prepare(
        'SELECT * FROM test_answers WHERE attempt_id = ? ORDER BY id ASC'
    ).bind(attemptId).all();

    const parsedAnswers = (answers.results || []).map(a => {
        let options = [];
        try { options = JSON.parse(a.options || '[]'); } catch (e) {}
        return {
            id: a.id,
            question_id: a.question_id,
            question_text: a.question_text,
            question_subject: a.question_subject,
            options,
            correct_answer: a.correct_answer,
            student_answer: a.selected_answer,
            selected_answer: a.selected_answer,
            is_correct: a.is_correct === 1,
            marked_for_review: a.marked_for_review === 1
        };
    });

    return json({
        success: true,
        attempt,
        answers: parsedAnswers,
        student: {
            id: student.id,
            username: student.username,
            full_name: student.full_name,
            email: student.email
        }
    }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — TOGGLE STUDENT ACTIVE
// ============================================
async function collegeAdminToggleStudent(request, db, headers, id) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    if (String(student.college_id) !== String(ca.college_id)) {
        return json({ success: false, message: 'Access denied: student not in your college' }, 403, headers);
    }

    const newStatus = student.is_active === 1 ? 0 : 1;
    await db.prepare('UPDATE students SET is_active = ? WHERE id = ?').bind(newStatus, id).run();
    return json({ success: true, isActive: newStatus === 1 }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — RESET STUDENT PASSWORD
// ============================================
async function collegeAdminResetPassword(request, db, headers, id) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    if (String(student.college_id) !== String(ca.college_id)) {
        return json({ success: false, message: 'Access denied: student not in your college' }, 403, headers);
    }

    let body;
    try { body = await request.json(); }
    catch (e) { return json({ success: false, message: 'Invalid request body' }, 400, headers); }

    const { newPassword } = body;
    if (!newPassword || newPassword.length < 6) {
        return json({ success: false, message: 'New password required (min 6 chars)' }, 400, headers);
    }

    await db.prepare('UPDATE students SET password = ? WHERE id = ?').bind(newPassword, id).run();
    return json({ success: true, message: 'Password reset successfully', username: student.username }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — DELETE STUDENT
// ============================================
async function collegeAdminDeleteStudent(request, db, headers, id) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!student) return json({ success: false, message: 'Student not found' }, 404, headers);

    if (String(student.college_id) !== String(ca.college_id)) {
        return json({ success: false, message: 'Access denied: student not in your college' }, 403, headers);
    }

    await db.prepare('DELETE FROM students WHERE id = ?').bind(id).run();

    // Decrement seats_used (don't go below 0)
    await db.prepare(`
        UPDATE colleges SET
        seats_used = MAX(0, seats_used - 1),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).bind(ca.college_id).run();

    return json({ success: true, message: 'Student deleted' }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — EXPORT STUDENTS (CSV)
// ============================================
async function collegeAdminExportStudents(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;
    const url = new URL(request.url);
    const university = url.searchParams.get('university') || '';

    let query = `
        SELECT s.id, s.username, s.full_name, s.email, s.phone,
        s.degree_category, s.preferred_university, s.is_active,
        s.created_at, s.last_login,
        sp.father_name, sp.gender, sp.date_of_birth, sp.city, sp.province,
        sp.matric_marks, sp.matric_total, sp.fsc_marks, sp.fsc_total,
        sp.preference_1, sp.preference_2, sp.preference_3,
        (SELECT COUNT(*) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as total_tests,
        (SELECT ROUND(AVG(percentage), 2) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as avg_score,
        (SELECT MAX(percentage) FROM test_attempts WHERE student_id = s.id AND status = 'completed') as best_score
        FROM students s
        LEFT JOIN student_profiles sp ON s.id = sp.student_id
        WHERE s.college_id = ? AND s.account_type = 'college_student'
    `;
    const binds = [collegeId];
    if (university) { query += ' AND s.preferred_university = ?'; binds.push(university); }
    query += ' ORDER BY s.created_at DESC';

    const result = await db.prepare(query).bind(...binds).all();
    const students = result.results || [];

    const csvHeaders = [
        'ID', 'Username', 'Full Name', 'Email', 'Phone',
        'Degree Category', 'Preferred University', 'Active',
        'Registered At', 'Last Login', 'Father Name', 'Gender', 'DOB',
        'City', 'Province', 'Matric Marks', 'Matric Total',
        'FSc Marks', 'FSc Total', 'Pref 1', 'Pref 2', 'Pref 3',
        'Total Tests', 'Avg Score (%)', 'Best Score (%)'
    ];
    const csvRows = [csvHeaders.join(',')];

    for (const s of students) {
        const row = [
            s.id,
            `"${(s.username || '').replace(/"/g, '""')}"`,
            `"${(s.full_name || '').replace(/"/g, '""')}"`,
            `"${(s.email || '').replace(/"/g, '""')}"`,
            `"${(s.phone || '').replace(/"/g, '""')}"`,
            `"${(s.degree_category || '').replace(/"/g, '""')}"`,
            `"${(s.preferred_university || '').replace(/"/g, '""')}"`,
            s.is_active ? 'Yes' : 'No',
            `"${(s.created_at || '').replace(/"/g, '""')}"`,
            `"${(s.last_login || '').replace(/"/g, '""')}"`,
            `"${(s.father_name || '').replace(/"/g, '""')}"`,
            `"${(s.gender || '').replace(/"/g, '""')}"`,
            `"${(s.date_of_birth || '').replace(/"/g, '""')}"`,
            `"${(s.city || '').replace(/"/g, '""')}"`,
            `"${(s.province || '').replace(/"/g, '""')}"`,
            s.matric_marks || '',
            s.matric_total || '',
            s.fsc_marks || '',
            s.fsc_total || '',
            `"${(s.preference_1 || '').replace(/"/g, '""')}"`,
            `"${(s.preference_2 || '').replace(/"/g, '""')}"`,
            `"${(s.preference_3 || '').replace(/"/g, '""')}"`,
            s.total_tests || 0,
            s.avg_score || 0,
            s.best_score || 0
        ];
        csvRows.push(row.join(','));
    }

    return new Response(csvRows.join('\n'), {
        status: 200,
        headers: {
            ...headers,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${ca.college.name.replace(/[^a-z0-9]/gi, '_')}_students_${new Date().toISOString().split('T')[0]}.csv"`
        }
    });
}

// ============================================
// COLLEGE ADMIN — ISSUE WARNING
// ============================================
async function collegeAdminIssueWarning(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const { studentId, message, reportId } = await request.json();
    if (!studentId || !message) return json({ success: false, message: 'Student ID and message required' }, 400, headers);

    // Verify student belongs to this college
    const student = await db.prepare('SELECT * FROM students WHERE id = ?').bind(studentId).first();
    if (!student || String(student.college_id) !== String(ca.college_id)) {
        return json({ success: false, message: 'Access denied: student not in your college' }, 403, headers);
    }

    await db.prepare('INSERT INTO warnings (student_id, message) VALUES (?, ?)').bind(studentId, message).run();
    await db.prepare('UPDATE students SET is_warned = 1, warning_message = ? WHERE id = ?').bind(message, studentId).run();

    if (reportId) {
        await db.prepare(
            'UPDATE reports SET status = "resolved", admin_note = "Warning issued", reviewed_at = CURRENT_TIMESTAMP WHERE id = ? AND college_id = ?'
        ).bind(reportId, ca.college_id).run();
    }

    return json({ success: true, message: 'Warning issued' }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — NOTIFICATIONS
// ============================================
async function collegeAdminGetNotifications(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    // College admin sees notifications they created for their college
    const result = await db.prepare(`
        SELECT * FROM notifications
        WHERE college_id = ?
        ORDER BY created_at DESC
    `).bind(ca.college_id).all();

    return json({ success: true, notifications: result.results || [] }, 200, headers);
}

async function collegeAdminCreateNotification(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const data = await request.json();
    if (!data.title || !data.message) {
        return json({ success: false, message: 'Title and message required' }, 400, headers);
    }

    await db.prepare(`
        INSERT INTO notifications (
            title, message, type, target_audience,
            scope, college_id, created_by, expires_at
        ) VALUES (?, ?, ?, ?, 'college', ?, ?, ?)
    `).bind(
        data.title, data.message,
        data.type || 'announcement',
        data.targetAudience || 'all',
        ca.college_id,
        ca.college.admin_username,
        data.expiresAt || null
    ).run();

    return json({ success: true, message: 'Notification sent to your college students' }, 200, headers);
}

async function collegeAdminDeleteNotification(request, db, headers, id) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    // Only delete notifications belonging to this college
    const notif = await db.prepare('SELECT * FROM notifications WHERE id = ?').bind(id).first();
    if (!notif) return json({ success: false, message: 'Notification not found' }, 404, headers);
    if (String(notif.college_id) !== String(ca.college_id)) {
        return json({ success: false, message: 'Access denied' }, 403, headers);
    }

    await db.prepare('DELETE FROM notifications WHERE id = ?').bind(id).run();
    await db.prepare('DELETE FROM notification_reads WHERE notification_id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — LEADERBOARD
// ============================================
async function collegeAdminGetLeaderboard(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const collegeId = ca.college_id;
    const url = new URL(request.url);
    const university = url.searchParams.get('university') || '';

    let query = `
        SELECT s.id, s.username, s.full_name, s.profile_picture,
        s.degree_category, s.preferred_university,
        MAX(ta.score) as best_score,
        MAX(ta.percentage) as best_percentage,
        COUNT(ta.id) as total_tests,
        ROUND(AVG(ta.percentage), 2) as avg_percentage
        FROM students s
        LEFT JOIN test_attempts ta ON s.id = ta.student_id AND ta.status = 'completed'
        WHERE s.college_id = ? AND s.account_type = 'college_student' AND s.is_active = 1
    `;
    const binds = [collegeId];

    if (university) {
        query += ' AND s.preferred_university = ?';
        binds.push(university);
    }

    query += ' GROUP BY s.id HAVING total_tests > 0 ORDER BY best_score DESC LIMIT 50';

    const result = await db.prepare(query).bind(...binds).all();
    return json({ success: true, leaderboard: result.results || [] }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — GROUP MESSAGES (College Chat)
// ============================================
async function collegeAdminGetGroupMessages(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const result = await db.prepare(`
        SELECT m.*, s.username, s.full_name, s.profile_picture
        FROM group_messages m
        JOIN students s ON m.student_id = s.id
        WHERE m.scope = 'college' AND m.college_id = ?
        ORDER BY m.sent_at DESC LIMIT 200
    `).bind(ca.college_id).all();

    return json({ success: true, messages: (result.results || []).reverse() }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — REPORTS
// ============================================
async function collegeAdminGetReports(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const result = await db.prepare(`
        SELECT r.*,
        s1.username as reporter_username, s1.full_name as reporter_name,
        s2.username as reported_username, s2.full_name as reported_name
        FROM reports r
        JOIN students s1 ON r.reporter_id = s1.id
        JOIN students s2 ON r.reported_id = s2.id
        WHERE r.college_id = ?
        ORDER BY
        CASE r.status
            WHEN 'pending' THEN 1
            WHEN 'reviewed' THEN 2
            WHEN 'resolved' THEN 3
            WHEN 'dismissed' THEN 4
            ELSE 5
        END, r.created_at DESC
    `).bind(ca.college_id).all();

    return json({ success: true, reports: result.results || [] }, 200, headers);
}

async function collegeAdminUpdateReportStatus(request, db, headers, id) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    // Verify report belongs to this college
    const report = await db.prepare('SELECT * FROM reports WHERE id = ?').bind(id).first();
    if (!report) return json({ success: false, message: 'Report not found' }, 404, headers);
    if (String(report.college_id) !== String(ca.college_id)) {
        return json({ success: false, message: 'Access denied' }, 403, headers);
    }

    const { status, adminNote } = await request.json();
    const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    const newStatus = validStatuses.includes(status) ? status : 'reviewed';

    await db.prepare(
        'UPDATE reports SET status = ?, admin_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(newStatus, adminNote || '', id).run();

    return json({ success: true, message: 'Report status updated' }, 200, headers);
}

async function collegeAdminDeleteReport(request, db, headers, id) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const report = await db.prepare('SELECT * FROM reports WHERE id = ?').bind(id).first();
    if (!report) return json({ success: false, message: 'Report not found' }, 404, headers);
    if (String(report.college_id) !== String(ca.college_id)) {
        return json({ success: false, message: 'Access denied' }, 403, headers);
    }

    await db.prepare('DELETE FROM reports WHERE id = ?').bind(id).run();
    return json({ success: true }, 200, headers);
}

// ============================================
// COLLEGE ADMIN — CHANGE PASSWORD
// ============================================
async function collegeAdminChangePassword(request, db, headers) {
    const ca = await getCollegeAdmin(request, db);
    if (!ca) return json({ success: false, message: 'College admin access required' }, 401, headers);

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
        return json({ success: false, message: 'Current and new password required' }, 400, headers);
    }
    if (newPassword.length < 6) {
        return json({ success: false, message: 'New password must be at least 6 characters' }, 400, headers);
    }

    const college = await db.prepare('SELECT * FROM colleges WHERE id = ?').bind(ca.college_id).first();
    if (college.admin_password !== currentPassword) {
        return json({ success: false, message: 'Current password incorrect' }, 400, headers);
    }

    await db.prepare(
        'UPDATE colleges SET admin_password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(newPassword, ca.college_id).run();

    return json({ success: true, message: 'Password changed successfully' }, 200, headers);
}
