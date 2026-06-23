import { sequelize, DataTypes, Model, Optional } from '../config/db';

// ============================================================
// GovPay Payment Status Types
// ============================================================
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'GOVPAY' | 'CASH' | 'BANK_TRANSFER';

export interface StudentPaymentAttributes {
  id: number;
  student_id: string;
  user_id?: number | null;
  course_batch_id?: number | null;
  registration_fee: number;
  course_fee: number;
  full_amount_payable: number;
  amount_paid: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_completed: boolean;
  payment_reference: string;
  transaction_id?: string | null;
  receipt_number?: string | null;
  paid_at?: Date | null;
  callback_response?: string | null; // Stored as JSON string for audit trail
  remarks?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface StudentPaymentCreationAttributes
  extends Optional<
    StudentPaymentAttributes,
    | 'id'
    | 'user_id'
    | 'course_batch_id'
    | 'amount_paid'
    | 'payment_method'
    | 'payment_status'
    | 'payment_completed'
    | 'transaction_id'
    | 'receipt_number'
    | 'paid_at'
    | 'callback_response'
    | 'remarks'
    | 'created_at'
    | 'updated_at'
  > {}

export class StudentPayment
  extends Model<StudentPaymentAttributes, StudentPaymentCreationAttributes>
  implements StudentPaymentAttributes
{
  public id!: number;
  public student_id!: string;
  public user_id!: number | null;
  public course_batch_id!: number | null;
  public registration_fee!: number;
  public course_fee!: number;
  public full_amount_payable!: number;
  public amount_paid!: number;
  public payment_method!: PaymentMethod;
  public payment_status!: PaymentStatus;
  public payment_completed!: boolean;
  public payment_reference!: string;
  public transaction_id!: string | null;
  public receipt_number!: string | null;
  public paid_at!: Date | null;
  public callback_response!: string | null;
  public remarks!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

StudentPayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'References students.id (UUID)',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'References users.id if available',
    },
    course_batch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'References course batch if available',
    },
    registration_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    course_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    full_amount_payable: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'registration_fee + course_fee',
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    payment_method: {
      type: DataTypes.ENUM('GOVPAY', 'CASH', 'BANK_TRANSFER'),
      allowNull: false,
      defaultValue: 'GOVPAY',
    },
    payment_status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    payment_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    payment_reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique reference: STU-PAY-YYYYMMDD-STUDENTID-RANDOM',
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'GovPay transaction ID received on callback',
    },
    receipt_number: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Auto-generated receipt number after payment',
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    callback_response: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Full GovPay callback JSON for audit purposes',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'student_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default StudentPayment;
