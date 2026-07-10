import { sequelize, DataTypes, Model, Optional } from '../config/db';

export interface VerificationChecklistAttributes {
  id: number;
  student_id: string;
  identity_verified: boolean;
  documents_complete: boolean;
  eligibility_verified: boolean;
  course_available: boolean;
  checked_by?: string | null;
  checked_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

interface VerificationChecklistCreationAttributes
  extends Optional<
    VerificationChecklistAttributes,
    | 'id'
    | 'identity_verified'
    | 'documents_complete'
    | 'eligibility_verified'
    | 'course_available'
    | 'checked_by'
    | 'checked_at'
    | 'created_at'
    | 'updated_at'
  > {}

export class VerificationChecklist
  extends Model<VerificationChecklistAttributes, VerificationChecklistCreationAttributes>
  implements VerificationChecklistAttributes
{
  public id!: number;
  public student_id!: string;
  public identity_verified!: boolean;
  public documents_complete!: boolean;
  public eligibility_verified!: boolean;
  public course_available!: boolean;
  public checked_by!: string | null;
  public checked_at!: Date | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

VerificationChecklist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'One checklist per student application',
    },
    identity_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    documents_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    eligibility_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    course_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    checked_by: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    checked_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'verification_checklists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default VerificationChecklist;
