import { sequelize, DataTypes, Model, Optional } from '../config/db';

export interface CourseAttributes {
  id: string;
  courseCode: string;
  courseName: string;
  stream: string;
  description?: string;
  duration: string;
  medium: string;
  location: string;
  maxParticipants: number;
  registrationFee: number;
  courseFee: number;
  status: 'Active' | 'Inactive';
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'status'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public courseCode!: string;
  public courseName!: string;
  public stream!: string;
  public description?: string;
  public duration!: string;
  public medium!: string;
  public location!: string;
  public maxParticipants!: number;
  public registrationFee!: number;
  public courseFee!: number;
  public status!: 'Active' | 'Inactive';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stream: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    medium: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    registrationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    courseFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
    },
  },
  {
    sequelize,
    tableName: 'courses',
  }
);

export default Course;
