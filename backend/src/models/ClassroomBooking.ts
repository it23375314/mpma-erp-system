import { sequelize, DataTypes, Model } from '../config/db';

interface ClassroomBookingAttributes {
  id?: string;
  requestingOfficerName: string;
  designation: string;
  requestingOfficerEmail: string;
  courseName: string;
  audienceType: string;
  batchCode: string;
  numberOfParticipants: number;
  dateFrom: string;
  dateTo: string;
  courseCoordinator: string;
  timeFrom: string;
  timeTo: string;
  preferredDaysOfWeek: string[];
  paidCourse: string;
  classroomId: string;
  exam: string;
  additionalRequirements: string;
  status: string;
}

export class ClassroomBooking extends Model<ClassroomBookingAttributes> implements ClassroomBookingAttributes {
  public id!: string;
  public requestingOfficerName!: string;
  public designation!: string;
  public requestingOfficerEmail!: string;
  public courseName!: string;
  public audienceType!: string;
  public batchCode!: string;
  public numberOfParticipants!: number;
  public dateFrom!: string;
  public dateTo!: string;
  public courseCoordinator!: string;
  public timeFrom!: string;
  public timeTo!: string;
  public preferredDaysOfWeek!: string[];
  public paidCourse!: string;
  public classroomId!: string;
  public exam!: string;
  public additionalRequirements!: string;
  public status!: string;
}

ClassroomBooking.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requestingOfficerName: { type: DataTypes.STRING, allowNull: false },
  designation: { type: DataTypes.STRING, allowNull: false },
  requestingOfficerEmail: { type: DataTypes.STRING, allowNull: false },
  courseName: { type: DataTypes.STRING, allowNull: false },
  audienceType: { type: DataTypes.STRING, allowNull: false },
  batchCode: { type: DataTypes.STRING, allowNull: false },
  numberOfParticipants: { type: DataTypes.INTEGER, allowNull: false },
  dateFrom: { type: DataTypes.STRING, allowNull: false },
  dateTo: { type: DataTypes.STRING, allowNull: false },
  courseCoordinator: { type: DataTypes.STRING, allowNull: false },
  timeFrom: { type: DataTypes.STRING, allowNull: false },
  timeTo: { type: DataTypes.STRING, allowNull: false },
  preferredDaysOfWeek: { 
    type: DataTypes.JSON, 
    defaultValue: [],
    get() {
      const rawValue = this.getDataValue('preferredDaysOfWeek');
      if (typeof rawValue === 'string') {
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          return [];
        }
      }
      return rawValue || [];
    }
  },
  paidCourse: { type: DataTypes.STRING, allowNull: false },
  classroomId: { type: DataTypes.UUID, allowNull: false },
  exam: { type: DataTypes.STRING, allowNull: false },
  additionalRequirements: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }
}, {
  sequelize,
  tableName: 'classroom_bookings'
});
