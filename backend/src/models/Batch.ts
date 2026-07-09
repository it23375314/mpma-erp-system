import { sequelize, DataTypes, Model, Optional } from '../config/db';

export interface BatchAttributes {
  id: string;
  batchCode: string;
  courseId: string;
  startDate: string;
  endDate: string;
  location: string;
  maxStudents: number;
  currentStudents: number;
  status: 'Available' | 'Full' | 'Completed';
}

interface BatchCreationAttributes extends Optional<BatchAttributes, 'id' | 'currentStudents' | 'status'> {}

export class Batch extends Model<BatchAttributes, BatchCreationAttributes> implements BatchAttributes {
  public id!: string;
  public batchCode!: string;
  public courseId!: string;
  public startDate!: string;
  public endDate!: string;
  public location!: string;
  public maxStudents!: number;
  public currentStudents!: number;
  public status!: 'Available' | 'Full' | 'Completed';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Batch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    batchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('Available', 'Full', 'Completed'),
      defaultValue: 'Available',
    },
  },
  {
    sequelize,
    tableName: 'batches',
  }
);

export default Batch;
