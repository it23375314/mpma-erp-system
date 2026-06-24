import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Student from '../models/Student';
import StudentPayment from '../models/StudentPayment';
import { generatePaymentReference, formatAmount } from '../utils/paymentHelpers';
import { sendEnrollmentPaymentEmail } from '../services/emailService';

const DEFAULT_REGISTRATION_FEE = 2500;
const DEFAULT_COURSE_FEE = 25000;

const attachLatestPayments = async (students: Student[]) => {
  if (students.length === 0) return [];

  const studentIds = students.map((s) => s.id);
  const payments = await StudentPayment.findAll({
    where: { student_id: { [Op.in]: studentIds } },
    order: [['created_at', 'DESC']],
  });

  const latestByStudent = new Map<string, StudentPayment>();
  for (const payment of payments) {
    if (!latestByStudent.has(payment.student_id)) {
      latestByStudent.set(payment.student_id, payment);
    }
  }

  return students.map((student) => ({
    ...student.toJSON(),
    latestPayment: latestByStudent.get(student.id) || null,
  }));
};

export const enrollStudent = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      address,
      course,
      batch,
      studentCategory,
      nic,
      idNumber,
      passport,
      passportNumber,
      registration_fee: registrationFeeInput,
      course_fee: courseFeeInput,
    } = req.body;

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: 'A student with this email already exists.' });
    }

    const student = await Student.create({
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

    const registration_fee =
      registrationFeeInput != null && registrationFeeInput !== ''
        ? Number(registrationFeeInput)
        : DEFAULT_REGISTRATION_FEE;
    const course_fee =
      courseFeeInput != null && courseFeeInput !== ''
        ? Number(courseFeeInput)
        : DEFAULT_COURSE_FEE;
    const full_amount_payable = formatAmount(registration_fee + course_fee);
    const payment_reference = generatePaymentReference(student.id);

    const payment = await StudentPayment.create({
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
      await sendEnrollmentPaymentEmail(email, {
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
    } catch (emailError: any) {
      console.error('Failed to send enrollment payment email:', emailError?.message || emailError);
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
  } catch (error: any) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const where: Record<string, unknown> = {};

    if (status) {
      const statuses = String(status)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (statuses.length > 0) {
        where.status = { [Op.in]: statuses };
      }
    }

    const students = await Student.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    const studentsWithPayments = await attachLatestPayments(students);
    res.json(studentsWithPayments);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id as string, {
      include: [
        {
          model: StudentPayment,
          as: 'payments',
          separate: true,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentJson = student.toJSON() as Student & { payments?: StudentPayment[] };
    const payments = studentJson.payments || [];

    res.json({
      ...studentJson,
      latestPayment: payments[0] || null,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id as string);

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
    ] as const;

    const updates: Record<string, unknown> = {};
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
      const existingStudent = await Student.findOne({
        where: {
          email: updates.email as string,
          id: { [Op.ne]: id as string },
        },
      });
      if (existingStudent) {
        return res.status(400).json({ message: 'A student with this email already exists.' });
      }
    }

    await student.update(updates);
    res.json({ message: 'Student updated successfully', student });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id as string);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
