import { sequelize, DataTypes, Model, Optional } from '../config/db';

export interface StudentAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  course: string;
  batch: string;
  studentCategory?: string | null;
  nic?: string | null;
  passport?: string | null;
  enrollmentDate: string;
  status: 'Pending' | 'Enrolled' | 'Registered' | 'Graduated' | 'Dropout';
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id' | 'enrollmentDate' | 'status' | 'studentCategory' | 'nic' | 'passport'> { }

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public dob!: string;
  public gender!: 'Male' | 'Female' | 'Other';
  public address!: string;
  public course!: string;
  public batch!: string;
  public studentCategory!: string | null;
  public nic!: string | null;
  public passport!: string | null;
  public enrollmentDate!: string;
  public status!: 'Pending' | 'Enrolled' | 'Registered' | 'Graduated' | 'Dropout';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Enrolled', 'Registered', 'Graduated', 'Dropout'),
      defaultValue: 'Pending',
    },
  },
  {
    sequelize,
    tableName: 'students',
  }
);

export default Student;
