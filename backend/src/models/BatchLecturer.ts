import { sequelize, DataTypes, Model, Optional } from '../config/db';

export interface BatchLecturerAttributes {
  id: string;
  batchId: string;
  lecturerId: string;
}

interface BatchLecturerCreationAttributes extends Optional<BatchLecturerAttributes, 'id'> {}

export class BatchLecturer extends Model<BatchLecturerAttributes, BatchLecturerCreationAttributes> implements BatchLecturerAttributes {
  public id!: string;
  public batchId!: string;
  public lecturerId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BatchLecturer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    batchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lecturerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'batch_lecturers',
  }
);

export default BatchLecturer;
