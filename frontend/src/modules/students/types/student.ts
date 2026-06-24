export type StudentStatus = 'Pending' | 'Enrolled' | 'Registered' | 'Graduated' | 'Dropout';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface StudentPaymentSummary {
  id: number;
  student_id: string;
  registration_fee: number;
  course_fee: number;
  full_amount_payable: number;
  amount_paid: number;
  payment_method: string;
  payment_status: PaymentStatus;
  payment_completed: boolean;
  payment_reference: string;
  transaction_id?: string | null;
  receipt_number?: string | null;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StudentRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  course: string;
  batch: string;
  studentCategory?: string | null;
  nic?: string | null;
  passport?: string | null;
  enrollmentDate: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  latestPayment?: StudentPaymentSummary | null;
  payments?: StudentPaymentSummary[];
}

export const formatStudentId = (id: string): string => {
  return id.split('-')[0].toUpperCase();
};

export const getStudentFullName = (student: Pick<StudentRecord, 'firstName' | 'lastName'>): string => {
  return `${student.firstName} ${student.lastName}`.trim();
};

export const getNicOrPassport = (student: Pick<StudentRecord, 'nic' | 'passport'>): string => {
  if (student.nic) return student.nic;
  if (student.passport) return student.passport;
  return '—';
};
