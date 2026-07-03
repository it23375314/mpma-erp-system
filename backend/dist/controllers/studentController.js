"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getStudentsPdfReport = exports.getStudents = exports.enrollStudent = void 0;
const sequelize_1 = require("sequelize");
const pdfkit_1 = __importDefault(require("pdfkit"));
const Student_1 = __importDefault(require("../models/Student"));
const StudentPayment_1 = __importDefault(require("../models/StudentPayment"));
const paymentHelpers_1 = require("../utils/paymentHelpers");
const emailService_1 = require("../services/emailService");
const DEFAULT_REGISTRATION_FEE = 2500;
const DEFAULT_COURSE_FEE = 25000;
const getRegistrationStatus = (student, payment) => {
    if (student.status === 'Dropout' || (payment === null || payment === void 0 ? void 0 : payment.payment_status) === 'CANCELLED') {
        return 'Cancelled';
    }
    if (student.status === 'Registered') {
        return 'Registered';
    }
    return 'Pending Payment';
};
const attachLatestPayments = (students) => __awaiter(void 0, void 0, void 0, function* () {
    if (students.length === 0)
        return [];
    const studentIds = students.map((s) => s.id);
    const payments = yield StudentPayment_1.default.findAll({
        where: { student_id: { [sequelize_1.Op.in]: studentIds } },
        order: [['created_at', 'DESC']],
    });
    const latestByStudent = new Map();
    for (const payment of payments) {
        if (!latestByStudent.has(payment.student_id)) {
            latestByStudent.set(payment.student_id, payment);
        }
    }
    return students.map((student) => (Object.assign(Object.assign({}, student.toJSON()), { latestPayment: latestByStudent.get(student.id) || null, registrationStatus: getRegistrationStatus(student, latestByStudent.get(student.id)) })));
});
const normalizeQueryValue = (value) => String(value || '').trim();
const formatReportDate = (value) => {
    if (!value)
        return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-LK');
};
const buildStudentFilters = (query) => {
    const { search, category, course_id, batch_id, payment_status, registration_status, from_date, to_date, status, } = query;
    const where = {};
    const statusValue = normalizeQueryValue(status);
    if (statusValue) {
        const statuses = statusValue
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        if (statuses.length > 0) {
            where.status = { [sequelize_1.Op.in]: statuses };
        }
    }
    const categoryValue = normalizeQueryValue(category);
    if (categoryValue && categoryValue !== 'All') {
        where.studentCategory = categoryValue;
    }
    const courseValue = normalizeQueryValue(course_id);
    if (courseValue) {
        where.course = courseValue;
    }
    const batchValue = normalizeQueryValue(batch_id);
    if (batchValue) {
        where.batch = batchValue;
    }
    const fromDate = normalizeQueryValue(from_date);
    const toDate = normalizeQueryValue(to_date);
    if (fromDate || toDate) {
        const dateFilter = {};
        if (fromDate)
            dateFilter[sequelize_1.Op.gte] = fromDate;
        if (toDate)
            dateFilter[sequelize_1.Op.lte] = toDate;
        where.enrollmentDate = dateFilter;
    }
    return {
        where,
        search: normalizeQueryValue(search).toLowerCase(),
        paymentStatus: normalizeQueryValue(payment_status).toUpperCase(),
        registrationStatus: normalizeQueryValue(registration_status),
        appliedFilters: {
            search: normalizeQueryValue(search) || 'All',
            category: categoryValue || 'All',
            course: courseValue || 'All',
            batch: batchValue || 'All',
            paymentStatus: normalizeQueryValue(payment_status) || 'All',
            registrationStatus: normalizeQueryValue(registration_status) || 'All',
            fromDate: fromDate || 'All',
            toDate: toDate || 'All',
        },
    };
};
const getFilteredStudents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = buildStudentFilters(query);
    const students = yield Student_1.default.findAll({
        where: filters.where,
        order: [['createdAt', 'DESC']],
    });
    let studentsWithPayments = yield attachLatestPayments(students);
    if (filters.search) {
        studentsWithPayments = studentsWithPayments.filter((student) => {
            var _a;
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
            const nic = String(student.nic || '').toLowerCase();
            const passport = String(student.passport || '').toLowerCase();
            const paymentReference = String(((_a = student.latestPayment) === null || _a === void 0 ? void 0 : _a.payment_reference) || '').toLowerCase();
            return (fullName.includes(filters.search) ||
                nic.includes(filters.search) ||
                passport.includes(filters.search) ||
                paymentReference.includes(filters.search));
        });
    }
    if (filters.paymentStatus && filters.paymentStatus !== 'ALL') {
        studentsWithPayments = studentsWithPayments.filter((student) => { var _a; return ((_a = student.latestPayment) === null || _a === void 0 ? void 0 : _a.payment_status) === filters.paymentStatus; });
    }
    if (filters.registrationStatus && filters.registrationStatus !== 'All') {
        studentsWithPayments = studentsWithPayments.filter((student) => student.registrationStatus === filters.registrationStatus);
    }
    return { students: studentsWithPayments, appliedFilters: filters.appliedFilters };
});
const enrollStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, dob, gender, address, course, batch, studentCategory, nic, idNumber, passport, passportNumber, registration_fee: registrationFeeInput, course_fee: courseFeeInput, } = req.body;
        const existingStudent = yield Student_1.default.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ message: 'A student with this email already exists.' });
        }
        const student = yield Student_1.default.create({
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            address,
            course,
            batch,
            studentCategory: studentCategory || null,
            nic: nic || idNumber || null,
            passport: passport || passportNumber || null,
            status: 'Enrolled',
        });
        const registration_fee = registrationFeeInput != null && registrationFeeInput !== ''
            ? Number(registrationFeeInput)
            : DEFAULT_REGISTRATION_FEE;
        const course_fee = courseFeeInput != null && courseFeeInput !== ''
            ? Number(courseFeeInput)
            : DEFAULT_COURSE_FEE;
        const full_amount_payable = (0, paymentHelpers_1.formatAmount)(registration_fee + course_fee);
        const payment_reference = (0, paymentHelpers_1.generatePaymentReference)(student.id);
        const payment = yield StudentPayment_1.default.create({
            student_id: student.id,
            course_batch_id: null,
            registration_fee,
            course_fee,
            full_amount_payable,
            payment_reference,
            payment_status: 'PENDING',
            payment_completed: false,
            payment_method: 'GOVPAY',
        });
        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        const paymentPageUrl = `${frontendUrl}/student-management/payment?ref=${encodeURIComponent(payment_reference)}`;
        const studentName = `${firstName} ${lastName}`.trim();
        let emailSent = false;
        try {
            yield (0, emailService_1.sendEnrollmentPaymentEmail)(email, {
                studentName,
                studentCategory: studentCategory || 'Not specified',
                courseName: course,
                batchName: batch,
                paymentReference: payment_reference,
                registrationFee: registration_fee,
                courseFee: course_fee,
                totalAmount: full_amount_payable,
                paymentPageUrl,
            });
            emailSent = true;
        }
        catch (emailError) {
            console.error('Failed to send enrollment payment email:', (emailError === null || emailError === void 0 ? void 0 : emailError.message) || emailError);
        }
        const message = emailSent
            ? 'Student enrolled, pending payment created, and payment details emailed successfully'
            : 'Student enrolled and pending payment created successfully, but payment email could not be sent';
        res.status(201).json({
            message,
            student,
            payment,
            emailSent,
        });
    }
    catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.enrollStudent = enrollStudent;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { students } = yield getFilteredStudents(req.query);
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getStudents = getStudents;
const getStudentsPdfReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { students, appliedFilters } = yield getFilteredStudents(req.query);
        const doc = new pdfkit_1.default({ margin: 36, size: 'A4', layout: 'landscape' });
        const fileName = `student-management-report-${new Date().toISOString().slice(0, 10)}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        doc.pipe(res);
        doc
            .fontSize(18)
            .fillColor('#0f172a')
            .text('MPMA ERP System', { align: 'center' })
            .fontSize(14)
            .text('Student Management Report', { align: 'center' })
            .moveDown(0.5);
        doc.fontSize(9).fillColor('#475569');
        doc.text(`Generated: ${new Date().toLocaleString('en-LK')}`);
        doc.text(`Total student count: ${students.length}`);
        doc.moveDown(0.5);
        doc.fontSize(8).fillColor('#334155').text('Applied Filters', { underline: true });
        doc.fillColor('#64748b').text(`Search: ${appliedFilters.search} | Category: ${appliedFilters.category} | Course: ${appliedFilters.course} | Batch: ${appliedFilters.batch} | Payment: ${appliedFilters.paymentStatus} | Registration: ${appliedFilters.registrationStatus} | From: ${appliedFilters.fromDate} | To: ${appliedFilters.toDate}`);
        doc.moveDown(1);
        const headers = [
            'Student ID',
            'Name',
            'Category',
            'NIC/Passport',
            'Course',
            'Batch',
            'Payment',
            'Registration',
            'Registered Date',
        ];
        const widths = [72, 105, 105, 92, 105, 70, 72, 88, 72];
        const startX = doc.x;
        let y = doc.y;
        const drawRow = (values, isHeader = false) => {
            let x = startX;
            const rowHeight = 30;
            if (y + rowHeight > doc.page.height - 36) {
                doc.addPage();
                y = 36;
            }
            doc
                .rect(startX, y, widths.reduce((sum, width) => sum + width, 0), rowHeight)
                .fill(isHeader ? '#0f172a' : '#ffffff')
                .strokeColor('#e2e8f0')
                .stroke();
            values.forEach((value, index) => {
                doc
                    .fillColor(isHeader ? '#ffffff' : '#0f172a')
                    .fontSize(isHeader ? 7 : 7)
                    .text(value || '-', x + 4, y + 7, {
                    width: widths[index] - 8,
                    height: rowHeight - 10,
                    ellipsis: true,
                });
                x += widths[index];
            });
            y += rowHeight;
        };
        drawRow(headers, true);
        students.forEach((student) => {
            var _a;
            drawRow([
                String(student.id).slice(0, 8).toUpperCase(),
                `${student.firstName} ${student.lastName}`.trim(),
                student.studentCategory || '-',
                student.nic || student.passport || '-',
                student.course,
                student.batch,
                ((_a = student.latestPayment) === null || _a === void 0 ? void 0 : _a.payment_status) || 'No Payment',
                student.registrationStatus,
                formatReportDate(student.enrollmentDate || student.createdAt),
            ]);
        });
        if (students.length === 0) {
            doc.moveDown(2).fillColor('#64748b').fontSize(10).text('No students found for the selected filters.');
        }
        doc.end();
    }
    catch (error) {
        console.error('Student PDF report error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: error.message || 'Server Error' });
        }
    }
});
exports.getStudentsPdfReport = getStudentsPdfReport;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield Student_1.default.findByPk(id, {
            include: [
                {
                    model: StudentPayment_1.default,
                    as: 'payments',
                    separate: true,
                    order: [['created_at', 'DESC']],
                },
            ],
        });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const studentJson = student.toJSON();
        const payments = studentJson.payments || [];
        res.json(Object.assign(Object.assign({}, studentJson), { latestPayment: payments[0] || null }));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getStudentById = getStudentById;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield Student_1.default.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const allowedFields = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'dob',
            'gender',
            'address',
            'course',
            'batch',
            'studentCategory',
            'nic',
            'passport',
            'status',
        ];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        if (req.body.idNumber !== undefined && updates.nic === undefined) {
            updates.nic = req.body.idNumber;
        }
        if (req.body.passportNumber !== undefined && updates.passport === undefined) {
            updates.passport = req.body.passportNumber;
        }
        if (updates.email && updates.email !== student.email) {
            const existingStudent = yield Student_1.default.findOne({
                where: {
                    email: updates.email,
                    id: { [sequelize_1.Op.ne]: id },
                },
            });
            if (existingStudent) {
                return res.status(400).json({ message: 'A student with this email already exists.' });
            }
        }
        yield student.update(updates);
        res.json({ message: 'Student updated successfully', student });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield Student_1.default.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        yield student.destroy();
        res.json({ message: 'Student deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.deleteStudent = deleteStudent;
