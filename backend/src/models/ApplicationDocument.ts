import { sequelize, DataTypes, Model, Optional } from '../config/db';

export interface ApplicationDocumentAttributes {
  id: number;
  student_id: string;
  document_type: string;
  file_name: string;
  mime_type: string;
  file_data: Buffer;
  uploaded_by_admin: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface ApplicationDocumentCreationAttributes
  extends Optional<ApplicationDocumentAttributes, 'id' | 'uploaded_by_admin' | 'created_at' | 'updated_at'> {}

export class ApplicationDocument
  extends Model<ApplicationDocumentAttributes, ApplicationDocumentCreationAttributes>
  implements ApplicationDocumentAttributes
{
  public id!: number;
  public student_id!: string;
  public document_type!: string;
  public file_name!: string;
  public mime_type!: string;
  public file_data!: Buffer;
  public uploaded_by_admin!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ApplicationDocument.init(
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
    document_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g. NIC, Passport, Certificate, Photo',
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_data: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    uploaded_by_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'application_documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ApplicationDocument;
