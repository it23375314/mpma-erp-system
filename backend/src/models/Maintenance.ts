import { sequelize, DataTypes, Model } from '../config/db';

class Maintenance extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public facilityType!: 'Auditorium' | 'Classroom' | 'Transport' | 'General';
  public facilityId?: string; // Optional UUID if attached to specific entity
  public dateFrom!: string;
  public dateTo!: string;
  public timeFrom!: string;
  public timeTo!: string;
}

Maintenance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facilityType: {
      type: DataTypes.ENUM('Auditorium', 'Classroom', 'Transport', 'General'),
      allowNull: false,
      defaultValue: 'General',
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dateTo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    timeFrom: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    timeTo: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Maintenance',
    tableName: 'maintenances',
  }
);

export default Maintenance;
