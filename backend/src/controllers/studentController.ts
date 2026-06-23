import { Request, Response } from 'express';
import Student from '../models/Student';
import StudentPayment from '../models/StudentPayment';
import { generatePaymentReference, formatAmount } from '../utils/paymentHelpers';

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
      batch
    } = req.body;

    // Check if email already exists
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
      status: 'Enrolled' // Default to Enrolled for now
    });

    // ============================================================
    // AUTOMATIC PAYMENT RECORD CREATION
    // After student enrollment is completed, create a pending payment.
    // ============================================================
    const registration_fee = 2500; // Default or take from req.body
    const course_fee = 25000;     // Default or take from req.body
    const full_amount_payable = formatAmount(registration_fee + course_fee);
    const payment_reference = generatePaymentReference(student.id);

    await StudentPayment.create({
      student_id: student.id,
      course_batch_id: null, // Can be refined if batch id is available
      registration_fee,
      course_fee,
      full_amount_payable,
      payment_reference,
      payment_status: 'PENDING',
      payment_completed: false,
      payment_method: 'GOVPAY',
    });

    res.status(201).json({
      message: 'Student enrolled and pending payment created successfully',
      student,
      payment_reference
    });
  } catch (error: any) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(students);
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
